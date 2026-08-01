const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Galaxy center position
let galaxyX = canvas.width / 2;
let galaxyY = canvas.height / 2;
let blackHoleRadius = 50;

// Mouse tracking for touch effects
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let isMouseMoving = false;

// Track mouse/touch movement
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

// Generate BILLIONS of stars
const starCount = 5000; // Visible stars (performance optimized)
const stars = [];

function createStars() {
    stars.length = 0;
    
    for (let i = 0; i < starCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 800; // Spread across screen
        
        stars.push({
            x: galaxyX + Math.cos(angle) * distance,
            y: galaxyY + Math.sin(angle) * distance,
            baseX: galaxyX + Math.cos(angle) * distance,
            baseY: galaxyY + Math.sin(angle) * distance,
            r: Math.random() * 1.5,
            opacity: Math.random() * 0.7 + 0.3,
            speed: 0.1 + Math.random() * 0.5,
            angle: angle,
            distance: distance,
            twinkle: Math.random(),
            touchEffect: 0
        });
    }
}

createStars();

// Animation variables
let rotation = 0;
let time = 0;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create starfield background
    ctx.fillStyle = "#000508";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update galaxy center (smooth movement)
    galaxyX = canvas.width / 2 + Math.sin(time * 0.0001) * 20;
    galaxyY = canvas.height / 2 + Math.cos(time * 0.00008) * 20;
    
    // Nebula/Galaxy glow effect
    const nebula = ctx.createRadialGradient(
        galaxyX, galaxyY, 100,
        galaxyX, galaxyY, 400
    );
    nebula.addColorStop(0, "rgba(200,50,255,0.15)");
    nebula.addColorStop(0.5, "rgba(100,0,255,0.08)");
    nebula.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = nebula;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw spiral galaxy structure
    ctx.save();
    ctx.translate(galaxyX, galaxyY);
    ctx.rotate(rotation);
    
    // Multiple spiral arms
    for (let arm = 0; arm < 4; arm++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 / 4) * arm);
        
        for (let i = 0; i < 300; i++) {
            let a = i * 0.05;
            let r = i * 0.8;
            
            let x = Math.cos(a) * r;
            let y = Math.sin(a) * r;
            
            ctx.beginPath();
            ctx.arc(x, y, 0.8, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200,100,255,${0.3 - (i / 300) * 0.3})`;
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    // Black hole - glowing and rotating
    const blackHoleGlow = ctx.createRadialGradient(0, 0, 20, 0, 0, blackHoleRadius + 30);
    blackHoleGlow.addColorStop(0, "rgba(255,200,100,0.8)");
    blackHoleGlow.addColorStop(0.5, "rgba(255,100,50,0.4)");
    blackHoleGlow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = blackHoleGlow;
    ctx.fillRect(-blackHoleRadius - 30, -blackHoleRadius - 30, (blackHoleRadius + 30) * 2, (blackHoleRadius + 30) * 2);
    
    // Black hole event horizon
    ctx.beginPath();
    ctx.arc(0, 0, blackHoleRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#000000";
    ctx.fill();
    
    // Accretion disk around black hole
    for (let i = 0; i < 20; i++) {
        let angle = (rotation + i * 0.3) * 2;
        let diskRadius = blackHoleRadius + 30 + i * 4;
        let x = Math.cos(angle) * diskRadius;
        let y = Math.sin(angle) * diskRadius;
        
        ctx.beginPath();
        ctx.arc(x, y, 2 + i * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,${200 - i * 5},100,${0.6 - (i / 20) * 0.5})`;
        ctx.fill();
    }
    
    ctx.restore();
    
    // Draw and animate stars
    for (const star of stars) {
        // Twinkling effect
        star.twinkle += 0.02;
        let twinkleOpacity = Math.abs(Math.sin(star.twinkle)) * 0.5 + 0.5;
        
        // Mouse/Touch interaction
        const dx = mouseX - star.x;
        const dy = mouseY - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let repelForce = 0;
        if (isMouseMoving && dist < 200) {
            repelForce = (200 - dist) / 200 * 10;
            star.touchEffect = Math.max(star.touchEffect, repelForce);
        }
        
        // Move star based on galaxy rotation
        const angle = Math.atan2(star.y - galaxyY, star.x - galaxyX);
        const distance = Math.sqrt(
            Math.pow(star.x - galaxyX, 2) + Math.pow(star.y - galaxyY, 2)
        );
        
        // Spiral motion towards black hole
        const newAngle = angle + rotation * 0.3 + (distance / 800) * 0.05;
        const speedFactor = 1 - (distance / 800);
        
        star.x = galaxyX + Math.cos(newAngle) * distance * (1 - speedFactor * 0.001);
        star.y = galaxyY + Math.sin(newAngle) * distance * (1 - speedFactor * 0.001);
        
        // Apply touch repel force
        if (star.touchEffect > 0) {
            const repelAngle = Math.atan2(star.y - mouseY, star.x - mouseX);
            star.x += Math.cos(repelAngle) * star.touchEffect;
            star.y += Math.sin(repelAngle) * star.touchEffect;
            star.touchEffect *= 0.95;
        }
        
        // Wrap around screen
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;
        
        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${star.opacity * twinkleOpacity})`;
        ctx.fill();
        
        // Star glow
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${star.opacity * twinkleOpacity * 0.3})`;
        ctx.fill();
    }
    
    // Drawing distant "billions" of stars effect with noise
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    for (let i = 0; i < 200; i++) {
        const x = (Math.sin(time * 0.00001 + i) * canvas.width * 2) % canvas.width;
        const y = (Math.cos(time * 0.00001 + i * 1.3) * canvas.height * 2) % canvas.height;
        const size = (Math.sin(i * 0.5) * 0.5 + 0.5) * 0.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    rotation += 0.002;
    time++;
    
    requestAnimationFrame(animate);
}

animate();

// Add touch feedback visual
canvas.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    createTouchRipple(touch.clientX, touch.clientY);
});

canvas.addEventListener("mousedown", (e) => {
    createTouchRipple(e.clientX, e.clientY);
});

function createTouchRipple(x, y) {
    const ripple = document.createElement("div");
    ripple.style.position = "fixed";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.style.width = "10px";
    ripple.style.height = "10px";
    ripple.style.borderRadius = "50%";
    ripple.style.border = "2px solid rgba(255,200,100,0.8)";
    ripple.style.pointerEvents = "none";
    ripple.style.transform = "translate(-50%, -50%)";
    ripple.style.zIndex = "999";
    document.body.appendChild(ripple);
    
    let size = 10;
    const interval = setInterval(() => {
        size += 8;
        ripple.style.width = size + "px";
        ripple.style.height = size + "px";
        ripple.style.opacity = 1 - (size / 200);
        
        if (size > 200) {
            clearInterval(interval);
            ripple.remove();
        }
    }, 20);
}
