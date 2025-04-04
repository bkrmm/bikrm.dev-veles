// Particles.js - Financial flow animation
// This script creates subtle animated particles that represent financial data flows

class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.animationFrame = null;
        this.isActive = false;
        
        // Glow effect settings
        this.glowRadius = 150; // Mouse proximity radius for glow effect (reduced from 250)
        this.maxGlowIntensity = 0.4; // Maximum glow intensity (increased from 0.8)
        
        // Financial theme colors
        this.colors = [
            'rgba(99, 102, 241, 0.4)',  // Primary (indigo)
            'rgba(139, 92, 246, 0.3)',   // Mid (purple)
            'rgba(236, 72, 153, 0.3)',   // Accent (pink)
        ];
        
        // Glow colors (brighter versions of theme colors)
        this.glowColors = [
            'rgba(132, 134, 245, 0.8)',  // Primary (indigo)
            'rgba(167, 139, 250, 0.8)',   // Mid (purple)
            'rgba(244, 114, 182, 0.8)',   // Accent (pink)
        ];
        
        // Initialize the system
        this.init();
    }
    
    init() {
        // Setup canvas
        this.canvas.classList.add('particle-canvas');
        document.querySelector('.gradient-background').appendChild(this.canvas);
        
        // Set canvas to full screen
        this.resizeCanvas();
        
        // Create initial particles
        this.createParticles();
        
        // Add event listeners
        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        
        // Start animation
        this.animate();
        this.isActive = true;
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Recreate particles when resizing
        this.createParticles();
    }
    
    createParticles() {
        // Clear existing particles
        this.particles = [];
        
        // Calculate number of particles based on screen size
        const particleCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
        
        for (let i = 0; i < particleCount; i++) {
            const colorIndex = Math.floor(Math.random() * this.colors.length);
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                baseSize: Math.random() * 3 + 1, // Store original size
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: this.colors[colorIndex],
                glowColor: this.glowColors[colorIndex],
                opacity: Math.random() * 0.5 + 0.2,
                baseOpacity: Math.random() * 0.5 + 0.2, // Store original opacity
                // Financial data simulation
                value: Math.floor(Math.random() * 1000) / 10,
                isRising: Math.random() > 0.5,
                // Glow effect properties
                glowIntensity: 0,
                distanceToMouse: Infinity
            });
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Sort particles by glow intensity to render glowing particles on top
        const sortedParticles = [...this.particles].sort((a, b) => a.glowIntensity - b.glowIntensity);
        
        sortedParticles.forEach(particle => {
            // Draw connecting lines between nearby particles
            this.particles.forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    // Enhance line opacity based on glow intensity
                    const lineOpacity = 0.15 * (1 - distance / 100) * (1 + Math.max(particle.glowIntensity, otherParticle.glowIntensity) * 1.5);
                    
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(99, 102, 241, ${lineOpacity})`;
                    this.ctx.lineWidth = 0.6;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
            
            // Draw glow effect for particles near the mouse
            if (particle.glowIntensity > 0) {
                // Create radial gradient for glow effect
                const gradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, particle.size,
                    particle.x, particle.y, particle.size * (3 + particle.glowIntensity * 3)
                );
                
                // Extract RGB values from the particle's glow color
                const colorMatch = particle.glowColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
                if (colorMatch) {
                    const [_, r, g, b] = colorMatch;
                    
                    // Create gradient stops with enhanced opacity
                    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.9 * particle.glowIntensity})`);
                    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
                    
                    // Draw glow
                    this.ctx.beginPath();
                    this.ctx.arc(particle.x, particle.y, particle.size * (3 + particle.glowIntensity * 2), 0, Math.PI * 2);
                    this.ctx.fillStyle = gradient;
                    this.ctx.fill();
                }
            }
            
            // Draw the particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            
            // Use glow color with adjusted opacity for glowing particles
            if (particle.glowIntensity > 0) {
                const colorMatch = particle.glowColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
                if (colorMatch) {
                    const [_, r, g, b] = colorMatch;
                    this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.opacity})`;
                } else {
                    this.ctx.fillStyle = particle.color;
                }
            } else {
                this.ctx.fillStyle = particle.color;
            }
            
            this.ctx.fill();
        });
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Calculate distance to mouse for glow effect and attraction
            let distanceToMouse = Infinity;
            if (this.mouseX && this.mouseY) {
                const dx = this.mouseX - particle.x;
                const dy = this.mouseY - particle.y;
                distanceToMouse = Math.sqrt(dx * dx + dy * dy);
                particle.distanceToMouse = distanceToMouse;
                
                // Mouse interaction - subtle attraction
                if (distanceToMouse < 200) {
                    particle.x += dx * 0.01 * (1 - distanceToMouse / 200);
                    particle.y += dy * 0.01 * (1 - distanceToMouse / 200);
                }
                
                // Update glow intensity based on mouse proximity
                if (distanceToMouse < this.glowRadius) {
                    // Calculate glow intensity (1 at center, 0 at radius edge)
                    particle.glowIntensity = (1 - distanceToMouse / this.glowRadius) * this.maxGlowIntensity;
                    
                    // Enhance size and opacity based on glow intensity
                    particle.size = particle.baseSize * (1 + particle.glowIntensity * 0.8);
                    particle.opacity = Math.min(1, particle.baseOpacity * (1 + particle.glowIntensity * 1.2));
                } else {
                    // Reset glow properties when out of range
                    particle.glowIntensity = 0;
                    
                    // Gradually return to base values when not glowing
                    particle.size = particle.baseSize;
                    particle.opacity = particle.baseOpacity;
                }
            } else {
                // Reset glow when no mouse position
                particle.glowIntensity = 0;
                particle.size = particle.baseSize;
                particle.opacity = particle.baseOpacity;
            }
            
            // Simulate financial data changes
            if (Math.random() > 0.95) {
                particle.isRising = !particle.isRising;
            }
            
            if (particle.isRising) {
                particle.value += Math.random() * 0.2;
                if (particle.baseSize < 4) {
                    particle.baseSize += 0.01;
                    if (!particle.glowIntensity) particle.size = particle.baseSize;
                }
            } else {
                particle.value -= Math.random() * 0.2;
                if (particle.baseSize > 1) {
                    particle.baseSize -= 0.01;
                    if (!particle.glowIntensity) particle.size = particle.baseSize;
                }
            }
            
            // Boundary check with wrap-around
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
        });
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        this.isActive = false;
    }
}

// Initialize the particle system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create the particle system with a slight delay to ensure other elements are loaded
    setTimeout(() => {
        window.particleSystem = new ParticleSystem();
    }, 500);
});