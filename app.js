gsap.registerPlugin(ScrollTrigger);

/* =====================================================
	 INTRO VIDEO LOGIC
===================================================== */

const introVideo = document.getElementById("introVideo");
const introContainer = document.querySelector(".intro-video");

document.body.classList.add("no-scroll");

// Intro fallback
introVideo.addEventListener("error", skipIntro);
introVideo.addEventListener("abort", skipIntro);

function skipIntro() {
	introContainer.remove();
	document.body.classList.remove("no-scroll");
	ScrollTrigger.refresh(true);
	initWebGL();
	initSkillReveal();
}

/* Fade-out intro when video ends */
introVideo.addEventListener("ended", () => {
	gsap.to(introContainer, {
		opacity: 0,
		duration: 1.2,
		ease: "power2.out",
		onComplete: () => {
			introContainer.remove();
			document.body.classList.remove("no-scroll");
			ScrollTrigger.refresh(true);
			initWebGL();
			initSkillReveal();
		}
	});
});

/* =====================================================
	 WEBGL — TWO-LAYER SHADER + MOUSE RIPPLE
===================================================== */

function initWebGL() {
	if (!window.THREE) {
		console.error("Three.js failed to load.");
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
	camera.position.z = 1.5;

	const renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		alpha: false,
		antialias: true
	});

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	/* ============================
		 UNIFORMS (Time + Mouse)
	============================ */

	const uniforms = {
		uTime: { value: 0 },
		uMouse: { value: new THREE.Vector2(0.5, 0.5) }
	};

	const geometry = new THREE.PlaneGeometry(3, 3, 64, 64);

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

				/* ================
				   LAYER 1 — Magenta Wave
				================ */
				float waveA = sin(vUv.x * 6.0 + uTime * 0.8) * 0.15;

				/* ================
				   LAYER 2 — Electric Blue Wave
				================ */
				float waveB = cos(vUv.y * 8.0 + uTime * 1.3) * 0.12;
				
				vec3 magenta = vec3(1.0, 0.0, 1.0);
				vec3 blue    = vec3(0.0, 0.4, 1.0);

				vec3 colA = mix(vec3(0.05, 0.05, 0.12), magenta, waveA + 0.4);
				vec3 colB = mix(vec3(0.03, 0.03, 0.08), blue, waveB + 0.4);

				vec3 finalColor = colA + colB * 0.5;

				/* ================
				   MOUSE RIPPLE
				================ */
				float dist = distance(vUv, uMouse);
				float ripple = 0.03 / dist;

				finalColor += ripple * vec3(0.8, 0.2, 1.0);

				gl_FragColor = vec4(finalColor, 1.0);
			}
		`
	});

	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	/* ============================
		 MOUSE TRACKING
	============================ */

	window.addEventListener("mousemove", (e) => {
		uniforms.uMouse.value.x = e.clientX / window.innerWidth;
		uniforms.uMouse.value.y = 1.0 - e.clientY / window.innerHeight;
	});

	/* ============================
		 ANIMATION LOOP
	============================ */

	function animate() {
		uniforms.uTime.value += 0.02;
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}
	animate();

	/* ============================
		 RESIZE SUPPORT
	============================ */
	window.addEventListener("resize", () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
}

/* =====================================================
	 GLOBAL SCROLL ANIMATIONS
===================================================== */

gsap.utils.toArray("main section:not(#skills):not(#about)").forEach(section => {
	gsap.from(section, {
		opacity: 0,
		y: 70,
		duration: 1,
		ease: "power3.out",
		scrollTrigger: {
			trigger: section,
			start: "top 80%"
		}
	});
});

/* =====================================================
	 ABOUT SECTION FADE-IN
===================================================== */

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

gsap.utils.toArray(".about-text").forEach(text => {
	gsap.from(text, {
		opacity: 0,
		y: 35,
		duration: 1.1,
		ease: "power3.out",
		scrollTrigger: {
			trigger: text,
			start: "top 80%"
		}
	});
});

/* =====================================================
	 SKILLS TIMELINE
===================================================== */

function initSkillReveal() {
	gsap.utils.toArray(".skill-item").forEach(item => {
		gsap.to(item, {
			opacity: 1,
			y: 0,
			duration: 1,
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

/* Hover motion */
document.querySelectorAll(".glass-card").forEach(card => {
	card.addEventListener("mouseenter", () => {
		gsap.to(card, { y: -12, duration: 0.25, ease: "power2.out" });
	});
	card.addEventListener("mouseleave", () => {
		gsap.to(card, { y: 0, duration: 0.25, ease: "power2.inOut" });
	});
});

/* =====================================================
	 MODALS
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
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape") closeModal();
});

function closeModal() {
	document.body.classList.remove("no-scroll");

	gsap.to(".modal-overlay", { opacity: 0, pointerEvents: "none", duration: 0.3 });
	gsap.to(".modal", { opacity: 0, pointerEvents: "none", duration: 0.3 });
	gsap.to(".modal-content", { opacity: 0, y: 40, duration: 0.4 });
}

/* =====================================================
	 SECTION DIVIDER ANIMATION
===================================================== */

gsap.utils.toArray(".section-divider").forEach(div => {
	gsap.from(div, {
		opacity: 0,
		scaleX: 0.4,
		duration: 1.2,
		ease: "power3.out",
		scrollTrigger: {
			trigger: div,
			start: "top 80%"
		}
	});
});

/* =====================================================
	 HERO PARALLAX
===================================================== */

gsap.to(".hero-title", {
	yPercent: 12,
	ease: "none",
	scrollTrigger: {
		trigger: ".hero",
		start: "top top",
		end: "bottom top",
		scrub: true
	}
});

gsap.to(".hero-sub", {
	yPercent: 20,
	ease: "none",
	scrollTrigger: {
		trigger: ".hero",
		start: "top top",
		end: "bottom top",
		scrub: true
	}
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
