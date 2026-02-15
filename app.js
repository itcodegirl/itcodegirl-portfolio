gsap.registerPlugin(ScrollTrigger);

// =======================
// INTRO ANIMATION (GSAP)
// =======================

window.addEventListener("load", () => {
	const intro = document.querySelector(".intro");
	const spans = document.querySelectorAll(".intro-text span");

	const tl = gsap.timeline({
		defaults: { ease: "power3.out" },
		onComplete: () => intro.style.display = "none"
	});

	// Cinematic name reveal
	tl.fromTo(
		spans,
		{ autoAlpha: 0, y: 40, filter: "blur(10px)" },
		{
			autoAlpha: 1,
			y: 0,
			filter: "blur(0px)",
			duration: 1.3,
			stagger: 0.22
		}
	);

	// Smooth upward reveal of the entire overlay
	tl.to(intro, {
		y: "-100%",
		duration: 1.45,
		ease: "power4.inOut",
		delay: 0.25
	});
});


/* =========================
	 Hero And Section Animations (GSAP)
========================= */
gsap.from(".hero-inner > *", {
	y: 60,
	autoAlpha: 0,
	duration: 1.2,
	stagger: 0.18,
	ease: "power4.out"
});


/* =========================
	 Subtle WebGL Background
========================= */

const canvas = document.getElementById("webgl");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({
	canvas,
	alpha: true,
	antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const geometry = new THREE.PlaneGeometry(4, 4, 64, 64);

const material = new THREE.ShaderMaterial({
	uniforms: {
		uTime: { value: 0 }
	},
	vertexShader: `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
	fragmentShader: `
    uniform float uTime;
    varying vec2 vUv;

    void main(){
      float wave = sin(vUv.x * 8.0 + uTime) * 0.01;
      vec3 base = vec3(0.06, 0.07, 0.1);
      vec3 color = base + wave;
      gl_FragColor = vec4(color, 0.9);
    }
  `
});

const mesh = new THREE.Mesh(geometry, material);
mesh.position.z = -1;
scene.add(mesh);

function animate() {
	material.uniforms.uTime.value += 0.01;
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
}
animate();

/* =========================
	 GSAP Motion
========================= */

gsap.from(".hero-title", {
	y: 80,
	opacity: 0,
	duration: 1.2,
	ease: "power4.out"
});

gsap.from(".hero-sub", {
	y: 40,
	opacity: 0,
	duration: 1.2,
	delay: 0.4,
	ease: "power4.out"
});

gsap.utils.toArray("section").forEach(section => {
	gsap.from(section, {
		opacity: 0,
		y: 80,
		duration: 1,
		scrollTrigger: {
			trigger: section,
			start: "top 80%"
		}
	});
});

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});



