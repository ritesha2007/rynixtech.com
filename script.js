const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const stars = [];

for (let i = 0; i < 1200; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5,
        s: 0.1 + Math.random() * 0.4
    });
}

let galaxyRotation = 0;

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background image
    const bg = new Image();
    bg.src = "space.jpg";
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

    // Rotating galaxy
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(galaxyRotation);

    for (let i = 0; i < 700; i++) {
        let angle = i * 0.35;
        let radius = i * 0.45;

        let x = Math.cos(angle) * radius;
        let y = Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,220,120,0.75)";
        ctx.fill();
    }

    ctx.restore();

    galaxyRotation += 0.0003;

    // Moving stars
    for (let star of stars) {

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        star.y += star.s;

        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    }

    requestAnimationFrame(animate);
}

animate();