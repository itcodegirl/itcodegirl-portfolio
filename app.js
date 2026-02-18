gsap.registerPlugin(ScrollTrigger);

/* =====================================================
	 SAFE INTRO SYSTEM
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
	canvas.style.opacity = "1";

	ScrollTrigger.refresh(true);

	initWebGL();
	initHeroCinematic();
	initSectionReveals();
	initSkillsAnimation();
	initNavCinematic();
}

introVideo?.addEventListener("ended", finishIntro);
introVideo?.addEventListener("error", finishIntro);
introVideo?.addEventListener("abort", finishIntro);

setTimeout(() => {
	if (!introFinished) finishIntro();
}, 5000);


/* =====================================================
	 CALM CINEMATIC WATER SHADER
===================================================== */

function initWebGL() {
	const canvas = document.getElementById("webgl");
	canvas.classList.remove("webgl-hidden");
	canvas.style.opacity = "1";
	canvas.style.pointerEvents = "none";

	if (!window.THREE) {
		console.error("THREE.js missing");
		return;
	}

	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		100
	);
	camera.position.z = 1.4;

	const renderer = new THREE.WebGLRenderer({
		canvas,
		antialias: true
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	const uniforms = {
		uTime: { value: 0 },
		uMouse: { value: new THREE.Vector2(0.5, 0.5) }
	};

	const geometry = new THREE.PlaneGeometry(3, 3, 128, 128);

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

			float noise(vec2 p) {
				return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
			}

			float smoothNoise(vec2 p) {
				vec2 i = floor(p);
				vec2 f = fract(p);
				float a = noise(i);
				float b = noise(i + vec2(1.0, 0.0));
				float c = noise(i + vec2(0.0, 1.0));
				float d = noise(i + vec2(1.0, 1.0));
				vec2 u = f * f * (3.0 - 2.0 * f);
				return mix(a, b, u.x)
					+ (c - a) * u.y * (1.0 - u.x)
					+ (d - b) * u.x * u.y;
			}

			float ripple(vec2 uv, vec2 center) {
				float d = distance(uv, center);
				float wave = sin(d * 12.0 - uTime * 0.8);
				return wave * 0.015 / (1.0 + d * 6.0);
			}

			void main() {
				vec3 shallow = vec3(0.18, 0.85, 0.97);
				vec3 deep    = vec3(0.05, 0.32, 0.45);

				float depthMix = smoothstep(0.0, 1.0, vUv.y);
				vec3 color = mix(shallow, deep, depthMix);

				float drift = smoothNoise(vUv * 2.0 + uTime * 0.05) * 0.04;
				color += drift * 0.15;

				float shimmer = smoothNoise(vUv * 4.0 + uTime * 0.1) * 0.02;
				color += shimmer * 0.08;

				float m = ripple(vUv, uMouse);
				color += m * vec3(0.12, 0.55, 1.0);

				float vign = smoothstep(0.75, 0.2, distance(vUv, vec2(0.5)));
				color *= mix(1.0, 0.88, vign);

				gl_FragColor = vec4(color, 1.0);
			}
		`,
	});

	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	window.addEventListener("mousemove", (e) => {
		uniforms.uMouse.value.x = e.clientX / window.innerWidth;
		uniforms.uMouse.value.y = 1.0 - e.clientY / window.innerHeight;
	});

	function animate() {
		uniforms.uTime.value += 0.006;
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
	 CINEMATIC HERO MOTION
===================================================== */

function initHeroCinematic() {
	gsap.from(".hero-title", {
		opacity: 0,
		y: 60,
		filter: "blur(8px)",
		duration: 1.6,
		ease: "power3.out",
		delay: 0.4
	});

	gsap.from(".hero-sub", {
		opacity: 0,
		y: 40,
		filter: "blur(6px)",
		duration: 1.6,
		ease: "power3.out",
		delay: 0.7
	});
}


/* =====================================================
	 SECTION REVEALS (Cinematic Polish Pack)
===================================================== */

function initSectionReveals() {
	gsap.utils.toArray("section").forEach((sec) => {
		gsap.from(sec, {
			opacity: 0,
			y: 70,
			filter: "blur(10px)",
			duration: 1.4,
			ease: "power3.out",
			scrollTrigger: {
				trigger: sec,
				start: "top 85%",
			}
		});
	});
}


/* =====================================================
	 SKILLS ANIMATION
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
	 NAV CINEMATIC BEHAVIOR
===================================================== */

function initNavCinematic() {
	const nav = document.querySelector(".nav");

	ScrollTrigger.create({
		start: "top -10",
		end: 999999,
		onUpdate: (self) => {
			if (self.direction === -1) {
				nav.classList.add("nav-show");
			} else {
				nav.classList.remove("nav-show");
			}
		}
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
