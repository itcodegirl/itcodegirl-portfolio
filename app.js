gsap.registerPlugin(ScrollTrigger);

/* =====================================================
	INTRO VIDEO LOGIC
===================================================== */

const introVideo = document.getElementById("introVideo");
const introContainer = document.querySelector(".intro-video");

document.body.classList.add("no-scroll");

introVideo.addEventListener("error", skipIntro);
introVideo.addEventListener("abort", skipIntro);

function skipIntro() {
	introContainer.remove();
	document.body.classList.remove("no-scroll");
	document.body.style.overflow = "auto";

	ScrollTrigger.refresh(true);

	initHeroAnimation();
	initSkillsAnimation();
	initWebGL();
}

/* Fade out intro when video ends */
introVideo.addEventListener("ended", () => {
	gsap.to(introContainer, {
		opacity: 0,
		duration: 1.2,
		ease: "power2.out",
		onComplete: () => {
			introContainer.remove();
			document.body.classList.remove("no-scroll");
			document.body.style.overflow = "auto";

			ScrollTrigger.refresh(true);

			initHeroAnimation();
			initSkillsAnimation();
			initWebGL();
		}
	});
});

/* =====================================================
	 HERO — PREMIUM ANIMATION
===================================================== */

function initHeroAnimation() {
	// Initial fade + stagger
	gsap.timeline({
		defaults: { ease: "power3.out" }
	})
		.from(".hero-title", {
			opacity: 0,
			y: 60,
			duration: 1.2
		})
		.from(".hero-sub", {
			opacity: 0,
			y: 40,
			duration: 1.2
		}, "-=0.8");

	// Mouse parallax
	document.addEventListener("mousemove", (e) => {
		const x = (e.clientX / window.innerWidth - 0.5) * 10;
		const y = (e.clientY / window.innerHeight - 0.5) * 10;

		gsap.to(".hero-inner", {
			x: x,
			y: y,
			duration: 0.8,
			ease: "power2.out"
		});
	});
}

/* =====================================================
	WEBGL BACKGROUND
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
	camera.position.z = 1.5;

	const renderer = new THREE.WebGLRenderer({
		canvas: canvas,
		alpha: false,
		antialias: true
	});

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	/* ------------------------------
		 SHADER WITH WAVES + MOUSE
	-------------------------------- */

	const uniforms = {
		uTime: { value: 0 },
		uMouse: { value: new THREE.Vector2(0.5, 0.5) }
	};

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
				float waveA = sin(vUv.x * 6.0 + uTime * 0.8) * 0.15;
				float waveB = cos(vUv.y * 8.0 + uTime * 1.3) * 0.12;

				vec3 magenta = vec3(1.0, 0.0, 1.0);
				vec3 blue    = vec3(0.0, 0.4, 1.0);

				vec3 layer1 = mix(vec3(0.05, 0.05, 0.12), magenta, waveA + 0.4);
				vec3 layer2 = mix(vec3(0.03, 0.03, 0.08), blue, waveB + 0.4);

				vec3 color = layer1 + layer2 * 0.5;

				float dist = distance(vUv, uMouse);
				float ripple = 0.03 / dist;

				color += ripple * vec3(0.8, 0.2, 1.0);

				gl_FragColor = vec4(color, 1.0);
			}
		`
	});

	window.__material = material;
	window.__uniforms = uniforms;


	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	/* Animation Loop */
	function animate() {
		material.uniforms.uTime.value += 0.02;
		window.__uTime = uniforms.uTime.value;
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}
	animate();

	/* Mouse interaction for shader distortion */
	window.addEventListener("mousemove", (e) => {
		const x = e.clientX / window.innerWidth;
		const y = 1.0 - e.clientY / window.innerHeight;
		uniforms.uMouse.value.set(x, y);
	});

	/* Resize Handler */
	window.addEventListener("resize", () => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
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

document.querySelectorAll(".glass-card").forEach(card => {
	card.addEventListener("mouseenter", () => {
		gsap.to(card, { y: -12, duration: 0.3, ease: "power2.out" });
	});
	card.addEventListener("mouseleave", () => {
		gsap.to(card, { y: 0, duration: 0.3, ease: "power2.inOut" });
	});
});

/* =====================================================
	SECTION DIVIDERS
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
	SKILLS TIMELINE
===================================================== */

function initSkillsAnimation() {
	gsap.utils.toArray(".skill-item").forEach(item => {
		gsap.from(item, {
			opacity: 0,
			y: 40,
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

	gsap.to(overlay, { opacity: 1, pointerEvents: "all", duration: 0.35 });
	gsap.to(modal, { opacity: 1, pointerEvents: "all", duration: 0.35 });

	gsap.to(modal.querySelector(".modal-content"), {
		opacity: 1,
		y: 0,
		duration: 0.6,
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
	gsap.to(".modal-overlay", { opacity: 0, pointerEvents: "none", duration: 0.3 });
	gsap.to(".modal", { opacity: 0, pointerEvents: "none", duration: 0.3 });
}

/* =====================================================
	SCROLL PROGRESS BAR
===================================================== */

const progressBar = document.querySelector(".scroll-progress");

window.addEventListener("scroll", () => {
	const scrollTop = window.scrollY;
	const docHeight = document.body.scrollHeight - innerHeight;
	const progress = (scrollTop / docHeight) * 100;
	progressBar.style.height = progress + "%";
});

window.addEventListener("load", () => {
	setTimeout(() => {
		initWebGL();
		document.getElementById("webgl").classList.remove("webgl-hidden");
	}, 300);
});
