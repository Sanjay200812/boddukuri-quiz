import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // max tilt degrees (default: 8)
  glareOpacity?: number; // max glare opacity (default: 0.16)
  depth?: number; // translateZ for inner contents in px (default: 12)
  perspective?: number; // perspective distance in px (default: 1000)
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  intensity = 8,
  glareOpacity = 0.16,
  depth = 12,
  perspective = 1000,
  onClick,
  ...rest
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Raw normalized mouse coordinates (-0.5 to 0.5)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Mouse position inside element in px for glare
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for rotation
  const springConfig = { damping: 22, stiffness: 240, mass: 0.4 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Map mouse movement to rotation degrees
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-intensity, intensity]);

  // Reactive hardware-accelerated radial glare template
  const glareBg = useMotionTemplate`radial-gradient(circle 260px at ${mouseX}px ${mouseY}px, rgba(255, 120, 160, 0.28), rgba(255, 255, 255, 0.12) 35%, transparent 75%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const posX = e.clientX - rect.left;
    const posY = e.clientY - rect.top;

    mouseX.set(posX);
    mouseY.set(posY);

    // Normalize from -0.5 to 0.5
    x.set(posX / width - 0.5);
    y.set(posY / height - 0.5);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: `${perspective}px`,
      }}
      className={`relative select-none ${className}`}
      {...rest}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full relative"
      >
        {/* Child Content rendered with 3D Depth */}
        <div
          style={{
            transform: isHovered ? `translateZ(${depth}px)` : 'translateZ(0px)',
            transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="w-full h-full"
        >
          {children}
        </div>

        {/* Dynamic Specular Glare / Sheen Overlay */}
        <motion.div
          animate={{ opacity: isHovered ? glareOpacity : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden z-20"
          style={{
            transform: 'translateZ(25px)',
            background: glareBg,
          }}
        />
      </motion.div>
    </div>
  );
};
export default Card3D;
