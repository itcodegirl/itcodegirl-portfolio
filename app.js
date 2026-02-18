gsap.registerPlugin(ScrollTrigger);

/* =====================================================
	 INTRO LOGIC
===================================================== */

const introVideo = document.getElementById("introVideo");
const introContainer = document.querySelector(".intro-video");

document.body.classList.add("no-scroll");

// Fix: Reveal WebGL after intro ends
function revealWebGL() {
	document.getElementById("webgl").classList.remove("webgl-hidden");
}

/* Fallback */
introVideo.addEventListener("error", skipIntro);
introVideo.addEventListener("abort", skipIntro);

function skipIntro() {
	revealWebGL();
	introContainer.remove();
	document.body.classList.remove("no-scroll");
	document.body.style.overflow = "auto";
	ScrollTrigger.refresh(true);
	initWebGL();
	initSkillsAnimation();
}

/* Fade out intro normally */
introVideo.addEventListener("ended", () => {
	gsap.to(introContainer, {
		opacity: 0,
		duration: 1.2,
		ease: "power2.out",
		onComplete: () => {
			revealWebGL();
			introContainer.remove();
			document.body.classList.remove("no-scroll");
			document.body.style.overflow = "auto";
			ScrollTrigger.refresh(true);
			initWebGL();
			initSkillsAnimation();
		}
	});
});

/* =====================================================
	 WEBGL SHADER BACKGROUND
===================================================== */

function initWebGL() {
	if (!window.THREE) {
		console.error("THREE.js not loaded!");
		return;
	}

	const canvas = document.getElementById("webgl");
	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		100
	);
	camera.position.z = 1.4;

	const renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		antialias: true
	});
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(window.devicePixelRatio);

	const geometry = new THREE.PlaneGeometry(3, 3, 32, 32);

	const material = new THREE.ShaderMaterial({
		uniforms: { uTime: { value: 0 } },
		vertexShader: `
			varying vec2 vUv;
			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
			}
		`,
		fragmentShader: `
			uniform float uTime;
			varying vec2 vUv;

			void main() {
				float wave1 = sin(vUv.x * 6.0 + uTime) * 0.15;
				float wave2 = cos(vUv.y * 4.0 + uTime * 0.5) * 0.12;

				vec3 deepBlue = vec3(0.05, 0.06, 0.12);
				vec3 magenta = vec3(0.8, 0.0, 1.0);

				vec3 color = deepBlue + (wave1 + wave2) * magenta;

				gl_FragColor = vec4(color, 1.0);
			}
		`
	});

	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	function animate() {
		material.uniforms.uTime.value += 0.02;
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}
	animate();

	window.addEventListener("resize", () => {
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	});
}

/* =====================================================
	 SKILLS ANIMATION
===================================================== */

function initSkillsAnimation() {
	gsap.utils.toArray(".skill-item").forEach(item => {
		gsap.fromTo(
			item,
			{ opacity: 0, y: 40 },
			{
				opacity: 1,
				y: 0,
				duration: 1.1,
				ease: "power3.out",
				scrollTrigger: {
					trigger: item,
					start: "top 85%"
				}
			}
		);
	});
}

/* =====================================================
	 WORK CARDS
===================================================== */

gsap.utils.toArray(".glass-card").forEach((card, i) => {
	gsap.from(card, {
		opacity: 0,
		y: 60,
		duration: 1,
		delay: i * 0.12,
		scrollTrigger: { trigger: card, start: "top 85%" }
	});
});

/* Float hover */
document.querySelectorAll(".glass-card").forEach(card => {
	card.addEventListener("mouseenter", () => {
		gsap.to(card, { y: -12, duration: 0.3 });
	});
	card.addEventListener("mouseleave", () => {
		gsap.to(card, { y: 0, duration: 0.3 });
	});
});

/* =====================================================
	 MODALS
===================================================== */

const overlay = document.getElementById("modalOverlay");

document.querySelectorAll(".view-btn").forEach((btn, index) => {
	btn.addEventListener("click", () => openModal(index + 1));
});

function openModal(id) {
	const modal = document.getElementById(`modal${id}`);

	document.body.classList.add("no-scroll");

	gsap.to(overlay, { opacity: 1, pointerEvents: "auto", duration: 0.3 });
	gsap.to(modal, { opacity: 1, pointerEvents: "auto", duration: 0.3 });
	gsap.to(modal.querySelector(".modal-content"), {
		opacity: 1,
		y: 0,
		duration: 0.6
	});
}

document.querySelectorAll(".close-modal").forEach(btn =>
	btn.addEventListener("click", closeModal)
);

overlay.addEventListener("click", closeModal);

function closeModal() {
	document.body.classList.remove("no-scroll");
	gsap.to(".modal-overlay", { opacity: 0, pointerEvents: "none", duration: 0.3 });
	gsap.to(".modal", { opacity: 0, pointerEvents: "none", duration: 0.3 });
}

/* =====================================================
	 SECTION DIVIDER
===================================================== */

gsap.utils.toArray(".section-divider").forEach(div => {
	gsap.from(div, {
		opacity: 0,
		scaleX: 0.4,
		duration: 1.2,
		scrollTrigger: { trigger: div, start: "top 80%" }
	});
});

/* =====================================================
	 HERO PARALLAX
===================================================== */

gsap.to(".hero-title", {
	yPercent: 10,
	scrollTrigger: {
		trigger: ".hero",
		start: "top top",
		end: "bottom top",
		scrub: true
	}
});

gsap.to(".hero-sub", {
	yPercent: 20,
	scrollTrigger: {
		trigger: ".hero",
		start: "top top",
		end: "bottom top",
		scrub: true
	}
});

/* =====================================================
	 SCROLL PROGRESS
===================================================== */

const progressBar = document.querySelector(".scroll-progress");

window.addEventListener("scroll", () => {
	const scrollTop = window.scrollY;
	const docHeight = document.body.scrollHeight - innerHeight;
	const progress = (scrollTop / docHeight) * 100;
	progressBar.style.height = progress + "%";
});
