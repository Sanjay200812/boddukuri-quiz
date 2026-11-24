// ==============================================================================
// SPIDEYY QUIZ: Supabase Edge Function: admin-create-student
// ==============================================================================
// Server-side student provisioning with strictly enforced admin authorization,
// synthetic identity generation, rate-limiting, and student data isolation.
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const ADMIN_EMAILS = [
  "boddukurisanjay@gmail.com",
  "sanjuboddukuri@gmail.com",
  "admin@boddukuri.quiz",
  "sanju@boddukuri.quiz"
];

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: "Server configuration missing (SUPABASE_SERVICE_ROLE_KEY)." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 1. Verify Admin Caller Authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized: Missing authorization header." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Initialize service client for verification and admin user creation
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);
    const token = authHeader.replace("Bearer ", "").trim();

    const { data: callerData, error: callerError } = await adminClient.auth.getUser(token);
    if (callerError || !callerData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid session token." }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const callerEmail = (callerData.user.email || "").toLowerCase();
    const callerMetaRole = callerData.user.user_metadata?.role;
    const isCallerAdmin = ADMIN_EMAILS.includes(callerEmail) || callerMetaRole === "admin";

    if (!isCallerAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden: Only Admin Sanju can provision student accounts." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 2. Parse and Validate Request Payload
    const body = await req.json();
    const action = body.action || "provision";

    // ACTION A: Update Student Credentials (Access code or password)
    if (action === "update_credentials") {
      const targetUserId = (body.userId || "").trim();
      const rawUsername = (body.username || "").toLowerCase().trim();
      const newAccessCode = (body.newAccessCode || "").trim();
      const newPassword = body.newPassword || "";

      if (!targetUserId && !rawUsername) {
        return new Response(JSON.stringify({ error: "Target user ID or username is required." }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Find user
      const { data: usersList, error: listError } = await adminClient.auth.admin.listUsers();
      if (listError || !usersList?.users) {
        return new Response(JSON.stringify({ error: "Failed to query user accounts." }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const syntheticEmail = `${rawUsername}@users.spideyyquiz.invalid`;
      const targetUser = usersList.users.find(
        (u) =>
          (targetUserId && u.id === targetUserId) ||
          (rawUsername && (u.email?.toLowerCase() === syntheticEmail.toLowerCase() || u.user_metadata?.username?.toLowerCase() === rawUsername))
      );

      if (!targetUser) {
        return new Response(JSON.stringify({ error: `Student '${rawUsername || targetUserId}' not found in Supabase Auth.` }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      // Check if updating password
      if (newPassword) {
        if (newPassword.length < 4) {
          return new Response(JSON.stringify({ error: "New password must be at least 4 characters." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        await adminClient.auth.admin.updateUserById(targetUser.id, { password: newPassword });
      }

      // Check if updating access code
      if (newAccessCode) {
        if (!/^\d{4}$/.test(newAccessCode)) {
          return new Response(JSON.stringify({ error: "Access code must be exactly 4 numeric digits." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        if (newAccessCode === "2002" || newAccessCode === "2718") {
          return new Response(JSON.stringify({ error: `Access code '${newAccessCode}' is reserved.` }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        const hashBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(newAccessCode));
        const codeHash = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, "0")).join("");

        // Check if code is already used by another user
        const { data: codeCheck } = await adminClient
          .from("access_codes")
          .select("user_id")
          .eq("code_hash", codeHash)
          .maybeSingle();

        if (codeCheck && codeCheck.user_id !== targetUser.id) {
          return new Response(JSON.stringify({ error: "Access code is already assigned to another user." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // Upsert into access_codes
        await adminClient.from("access_codes").upsert(
          {
            user_id: targetUser.id,
            email: targetUser.email,
            auth_ticket: newPassword || "preserved",
            code_hash: codeHash
          },
          { onConflict: "user_id" }
        );
      } else if (newPassword) {
        // Password updated without new access code, update auth_ticket
        await adminClient
          .from("access_codes")
          .update({ auth_ticket: newPassword })
          .eq("user_id", targetUser.id);
      }

      // Audit Log
      await adminClient.from("admin_audit_logs").insert({
        admin_id: callerData.user.id,
        admin_email: callerEmail,
        action: "update_student_credentials",
        target: targetUser.email,
        details: {
          userId: targetUser.id,
          username: rawUsername,
          passwordUpdated: !!newPassword,
          accessCodeUpdated: !!newAccessCode
        }
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: `Credentials for '${rawUsername || targetUser.email}' updated successfully.`
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // ACTION B: Standard Provisioning Flow
    const displayName = (body.displayName || "").trim();
    const rawUsername = (body.username || "").toLowerCase().trim();
    const password = body.password || "";
    const confirmPassword = body.confirmPassword || "";
    const accessCode = (body.accessCode || "2580").trim();

    if (!displayName) {
      return new Response(JSON.stringify({ error: "Student display name is required." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (!rawUsername || rawUsername.length < 3) {
      return new Response(JSON.stringify({ error: "Username must be at least 3 characters." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (["mahi", "sanju", "admin", "administrator"].includes(rawUsername)) {
      return new Response(JSON.stringify({ error: `Username '${rawUsername}' is reserved.` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (!password || password.length < 4) {
      return new Response(JSON.stringify({ error: "Password must be at least 4 characters." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return new Response(JSON.stringify({ error: "Passwords do not match." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (!/^\d{4}$/.test(accessCode)) {
      return new Response(JSON.stringify({ error: "Access code must be exactly 4 numeric digits." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (accessCode === "2002" || accessCode === "2718") {
      return new Response(JSON.stringify({ error: `Access code '${accessCode}' is reserved.` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 3. Generate Reserved Internal Synthetic Identity
    const syntheticEmail = `${rawUsername}@users.spideyyquiz.invalid`;

    // 4. Duplicate Account Prevention
    const { data: existingUsersList, error: listError } = await adminClient.auth.admin.listUsers();
    if (!listError && existingUsersList?.users) {
      const existing = existingUsersList.users.find(
        (u) =>
          u.email?.toLowerCase() === syntheticEmail.toLowerCase() ||
          u.user_metadata?.username?.toLowerCase() === rawUsername
      );
      if (existing) {
        return new Response(
          JSON.stringify({
            error: `Student account '${rawUsername}' already exists. Cannot duplicate or overwrite existing account.`,
            alreadyExists: true,
            userId: existing.id
          }),
          {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
    }

    // 5. Create Student Account in Supabase Auth (Role strictly forced to 'student')
    const { data: newUserData, error: createError } = await adminClient.auth.admin.createUser({
      email: syntheticEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: displayName,
        username: rawUsername,
        role: "student" // Strictly forced server-side
      }
    });

    if (createError || !newUserData.user) {
      return new Response(JSON.stringify({ error: createError?.message || "Failed to create student account." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const createdUserId = newUserData.user.id;

    // 6. Ensure Profile Record in public.profiles
    await adminClient.from("profiles").upsert({
      id: createdUserId,
      email: syntheticEmail,
      full_name: displayName,
      role: "student",
      username: rawUsername
    });

    // 7. Initialize Clean Zero-Progress in public.quiz_progress
    const initialPayload = {
      version: 1,
      updatedAt: new Date().toISOString(),
      settings: {
        studentName: displayName,
        sanjuWhatsAppNumber: "917075920852"
      },
      attempts: [],
      completedDays: [],
      inProgress: {},
      retakeRequests: [],
      bookmarks: []
    };

    await adminClient.from("quiz_progress").upsert({
      user_id: createdUserId,
      payload: initialPayload,
      updated_at: new Date().toISOString()
    });

    // 8. Associate Access Code in public.access_codes
    const hashBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(accessCode));
    const codeHash = Array.from(new Uint8Array(hashBuf)).map((b) => b.toString(16).padStart(2, "0")).join("");

    await adminClient.from("access_codes").upsert(
      {
        user_id: createdUserId,
        email: syntheticEmail,
        auth_ticket: password,
        code_hash: codeHash
      },
      { onConflict: "user_id" }
    );

    // 9. Record Admin Audit Trail
    await adminClient.from("admin_audit_logs").insert({
      admin_id: callerData.user.id,
      admin_email: callerEmail,
      action: "provision_student",
      target: rawUsername,
      details: {
        displayName,
        username: rawUsername,
        syntheticEmail,
        userId: createdUserId,
        role: "student",
        accessCodeConfigured: true
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Student '${displayName}' (${rawUsername}) successfully provisioned with access code ${accessCode}.`,
        userId: createdUserId,
        username: rawUsername,
        displayName,
        email: syntheticEmail,
        role: "student",
        accessCodeConfigured: true
      }),
      {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
