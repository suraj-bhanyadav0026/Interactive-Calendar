import React, { useEffect, useRef, useCallback } from 'react';

export function Particles({ trigger }) {
  const canvasRef = useRef(null);

  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const particles = [];
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        color: `hsl(${200 + Math.random() * 60}, 100%, 60%)`
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.vx *= 0.98;
        p.vy *= 0.98;
        ctx.fillStyle = p.color.replace('60%', `${40 + p.life * 20}%`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.life * 4, 0, Math.PI * 2);
        ctx.fill();
      });
      if (particles.some(p => p.life > 0)) requestAnimationFrame(animate);
    };
    animate();
  }, []);

  useEffect(() => {
    if (trigger) animateParticles();
  }, [trigger, animateParticles]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', zIndex: 10 }} />;
}
