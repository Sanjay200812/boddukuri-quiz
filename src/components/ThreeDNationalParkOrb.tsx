import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeDOrbProps {
  className?: string;
  size?: number;
  showBadge?: boolean;
}

export const ThreeDNationalParkOrb: React.FC<ThreeDOrbProps> = ({
  className = '',
  size = 280,
  showBadge = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Group for object rotation
    const group = new THREE.Group();
    scene.add(group);

    // 1. Core Gem (Icosahedron with ruby refraction)
    const gemGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const gemMat = new THREE.MeshPhysicalMaterial({
      color: 0x9e1030,
      emissive: 0x4a0515,
      roughness: 0.15,
      metalness: 0.25,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      flatShading: true,
      transparent: true,
      opacity: 0.94,
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    group.add(gem);

    // 2. Outer Wireframe Geodesic Lattice
    const wireGeo = new THREE.IcosahedronGeometry(1.36, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xff4d79,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    group.add(wire);

    // 3. Orbital Rings (representing meridian / latitudes of 109 National Parks)
    const ringGeo1 = new THREE.TorusGeometry(1.7, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xff3366,
      emissive: 0x9e1030,
      roughness: 0.25,
      metalness: 0.85,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(1.85, 0.016, 16, 100);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x34d399, // Emerald accent for wildlife / parks
      emissive: 0x064e3b,
      roughness: 0.25,
      metalness: 0.85,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    group.add(ring2);

    // 4. Floating Particles (representing the 109 National Parks of India)
    const particleCount = 109;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0xff4d79);
    const c2 = new THREE.Color(0x34d399);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 2.15 + (Math.random() - 0.5) * 0.45;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const mixed = Math.random() > 0.4 ? c1 : c2;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff3366, 4.5, 15);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x10b981, 3.5, 15);
    pointLight2.position.set(-4, -3, 3);
    scene.add(pointLight2);

    // Interactive Drag to Rotate (Mouse + Touch)
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let dragVelocityX = 0;
    let dragVelocityY = 0;

    let targetRotX = 0;
    let targetRotY = 0;

    const onPointerDown = (clientX: number, clientY: number) => {
      isDragging = true;
      setIsInteracting(true);
      prevMouseX = clientX;
      prevMouseY = clientY;
      dragVelocityX = 0;
      dragVelocityY = 0;
    };

    const onPointerMove = (clientX: number, clientY: number) => {
      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        const deltaY = clientY - prevMouseY;

        dragVelocityX = deltaX * 0.005;
        dragVelocityY = deltaY * 0.005;

        group.rotation.y += dragVelocityX;
        group.rotation.x += dragVelocityY;

        prevMouseX = clientX;
        prevMouseY = clientY;
      } else {
        const rect = container.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width - 0.5;
        const y = (clientY - rect.top) / rect.height - 0.5;
        targetRotY = x * 1.0;
        targetRotX = y * 0.6;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      onPointerDown(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      onPointerMove(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      onPointerUp();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      onPointerUp();
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Animation Loop with smooth inertia and damping
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Constant gentle rotation
      gem.rotation.y += 0.005;
      gem.rotation.x += 0.002;

      wire.rotation.y -= 0.004;
      wire.rotation.z += 0.002;

      ring1.rotation.z += 0.006;
      ring2.rotation.z -= 0.005;

      particles.rotation.y += 0.003;

      // Smooth floating bob
      group.position.y = Math.sin(elapsedTime * 1.5) * 0.08;

      if (!isDragging) {
        // Apply remaining drag velocity with inertia decay
        group.rotation.y += dragVelocityX;
        group.rotation.x += dragVelocityY;
        dragVelocityX *= 0.94;
        dragVelocityY *= 0.94;

        // Subtle parallax attraction
        group.rotation.x += (targetRotX - group.rotation.x) * 0.04;
        group.rotation.y += (targetRotY - group.rotation.y) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      gemGeo.dispose();
      gemMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [size]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none group cursor-grab active:cursor-grabbing ${className}`}>
      {/* Radial backlight glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#ff3366]/20 via-[#9e1030]/25 to-emerald-500/10 blur-2xl rounded-full scale-95 pointer-events-none" />

      {/* Three.js Canvas Container */}
      <div
        ref={containerRef}
        style={{ width: size, height: size }}
        aria-label="3D National Parks Interactive Visual"
        className="relative z-10"
      />

      {/* Floating Info Pill */}
      {showBadge && (
        <div className={`absolute -bottom-2 z-20 px-3 py-1 rounded-full text-[11px] font-black tracking-wide border shadow-lg backdrop-blur-md transition-all flex items-center gap-1.5 ${
          isInteracting
            ? 'bg-[#9e1030] text-white border-[#ff3366] scale-105'
            : 'bg-[#18050e]/90 text-rose-200 border-[#ff3366]/40 hover:border-[#ff3366]'
        }`}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>109 Parks • {isInteracting ? 'Rotating 3D Orb' : 'Drag to Spin 3D Orb'}</span>
        </div>
      )}
    </div>
  );
};

export default ThreeDNationalParkOrb;
