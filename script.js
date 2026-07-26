const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Load background ONCE
const bg = new Image();
bg.src = "space.jpg";

// Stars
const stars = [];
for (let i = 0; i < 1200; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5,
        s: 0.2 + Math.random() * 0.5
    });
}

let rot = 0;

function animate() {

    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(bg.complete){
        ctx.drawImage(bg,0,0,canvas.width,canvas.height);
    }

    // Nebula
    const g = ctx.createRadialGradient(
        canvas.width*0.7,canvas.height*0.3,50,
        canvas.width*0.7,canvas.height*0.3,350
    );
    g.addColorStop(0,"rgba(90,0,180,0.30)");
    g.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=g;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // Black Hole
    ctx.save();
    ctx.translate(canvas.width*0.72,canvas.height*0.28);
    ctx.rotate(rot);

    for(let i=0;i<500;i++){
        let a=i*0.3;
        let r=i*0.35;

        let x=Math.cos(a)*r;
        let y=Math.sin(a)*r;

        ctx.beginPath();
        ctx.arc(x,y,1.2,0,Math.PI*2);
        ctx.fillStyle="rgba(255,210,80,0.6)";
        ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(0,0,45,0,Math.PI*2);
    ctx.fillStyle="black";
    ctx.fill();

    ctx.restore();

    rot+=0.002;

    // Moving stars
    for(const star of stars){

        ctx.beginPath();
        ctx.arc(star.x,star.y,star.r,0,Math.PI*2);
        ctx.fillStyle="white";
        ctx.fill();

        star.y+=star.s;

        if(star.y>canvas.height){
            star.y=0;
            star.x=Math.random()*canvas.width;
        }
    }

    requestAnimationFrame(animate);
}

bg.onload=animate;