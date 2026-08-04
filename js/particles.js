/**
 * CANVAS PARTICLE ENGINE (Floating Sparkles & Petals)
 * 
 * Renders lightweight floating golden sparkles and gentle petals
 * on the background HTML5 canvas overlay.
 */

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.particleCount = 35;

    this.resizeCanvas();
    this.initParticles();
    this.bindEvents();
    this.animate();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindEvents() {
    window.addEventListener("resize", () => this.resizeCanvas());
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    const isPetal = Math.random() > 0.6;
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      radius: isPetal ? Math.random() * 4 + 2 : Math.random() * 2 + 1,
      speedY: Math.random() * 0.5 + 0.2,
      speedX: Math.sin(Math.random() * Math.PI) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
      color: isPetal ? '#D4674A' : '#C24426',
      isPetal: isPetal,
      rotation: Math.random() * 360,
      spinSpeed: (Math.random() - 0.5) * 1.5
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let p of this.particles) {
      this.ctx.save();
      this.ctx.globalAlpha = p.opacity;

      if (p.isPetal) {
        // Draw soft golden petal shape
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.beginPath();
        this.ctx.fillStyle = p.color;
        this.ctx.ellipse(0, 0, p.radius, p.radius * 2, 0, 0, Math.PI * 2);
        this.ctx.fill();
        p.rotation += p.spinSpeed;
      } else {
        // Draw glowing sparkle point
        this.ctx.beginPath();
        this.ctx.fillStyle = p.color;
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();

      // Physics update
      p.y -= p.speedY; // float upward gently
      p.x += Math.sin(p.y * 0.01) * 0.3 + p.speedX;

      // Wrap around screen top/bottom
      if (p.y < -20) {
        p.y = this.canvas.height + 20;
        p.x = Math.random() * this.canvas.width;
      }
      if (p.x < -20 || p.x > this.canvas.width + 20) {
        p.x = Math.random() * this.canvas.width;
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Auto instantiate on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  new ParticleEngine("particle-canvas");
});
