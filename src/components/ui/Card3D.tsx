import React, { useRef, useState, useEffect, useCallback } from 'react';

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // max tilt degrees (default: 6 for subtle, elegant feel)
  glareOpacity?: number; // max glare opacity (default: 0.12)
  depth?: number; // translateZ for inner contents in px (default: 8)
  perspective?: number; // perspective distance in px (default: 800)
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  intensity = 6,
  glareOpacity = 0.12,
  depth = 8,
  perspective = 800,
  onClick,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [canTilt, setCanTilt] = useState(false);
  const [transformStyle, setTransformStyle] = useState<string>('rotateX(0deg) rotateY(0deg)');
  const [glarePos, setGlarePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  // Detect true hover/pointer capability and respect reduced motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateCapabilities = () => {
      setCanTilt(hoverQuery.matches && !motionQuery.matches);
    };

    updateCapabilities();
    hoverQuery.addEventListener('change', updateCapabilities);
    motionQuery.addEventListener('change', updateCapabilities);

    return () => {
      hoverQuery.removeEventListener('change', updateCapabilities);
      motionQuery.removeEventListener('change', updateCapabilities);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!cardRef.current || !canTilt) return;
    // Cache bounding client rect ONCE on enter to eliminate layout thrashing
    const r = cardRef.current.getBoundingClientRect();
    rectRef.current = { left: r.left, top: r.top, width: r.width, height: r.height };
    setIsHovered(true);
  }, [canTilt]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !rectRef.current) return;

    const { left, top, width, height } = rectRef.current;
    if (width <= 0 || height <= 0) return;

    // Cancel queued RAF to throttle to native display refresh rate
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const clientX = e.clientX;
    const clientY = e.clientY;

    rafRef.current = requestAnimationFrame(() => {
      const relX = (clientX - left) / width; // 0 to 1
      const relY = (clientY - top) / height; // 0 to 1

      const tiltX = (0.5 - relY) * intensity * 2; // -intensity to +intensity
      const tiltY = (relX - 0.5) * intensity * 2; // -intensity to +intensity

      setTransformStyle(`rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(${depth}px)`);
      setGlarePos({ x: Math.round(relX * 100), y: Math.round(relY * 100) });
    });
  }, [canTilt, intensity, depth]);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rectRef.current = null;
    setIsHovered(false);
    setTransformStyle('rotateX(0deg) rotateY(0deg) translateZ(0px)');
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: canTilt ? `${perspective}px` : undefined,
      }}
      className={`relative select-none transition-transform duration-200 ease-out ${className}`}
      {...rest}
    >
      <div
        style={{
          transform: canTilt ? transformStyle : undefined,
          transformStyle: canTilt ? 'preserve-3d' : undefined,
          transition: isHovered
            ? 'transform 0.08s ease-out'
            : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
          willChange: isHovered && canTilt ? 'transform' : 'auto',
        }}
        className="w-full h-full relative rounded-2xl"
      >
        {/* Child Content rendered with clean depth */}
        <div className="w-full h-full">
          {children}
        </div>

        {/* High-Performance Hardware-Accelerated Sheen Glare (only when active on desktop) */}
        {canTilt && (
          <div
            className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden z-20 transition-opacity duration-200"
            style={{
              opacity: isHovered ? glareOpacity : 0,
              background: `radial-gradient(circle 240px at ${glarePos.x}% ${glarePos.y}%, rgba(255, 120, 160, 0.22), rgba(255, 255, 255, 0.08) 40%, transparent 80%)`,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Card3D;
