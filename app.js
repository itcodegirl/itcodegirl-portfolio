gsap.registerPlugin(ScrollTrigger);

// =======================================
// INTRO VIDEO LOGIC
// =======================================

const introVideo = document.getElementById("introVideo");
const introContainer = document.querySelector(".intro-video");

// Disable scrolling during intro
document.body.classList.add("no-scroll");

// Fallback if video fails
introVideo.addEventListener("error", skipIntro);
introVideo.addEventListener("abort", skipIntro);

function skipIntro() {
	introContainer.remove();
	document.body.classList.remove("no-scroll");
	document.body.style.overflow = "auto";
	revealPage();
}

introVideo.addEventListener("ended", () => {
	gsap.to(introContainer, {
		opacity: 0,
		duration: 1.2,
		ease: "power2.out",
		onComplete: () => {
			introContainer.remove();
			document.body.classList.remove("no-scroll");
			document.body.style.overflow = "auto";
			revealPage();
		}
	});
});

// =======================================
// PAGE REVEAL AFTER INTRO
// =======================================

function revealPage() {

	// Remove opacity-lock from WebGL
	document.getElementById("webgl").classList.remove("webgl-hidden");

	// Fade in WebGL
	gsap.to("#webgl", {
		opacity: 1,
		duration: 1.4,
		ease: "power2.out"
	});

	// Hero animation
	gsap.fromTo(".hero-inner > *",
		{ opacity: 0, y: 60 },
		{
			opacity: 1,
			y: 0,
			duration: 1.2,
			stagger: 0.18,
			ease: "power4.out",
			delay: 0.3
		}
	);
}

// =======================================
// WEBGL BACKGROUND
// =======================================

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

const geometry = new THREE.PlaneGeometry(3, 3, 32, 32);

const material = new THREE.ShaderMaterial({
	uniforms: { uTime: { value: 0 } },
	vertexShader: `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
		}
	`,
	fragmentShader: `
		uniform float uTime;
		varying vec2 vUv;

		void main() {
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

window.addEventListener("resize", () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});

// =======================================
// ABOUT SECTION — PREMIUM ANIMATION
// =======================================

// Header
gsap.from("#about h2", {
	opacity: 0,
	y: 30,
	duration: 1,
	ease: "power3.out",
	scrollTrigger: {
		trigger: "#about",
		start: "top 85%"
	}
});

// Paragraph stagger animation
gsap.from("#about .about-text p", {
	opacity: 0,
	y: 25,
	duration: 1.1,
	stagger: 0.15,
	ease: "power3.out",
	scrollTrigger: {
		trigger: "#about",
		start: "top 75%"
	}
});

// =======================================
// GLOBAL SECTION FADE-IN — EXCLUDES ABOUT
// =======================================

gsap.utils.toArray("main section:not(#about)").forEach(section => {
	gsap.from(section, {
		opacity: 0,
		y: 80,
		duration: 1,
		ease: "power2.out",
		scrollTrigger: {
			trigger: section,
			start: "top 80%"
		}
	});
});

// =======================================
// PROJECT CARD ANIMATIONS
// =======================================

gsap.utils.toArray(".glass-card").forEach((card, i) => {
	gsap.from(card, {
		opacity: 0,
		y: 50,
		duration: 1,
		delay: i * 0.1,
		ease: "power3.out",
		scrollTrigger: {
			trigger: card,
			start: "top 85%"
		}
	});
});

// Smooth hover motion
document.querySelectorAll(".glass-card").forEach(card => {
	card.addEventListener("mouseenter", () => {
		gsap.to(card, { y: -12, duration: 0.3, ease: "power2.out" });
	});

	card.addEventListener("mouseleave", () => {
		gsap.to(card, { y: 0, duration: 0.3, ease: "power2.inOut" });
	});
});

// =======================================
// MODAL SYSTEM — CLEAN & OPTIMIZED
// =======================================

const overlay = document.getElementById("modalOverlay");
const modalButtons = document.querySelectorAll(".view-btn");
let activeModal = null;

modalButtons.forEach((btn, index) => {
	btn.addEventListener("click", () => openModal(index + 1));
});

function openModal(id) {
	activeModal = document.getElementById(`modal${id}`);

	document.body.classList.add("no-scroll");

	gsap.set(activeModal.querySelector(".modal-content"), { opacity: 0, y: 40 });

	gsap.to(overlay, { opacity: 1, pointerEvents: "all", duration: 0.35 });
	gsap.to(activeModal, { opacity: 1, pointerEvents: "all", duration: 0.35 });

	gsap.to(activeModal.querySelector(".modal-content"), {
		opacity: 1,
		y: 0,
		duration: 0.6,
		ease: "power3.out"
	});
}

function closeModal() {
	document.body.classList.remove("no-scroll");

	gsap.to(overlay, { opacity: 0, pointerEvents: "none", duration: 0.3 });
	if (activeModal) {
		gsap.to(activeModal, { opacity: 0, pointerEvents: "none", duration: 0.3 });
		gsap.to(activeModal.querySelector(".modal-content"), { opacity: 0, y: 40, duration: 0.3 });
	}
}

document.querySelectorAll(".close-modal").forEach(btn => btn.addEventListener("click", closeModal));
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", e => {
	if (e.key === "Escape") closeModal();
});

// =========================
// SKILLS TIMELINE ANIMATION
// =========================

gsap.from(".skills h2", {
	opacity: 0,
	y: 30,
	duration: 1,
	ease: "power3.out",
	scrollTrigger: {
		trigger: ".skills",
		start: "top 85%"
	}
});

gsap.from(".skill-item", {
	opacity: 0,
	y: 40,
	duration: 1.2,
	stagger: 0.25,
	ease: "power3.out",
	scrollTrigger: {
		trigger: ".skills",
		start: "top 75%"
	}
});
