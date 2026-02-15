import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.152/build/three.module.js";
import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import ScrollTrigger from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger/+esm";

gsap.registerPlugin(ScrollTrigger);

/* =====================================================
	 INTRO ANIMATION
===================================================== */
window.addEventListener("load", () => {
	const intro = document.querySelector(".intro");
	const spans = document.querySelectorAll(".intro-text span");

	const tl = gsap.timeline({
		onComplete: () => intro.style.display = "none"
	});

	tl.to(spans, {
		opacity: 1,
		y: -20,
		stagger: 0.25,
		duration: 1.2,
		ease: "power3.out"
	});

	tl.to(intro, {
		y: "-100%",
		duration: 1.3,
		ease: "power4.inOut",
		delay: 0.3
	});

	setTimeout(() => intro.style.display = "none", 4000);
});


/* =====================================================
	 WEBGL DISTORTION BACKGROUND
===================================================== */

class DistortionBackground {
	constructor() {
		this.canvas = document.getElementById("webgl");
		this.scene = new THREE.Scene();
		this.clock = new THREE.Clock();

		this.camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			0.1,
			100
		);
		this.camera.position.z = 3;

		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas,
			antialias: true,
			alpha: true
		});
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.initPlane();
		this.addEvents();
		this.animate();
	}

	initPlane() {
		const geo = new THREE.PlaneGeometry(5, 3, 64, 64);

		this.material = new THREE.ShaderMaterial({
			uniforms: { uTime: { value: 0 } },
			vertexShader: `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					vec3 pos = position;
					pos.z += sin(uv.x * 5.0 + uv.y * 5.0 + uTime * 0.8) * 0.05;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
				}
			`,
			fragmentShader: `
				varying vec2 vUv;
				void main() {
					vec3 color = vec3(0.07, 0.08, 0.12);
					gl_FragColor = vec4(color, 1.0);
				}
			`
		});

		this.mesh = new THREE.Mesh(geo, this.material);
		this.mesh.position.z = -2;
		this.scene.add(this.mesh);
	}

	addEvents() {
		window.addEventListener("resize", () => {
			this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(window.innerWidth, window.innerHeight);
		});
	}

	animate() {
		this.material.uniforms.uTime.value = this.clock.getElapsedTime();
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(() => this.animate());
	}
}

new DistortionBackground();

/* =====================================================
	 GSAP SCROLL FADE-UP ANIMATIONS
===================================================== */

gsap.utils.toArray("section").forEach((sec) => {
	gsap.from(sec, {
		opacity: 0,
		y: 80,
		duration: 1.2,
		ease: "power3.out",
		scrollTrigger: {
			trigger: sec,
			start: "top 85%",
		}
	});
});


/* =====================================================
	 MAGNETIC CURSOR
===================================================== */

const cursor = document.createElement("div");
cursor.className = "cursor-ring";
document.body.appendChild(cursor);

const dot = document.createElement("div");
dot.className = "cursor-dot";
document.body.appendChild(dot);

let mouse = { x: 0, y: 0 };
let pos = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

gsap.ticker.add(() => {
	pos.x += (mouse.x - pos.x) * 0.15;
	pos.y += (mouse.y - pos.y) * 0.15;

	gsap.set(dot, { x: mouse.x - 3, y: mouse.y - 3 });
	gsap.set(cursor, { x: pos.x - 21, y: pos.y - 21 });
});

// magnetic elements
document.querySelectorAll(".work-card").forEach((card) => {
	card.addEventListener("mouseenter", () => {
		cursor.classList.add("active");
	});

	card.addEventListener("mouseleave", () => {
		cursor.classList.remove("active");
		gsap.to(card, { x: 0, y: 0, duration: 0.4 });
	});

	card.addEventListener("mousemove", (e) => {
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left - rect.width / 2;
		const y = e.clientY - rect.top - rect.height / 2;

		gsap.to(card, { x: x * 0.1, y: y * 0.1, duration: 0.3 });
	});
});


