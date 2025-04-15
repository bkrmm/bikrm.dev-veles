class CustomCursor {
    constructor() {
        if (CustomCursor.instance) return CustomCursor.instance;
        CustomCursor.instance = this;

        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.opacity = '1';
        this.cursorTrail = document.createElement('div');
        this.cursorTrail.className = 'cursor-trail';
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'cursor-dot';

        this.cursor.appendChild(this.cursorTrail);
        this.cursor.appendChild(this.cursorDot);
        document.body.appendChild(this.cursor);

        this.position = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
        this.isVisible = true;
        this.isHovering = false;

        this.initStyles();
        this.initEventListeners();
        this.animate();
    }

    initStyles() {
        const styles = `
            .custom-cursor {
                position: fixed;
                pointer-events: none;
                z-index: 999999;
                opacity: 1;
                transition: opacity 0.3s ease;
            }
            .custom-cursor.hidden { opacity: 0; }
            .cursor-trail {
                position: absolute;
                width: 24px;
                height: 24px;
                border: 2px solid #6366f1;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.2s ease, height 0.2s ease, border-color 0.2s ease;
            }
            .cursor-dot {
                position: absolute;
                width: 6px;
                height: 6px;
                background: #8b5cf6;
                border-radius: 50%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                transition: background-color 0.2s ease;
            }
            .custom-cursor.hovering .cursor-trail {
                width: 40px;
                height: 40px;
                border-color: #ec4899;
            }
            .custom-cursor.hovering .cursor-dot {
                background: #ec4899;
            }
        `;
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    initEventListeners() {
        document.addEventListener('mousemove', this.onMouseMove.bind(this));
        document.addEventListener('mouseenter', () => this.setVisibility(true));
        document.addEventListener('mouseleave', () => this.setVisibility(false));

        const hoverElements = document.querySelectorAll('a, button, .feature-card, .dashboard-preview');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => this.setHoverState(true));
            element.addEventListener('mouseleave', () => this.setHoverState(false));
        });
    }

    onMouseMove(e) {
        this.target.x = e.clientX;
        this.target.y = e.clientY;
    }

    setVisibility(visible) {
        this.isVisible = visible;
        this.cursor.classList.toggle('hidden', !visible);
    }

    setHoverState(hovering) {
        this.isHovering = hovering;
        this.cursor.classList.toggle('hovering', hovering);
    }

    animate() {
        const ease = 0.15;
        
        this.position.x += (this.target.x - this.position.x) * ease;
        this.position.y += (this.target.y - this.position.y) * ease;

        this.cursor.style.left = `${this.position.x}px`;
        this.cursor.style.top = `${this.position.y}px`;
        this.cursorTrail.style.transform = `translate(-50%, -50%)`;
        this.cursorDot.style.transform = `translate(-50%, -50%)`;

        requestAnimationFrame(this.animate.bind(this));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!CustomCursor.instance) {
        new CustomCursor();
    }
});