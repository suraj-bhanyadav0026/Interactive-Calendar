import React, { useEffect, useRef, useCallback } from 'react';

export function Particles({ trigger }) {
  const canvasRef = useRef(null);

  const animateParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const particles = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: cx,
        y: cy,
        vx: (Math.random() - 0.5) * 15,
        vy: (Math.random() - 0.5) * 15,
        life: 1,
        decay: 0.02,
        color: `hsl(${220 + Math.random() * 80}, 100%, 50%)`
      });
    }

    function animate() {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;
        p.vx *= 0.97;
        p.vy *= 0.97;
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.life * 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      if (particles.some(p => p.life > 0)) requestAnimationFrame(animate);
    };
    animate();
  }, []);

  useEffect(() => {
    if (trigger) animateParticles();
  }, [trigger, animateParticles]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 1000 }} className="particles-canvas" />;
}
