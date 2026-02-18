gsap.registerPlugin(ScrollTrigger);

/* =====================================================
	 SAFE INTRO SYSTEM — no early removal
===================================================== */

const introVideo = document.getElementById("introVideo");
let introFinished = false;

function finishIntro() {
	if (introFinished) return;
	introFinished = true;

	const intro = document.querySelector(".intro-video");
	if (intro) intro.remove();

	document.body.classList.remove("no-scroll");

	const canvas = document.getElementById("webgl");
	canvas.classList.remove("webgl-hidden");

	ScrollTrigger.refresh(true);

	initWebGL();
	initSkillsAnimation();
}

/* End intro ONLY when safe */
introVideo?.addEventListener("ended", finishIntro);
introVideo?.addEventListener("error", finishIntro);
introVideo?.addEventListener("abort", finishIntro);

/* Fallback ONLY for mobile autoplay restrictions */
setTimeout(() => {
	if (!introFinished) finishIntro();
}, 5000);


/* =====================================================
	 WEBGL — Dual Layer Ripple Background (fixed brightness)
===================================================== */

function initWebGL() {
	if (!window.THREE) {
		console.error("THREE.js failed to load.");
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
		canvas,
		antialias: true
	});

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	/* UNIFORMS */
	const uniforms = {
		uTime: { value: 0 },
		uMouse: { value: new THREE.Vector2(0.5, 0.5) }
	};

	/* GEOMETRY */
	const geometry = new THREE.PlaneGeometry(3, 3, 64, 64);

	/* SHADER — boosted color so it's not dark */
	const material = new THREE.ShaderMaterial({
		uniforms,
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

				/* Dual-wave background */
				float waveA = sin(vUv.x * 6.0 + uTime * 0.8) * 0.25;
				float waveB = cos(vUv.y * 8.0 + uTime * 1.3) * 0.25;

				vec3 magenta = vec3(1.0, 0.2, 1.0);
				vec3 blue = vec3(0.1, 0.5, 1.0);
				vec3 base = vec3(0.08, 0.05, 0.12);

				vec3 color =
					base +
					magenta * (waveA + 0.5) * 0.6 +
					blue * (waveB + 0.5) * 0.6;

				/* Mouse ripple */
				float dist = distance(vUv, uMouse);
				float ripple = 0.06 / dist;

				color += ripple * vec3(1.0, 0.2, 1.0);

				gl_FragColor = vec4(color, 1.0);
			}
		`
	});

	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	/* Mouse interaction */
	window.addEventListener("mousemove", (e) => {
		uniforms.uMouse.value.x = e.clientX / window.innerWidth;
		uniforms.uMouse.value.y = 1.0 - e.clientY / window.innerHeight;
	});

	/* Animation */
	function animate() {
		uniforms.uTime.value += 0.015;
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	}
	animate();

	/* Resize fix */
	window.addEventListener("resize", () => {
		const w = window.innerWidth;
		const h = window.innerHeight;
		renderer.setSize(w, h);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	});
}


/* =====================================================
	 HERO ANIMATION
===================================================== */

gsap.from(".hero-title", {
	opacity: 0,
	y: 40,
	duration: 1.4,
	ease: "power3.out",
	delay: 0.3
});

gsap.from(".hero-sub", {
	opacity: 0,
	y: 35,
	duration: 1.4,
	ease: "power3.out",
	delay: 0.5
});


/* =====================================================
	 SKILLS
===================================================== */

function initSkillsAnimation() {
	gsap.utils.toArray(".skill-item").forEach((item) => {
		gsap.to(item, {
			opacity: 1,
			y: 0,
			duration: 1.1,
			ease: "power3.out",
			scrollTrigger: {
				trigger: item,
				start: "top 85%"
			}
		});
	});
}


/* =====================================================
	 WORK CARD ANIMATION
===================================================== */

gsap.utils.toArray(".glass-card").forEach((card, i) => {
	gsap.from(card, {
		opacity: 0,
		y: 50,
		duration: 1,
		delay: i * 0.1,
		scrollTrigger: {
			trigger: card,
			start: "top 85%"
		}
	});
});


/* =====================================================
	 MODALS
===================================================== */

const overlay = document.getElementById("modalOverlay");
const modalButtons = document.querySelectorAll(".view-btn");

modalButtons.forEach((btn, index) =>
	btn.addEventListener("click", () => openModal(index + 1))
);

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
