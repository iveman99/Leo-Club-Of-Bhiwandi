document.addEventListener("DOMContentLoaded", () => {
    console.log("particles.js script loaded and executing...");
    const canvas = document.getElementById("philosophy-canvas");
    if (!canvas) {
        console.error("particles.js: #philosophy-canvas not found in DOM");
        return;
    }
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    console.log("particles.js: Canvas element found and context initialized.");

    let width, height;
    let particles = [];
    let animationStarted = false;
    let animationFrameId;

    // Subtitles and Final Elements
    const sub1 = document.getElementById("subtitle-1");
    const sub2 = document.getElementById("subtitle-2");
    const sub3 = document.getElementById("subtitle-3");
    const finalLogo = document.getElementById("final-leo-logo");
    const finalText = document.getElementById("final-leo-text");

    const colors = {
        gold: "#d4a017",
        blue: "#2ac3ff",
        neon: "#10b981",
        white: "#ffffff"
    };

    function resize() {
        // Fallback to window dimensions if parent is collapsed
        width = canvas.parentElement.clientWidth || window.innerWidth * 0.9;
        // Make sure height has a fallback! The parent may be 0 height on mobile due to absolute children
        height = canvas.parentElement.clientHeight > 100 ? canvas.parentElement.clientHeight : 450;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener("resize", resize);
    resize();

    // Particle Class
    class Particle {
        constructor(x, y, color) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.targetX = x;
            this.targetY = y;
            this.color = color;
            this.size = Math.random() * 1.5 + 1;
            this.vx = 0;
            this.vy = 0;
            this.friction = 0.85;
            this.ease = 0.05 + Math.random() * 0.05;
            this.alpha = 1;
        }

        update() {
            let dx = this.targetX - this.x;
            let dy = this.targetY - this.y;
            this.vx += dx * this.ease;
            this.vy += dy * this.ease;
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.x += this.vx;
            this.y += this.vy;

            // Occasional jitter for "glowing/active" feel
            if (Math.random() < 0.05) {
                this.x += (Math.random() - 0.5) * 2;
                this.y += (Math.random() - 0.5) * 2;
            }
        }

        draw() {
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        }
    }

    // Extract text coordinates using offscreen canvas
    function getTextData(text, color) {
        const offscreen = document.createElement("canvas");
        const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
        offscreen.width = width;
        offscreen.height = height;

        // Determine font size based on screen width
        const fontSize = width < 600 ? 50 : 80;

        // Fill canvas with black first, then write white text to ensure high contrast extraction
        offCtx.fillStyle = "black";
        offCtx.fillRect(0, 0, width, height);

        offCtx.font = `bold ${fontSize}px "Orbitron", sans-serif`;
        offCtx.textAlign = "center";
        offCtx.textBaseline = "middle";

        offCtx.fillStyle = "white";
        // Shift text slightly up to leave room for subtitle
        offCtx.fillText(text, width / 2, height / 2 - 40);

        const data = offCtx.getImageData(0, 0, width, height).data;
        const coordinates = [];

        // Sample pixels to create particles (adjust step for particle density)
        const step = width < 600 ? 3 : 4;
        for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
                const index = (y * width + x) * 4;
                const r = data[index]; // get Red channel to detect white text on black background
                if (r > 128) {
                    coordinates.push({ x, y, color });
                }
            }
        }

        console.log(`Generated ${coordinates.length} coordinates for text: ${text}`);
        return coordinates;
    }

    function transitionToText(text, color) {
        const coords = getTextData(text, color);

        // Match existing particles to new coordinates
        for (let i = 0; i < coords.length; i++) {
            if (i < particles.length) {
                particles[i].targetX = coords[i].x;
                particles[i].targetY = coords[i].y;
                particles[i].color = color;
                particles[i].alpha = 1;
                // Add explosion effect when finding new target
                particles[i].vx = (Math.random() - 0.5) * 20;
                particles[i].vy = (Math.random() - 0.5) * 20;
            } else {
                particles.push(new Particle(coords[i].x, coords[i].y, color));
            }
        }

        // Hide extra particles if the new word is shorter
        if (coords.length < particles.length) {
            for (let i = coords.length; i < particles.length; i++) {
                particles[i].alpha = 0; // Fade out or let them wander
                particles[i].targetX = width / 2;
                particles[i].targetY = height / 2;
            }
        }
    }

    function formCenterLogo() {
        particles.forEach(p => {
            p.targetX = width / 2;
            p.targetY = height / 2 - 60; // Target the logo center
            p.color = colors.gold;
            // Explosion before converging
            p.vx = (Math.random() - 0.5) * 50;
            p.vy = (Math.random() - 0.5) * 50;
        });

        // Gradually fade out particles as they converge
        let fadeInterval = setInterval(() => {
            let allFaded = true;
            particles.forEach(p => {
                p.alpha -= 0.05;
                if (p.alpha > 0) allFaded = false;
            });
            if (allFaded) {
                clearInterval(fadeInterval);
                particles = []; // Clear array
            }
        }, 100);
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Connect nearby particles for a glowing constellation effect
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        for (let i = 0; i < particles.length; i++) {
            if (particles[i].alpha <= 0) continue;

            particles[i].update();
            particles[i].draw();

            // Connect very close particles (creates solid word look)
            for (let j = i + 1; j < particles.length; j++) {
                if (particles[j].alpha <= 0) continue;
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 8) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        if (animationStarted) {
            animationFrameId = requestAnimationFrame(draw);
        }
    }

    function runAnimationSequence() {
        animationStarted = true;
        draw();

        // Step 1: Leadership
        transitionToText("LEADERSHIP", colors.gold);
        sub1.classList.add("active");

        // Step 2: Experience (after 4s)
        setTimeout(() => {
            sub1.classList.remove("active");
            transitionToText("EXPERIENCE", colors.blue);
            sub2.classList.add("active");
        }, 4000);

        // Step 3: Opportunity (after 8s)
        setTimeout(() => {
            sub2.classList.remove("active");
            transitionToText("OPPORTUNITY", colors.neon);
            sub3.classList.add("active");
        }, 8000);

        // Step 4: Swirl to Logo (after 12s)
        setTimeout(() => {
            sub3.classList.remove("active");
            formCenterLogo();

            // Bring in the final HTML logo and text slightly after converging
            setTimeout(() => {
                finalLogo.classList.add("active");
                finalText.classList.add("active");
            }, 1000);

            // Shut off canvas drawing after fully dissolved to save CPU
            setTimeout(() => {
                animationStarted = false;
                cancelAnimationFrame(animationFrameId);
                ctx.clearRect(0, 0, width, height);
            }, 3000);
        }, 12000);
    }

    // Trigger on scroll via Intersection Observer
    const animContainer = document.getElementById("philosophy-anim-container");
    let hasRun = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasRun) {
                hasRun = true;
                setTimeout(() => {
                    resize(); // Ensure canvas is sized properly before calculating text
                    runAnimationSequence();
                }, 500); // 500ms delay to let the user scroll into view properly before starting
            }
        });
    }, { threshold: 0.1 });

    observer.observe(animContainer);
});
