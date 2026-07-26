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

renderer.setPixelRatio(window.devicePixelRatio);

renderer.domElement.style.position = "fixed";
renderer.domElement.style.top = "0";
renderer.domElement.style.left = "0";
renderer.domElement.style.width = "100%";
renderer.domElement.style.height = "100%";
renderer.domElement.style.zIndex = "-1";

document.body.appendChild(renderer.domElement);

// Stars
const geometry = new THREE.BufferGeometry();

const vertices = [];

for (let i = 0; i < 12000; i++) {

vertices.push(

(Math.random() - 0.5) * 300,

(Math.random() - 0.5) * 300,

(Math.random() - 0.5) * 300

);

}

geometry.setAttribute(
"position",
new THREE.Float32BufferAttribute(vertices,3)
);

const material = new THREE.PointsMaterial({

color:0xffdd55,

size:0.08,

transparent:true,

opacity:1,

sizeAttenuation:true

});

const stars = new THREE.Points(geometry,material);

scene.add(stars);

// Animation
function animate(){

requestAnimationFrame(animate);

stars.rotation.y += 0.0004;

stars.rotation.x += 0.0001;

renderer.render(scene,camera);

}

animate();

// Resize
window.addEventListener("resize",()=>{

camera.aspect=window.innerWidth/window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth,window.innerHeight);

});