gsap.registerPlugin(ScrollTrigger);

/* =====================================================
	 INTRO VIDEO LOGIC
===================================================== */

const introVideo = document.getElementById("introVideo");
const introContainer = document.querySelector(".intro-video");

document.body.classList.add("no-scroll");

// If video fails → skip intro
introVideo.addEventListener("error", skipIntro);
introVideo.addEventListener("abort", skipIntro);

function skipIntro() {
	if (introContainer) introContainer.remove();
	document.body.classList.remove("no-scroll");
	document.body.style.overflow = "auto";

	initWebGL();
	initHeroAnimations();
	initSkillsAnimation();
	ScrollTrigger.refresh(true);
}

// When video ends → fade out intro, fade in site
introVideo.addEventListener("ended", () => {
	gsap.to(introContainer, {
		opacity: 0,
		duration: 1.2,
		ease: "power2.out",
		onComplete: () => {
			introContainer.remove();
			document.body.classList.remove("no-scroll");
			document.body.style.overflow = "auto";

			initWebGL();
			initHeroAnimations();
			initSkillsAnimation();
			ScrollTrigger.refresh(true);
		}
	});
});


/* =====================================================
	 WEBGL — PEBBLE-IN-INK BACKGROUND
===================================================== */

function initWebGL() {
	if (!window.THREE) {
		console.error("THREE.js NOT loaded.");
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
	camera.position.z = 1.6;

	const renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		alpha: false,
		antialias: true
	});

	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	/* ------------------------------
		 SHADER UNIFORMS
	------------------------------ */

	const uniforms = {
		uTime: { value: 0 },
		uMouse: { value: new THREE.Vector2(0.5, 0.5) }
	};

	/* ------------------------------
		 GEOMETRY + MATERIAL
	------------------------------ */

	const geometry = new THREE.PlaneGeometry(3, 3, 32, 32);

	const material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: `
			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: `
			uniform float uTime;
			uniform vec2 uMouse;
			varying vec2 vUv;

			void main() {

				/* Base deep ink background */
				vec3 base = vec3(0.02, 0.02, 0.04);

				/* Soft wave layers */
				float waveA = sin(vUv.x * 6.0 + uTime * 0.6) * 0.03;
				float waveB = cos(vUv.y * 7.0 + uTime * 0.8) * 0.03;

				vec3 waveTint = vec3(0.2, 0.0, 0.5);  
				vec3 layer = base + (waveA + waveB) * waveTint;

				/* Mouse ripple effect */
				float dist = distance(vUv, uMouse);
				float ripple = sin(dist * 40.0 - uTime * 4.0) * 0.015;
				ripple /= (dist * 20.0 + 1.0);

				vec3 rippleTint = vec3(0.5, 0.1, 0.9);
				layer += ripple * rippleTint;

				gl_FragColor = vec4(layer, 1.0);
			}
		`
	});

	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	/* ------------------------------
		 MOUSE INTERACTION
	------------------------------ */

	window.addEventListener("mousemove", e => {
		const x = e.clientX / window.innerWidth;
		const y = 1.0 - e.clientY / window.innerHeight;
		uniforms.uMouse.value.set(x, y);
	});

	/* ------------------------------
		 ANIMATION LOOP
	------------------------------ */

	function animate() {
		uniforms.uTime.value += 0.02;
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}

	animate();

	/* ------------------------------
		 Resize Fix
	------------------------------ */

	window.addEventListener("resize", () => {
		renderer.setSize(window.innerWidth, window.innerHeight);
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	});
}


/* =====================================================
	 HERO TEXT ANIMATION
===================================================== */

function initHeroAnimations() {
	gsap.from(".hero-title", {
		opacity: 0,
		y: 60,
		duration: 1.4,
		ease: "power4.out"
	});

	gsap.from(".hero-sub", {
		opacity: 0,
		y: 40,
		duration: 1.4,
		delay: 0.2,
		ease: "power4.out"
	});
}


/* =====================================================
	 SKILLS TIMELINE ANIMATION
===================================================== */

function initSkillsAnimation() {
	gsap.utils.toArray(".skill-item").forEach((item) => {
		gsap.from(item, {
			opacity: 0,
			y: 40,
			duration: 1.1,
			ease: "power3.out",
			scrollTrigger: {
				trigger: item,
				start: "top 85%",
				toggleActions: "play none none none"
			}
		});
	});
}


/* =====================================================
	 WORK CARD ANIMATIONS
===================================================== */

gsap.utils.toArray(".glass-card").forEach((card, i) => {
	gsap.from(card, {
		opacity: 0,
		y: 60,
		duration: 1,
		delay: i * 0.1,
		ease: "power3.out",
		scrollTrigger: {
			trigger: card,
			start: "top 85%"
		}
	});
});


/* Hover float */
document.querySelectorAll(".glass-card").forEach(card => {
	card.addEventListener("mouseenter", () => {
		gsap.to(card, { y: -12, duration: 0.3, ease: "power2.out" });
	});
	card.addEventListener("mouseleave", () => {
		gsap.to(card, { y: 0, duration: 0.3, ease: "power2.inOut" });
	});
});


/* =====================================================
	 MODAL SYSTEM
===================================================== */

const overlay = document.getElementById("modalOverlay");
const modalButtons = document.querySelectorAll(".view-btn");

modalButtons.forEach((btn, index) => {
	btn.addEventListener("click", () => openModal(index + 1));
});

function openModal(id) {
	const modal = document.getElementById(`modal${id}`);

	document.body.classList.add("no-scroll");

	gsap.set(modal.querySelector(".modal-content"), { opacity: 0, y: 40 });

	gsap.to(overlay, { opacity: 1, pointerEvents: "all", duration: 0.3 });
	gsap.to(modal, { opacity: 1, pointerEvents: "all", duration: 0.3 });

	gsap.to(modal.querySelector(".modal-content"), {
		opacity: 1,
		y: 0,
		duration: 0.5,
		ease: "power3.out"
	});
}

document.querySelectorAll(".close-modal").forEach(btn =>
	btn.addEventListener("click", closeModal)
);

overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", e => {
	if (e.key === "Escape") closeModal();
});

function closeModal() {
	document.body.classList.remove("no-scroll");

	gsap.to(overlay, { opacity: 0, pointerEvents: "none", duration: 0.3 });
	gsap.to(".modal", { opacity: 0, pointerEvents: "none", duration: 0.3 });
}


/* =====================================================
	 SECTION DIVIDER ANIMATION
===================================================== */

gsap.utils.toArray(".section-divider").forEach(div => {
	gsap.from(div, {
		opacity: 0,
		scaleX: 0.4,
		duration: 1,
		ease: "power3.out",
		scrollTrigger: {
			trigger: div,
			start: "top 85%"
		}
	});
});


/* =====================================================
	 SCROLL PROGRESS BAR
===================================================== */

const progressBar = document.querySelector(".scroll-progress");

window.addEventListener("scroll", () => {
	const scrollTop = window.scrollY;
	const docHeight = document.body.scrollHeight - window.innerHeight;
	const progress = (scrollTop / docHeight) * 100;
	progressBar.style.height = progress + "%";
});
