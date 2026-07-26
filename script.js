const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth / window.innerHeight,
0.1,
1000
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({
alpha: true,
antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.zIndex = "-1";

document.body.appendChild(renderer.domElement);

// Stars
const geometry = new THREE.BufferGeometry();
const vertices = [];

for (let i = 0; i < 6000; i++) {
    vertices.push(
        (Math.random() - 0.5) * 250,
        (Math.random() - 0.5) * 250,
        (Math.random() - 0.5) * 250
    );
}

geometry.setAttribute(
'position',
new THREE.Float32BufferAttribute(vertices, 3)
);

const material = new THREE.PointsMaterial({
color: 0xffdd33,
size: 0.35
});

const stars = new THREE.Points(geometry, material);
scene.add(stars);

function animate() {
requestAnimationFrame(animate);

stars.rotation.y += 0.0007;
stars.rotation.x += 0.0002;

renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
});