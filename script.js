// Galaxy Animation Engine
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

// Resize canvas
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Galaxy variables
let galaxyX = canvas.width / 2;
let galaxyY = canvas.height / 2;
let rotation = 0;
let time = 0;
const blackHoleRadius = 50;

// Mouse/Touch tracking
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let isMouseMoving = false;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseMoving = true;
});

document.addEventListener("touchmove", (e) => {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;
    isMouseMoving = true;
});

document.addEventListener("mouseleave", () => {
    isMouseMoving = false;
});

// Create billions of stars
const starCount = 8000;
const stars = [];

function createStars() {
    stars.length = 0;
    for (let i = 0; i < starCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 1000;
        
        stars.push({
            x: galaxyX + Math.cos(angle) * distance,
            y: galaxyY + Math.sin(angle) * distance,
            r: Math.random() * 2,
            opacity: 0.3 + Math.random() * 0.7,
            angle: angle,
            distance: distance,
            twinkle: Math.random() * Math.PI * 2,
            touchEffect: 0
        });
    }
}

createStars();

// Animation loop
function animate() {
    // Clear canvas
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update galaxy center (slow drift)
    galaxyX = canvas.width / 2 + Math.sin(time * 0.00005) * 30;
    galaxyY = canvas.height / 2 + Math.cos(time * 0.00004) * 30;
    
    // Nebula glow
    const nebula = ctx.createRadialGradient(galaxyX, galaxyY, 50, galaxyX, galaxyY, 500);
    nebula.addColorStop(0, "rgba(255, 0, 150, 0.3)");
    nebula.addColorStop(0.5, "rgba(0, 100, 255, 0.1)");
    nebula.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = nebula;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw spiral galaxy arms
    ctx.save();
    ctx.translate(galaxyX, galaxyY);
    ctx.rotate(rotation);
    
    for (let arm = 0; arm < 4; arm++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 / 4) * arm);
        
        for (let i = 0; i < 400; i++) {
            const angle = i * 0.04;
            const radius = i * 0.6;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            ctx.beginPath();
            ctx.arc(x, y, 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(150, 50, 255, ${0.4 - (i / 400) * 0.4})`;
            ctx.fill();
        }
        ctx.restore();
    }
    
    // Black hole glow
    const bhGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, blackHoleRadius + 40);
    bhGlow.addColorStop(0, "rgba(255, 150, 50, 1)");
    bhGlow.addColorStop(0.6, "rgba(255, 50, 0, 0.4)");
    bhGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = bhGlow;
    ctx.beginPath();
    ctx.arc(0, 0, blackHoleRadius + 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Accretion disk
    for (let i = 0; i < 25; i++) {
        const diskAngle = rotation * 3 + i * 0.25;
        const diskRadius = blackHoleRadius + 20 + i * 3;
        const px = Math.cos(diskAngle) * diskRadius;
        const py = Math.sin(diskAngle) * diskRadius;
        
        ctx.beginPath();
        ctx.arc(px, py, 3 + i * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 50, ${0.7 - i * 0.02})`;
        ctx.fill();
    }
    
    // Black hole center
    ctx.beginPath();
    ctx.arc(0, 0, blackHoleRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#000000";
    ctx.fill();
    
    ctx.restore();
    
    // Draw stars
    for (let star of stars) {
        // Twinkling
        star.twinkle += 0.03;
        const twinkle = Math.abs(Math.sin(star.twinkle)) * 0.6 + 0.4;
        
        // Mouse repel
        if (isMouseMoving) {
            const dx = star.x - mouseX;
            const dy = star.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 250) {
                const force = (250 - dist) / 250 * 15;
                const angle = Math.atan2(dy, dx);
                star.x += Math.cos(angle) * force;
                star.y += Math.sin(angle) * force;
                star.touchEffect = force;
            }
        }
        
        // Orbit around galaxy
        const angleToGalaxy = Math.atan2(star.y - galaxyY, star.x - galaxyX);
        const distToGalaxy = Math.sqrt(Math.pow(star.x - galaxyX, 2) + Math.pow(star.y - galaxyY, 2));
        
        const newAngle = angleToGalaxy + rotation * 0.25 + (distToGalaxy / 1000) * 0.02;
        const newDist = distToGalaxy * (1 - 0.0001);
        
        star.x = galaxyX + Math.cos(newAngle) * newDist;
        star.y = galaxyY + Math.sin(newAngle) * newDist;
        
        // Wrap around
        if (star.x < -100) star.x = canvas.width + 100;
        if (star.x > canvas.width + 100) star.x = -100;
        if (star.y < -100) star.y = canvas.height + 100;
        if (star.y > canvas.height + 100) star.y = -100;
        
        // Draw star with glow
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.fill();
        
        // Glow effect
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 200, 255, ${star.opacity * twinkle * 0.3})`;
        ctx.fill();
    }
    
    // Background distant stars
    for (let i = 0; i < 300; i++) {
        const x = (Math.sin(time * 0.00001 + i * 12.5) * canvas.width * 2) % canvas.width;
        const y = (Math.cos(time * 0.00001 + i * 8.7) * canvas.height * 2) % canvas.height;
        const size = (Math.sin(i * 0.123) * 0.5 + 0.5) * 0.3;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fill();
    }
    
    rotation += 0.001;
    time++;
    
    requestAnimationFrame(animate);
}

animate();

// Touch ripple effect
function createTouchRipple(x, y) {
    const ripple = document.createElement("div");
    ripple.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 15px;
        height: 15px;
        border: 2px solid rgba(255, 150, 50, 0.9);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 999;
    `;
    document.body.appendChild(ripple);
    
    let size = 15;
    const interval = setInterval(() => {
        size += 12;
        ripple.style.width = size + "px";
        ripple.style.height = size + "px";
        ripple.style.opacity = 1 - (size / 250);
        
        if (size > 250) {
            clearInterval(interval);
            ripple.remove();
        }
    }, 15);
}

canvas.addEventListener("click", (e) => createTouchRipple(e.clientX, e.clientY));
canvas.addEventListener("touchstart", (e) => createTouchRipple(e.touches[0].clientX, e.touches[0].clientY));
