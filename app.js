/* =========================================================
	 JENNA ZAWASKI — PRODUCTION MOTION SYSTEM
	 Stable / Guarded / Studio Architecture
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

	/* ================= LIB CHECK ================= */

	if (typeof gsap === "undefined") return;

	gsap.registerPlugin(ScrollTrigger);

	/* ================= LENIS ================= */

	if (typeof Lenis !== "undefined") {
		const lenis = new Lenis({ smooth: true, lerp: 0.08 });

		function raf(time) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		lenis.on("scroll", ScrollTrigger.update);
	}

	/* ================= INTRO ================= */

	const intro = document.querySelector(".intro");

	if (intro) {
		const spans = document.querySelectorAll(".intro-text span");

		const tl = gsap.timeline({
			onComplete: () => intro.style.display = "none"
		});

		tl.to(spans, {
			opacity: 1,
			y: -20,
			stagger: 0.2,
			duration: 1
		})
			.to(intro, {
				y: "-100%",
				duration: 1.2,
				ease: "power4.inOut",
				delay: 0.5
			});

		setTimeout(() => intro.style.display = "none", 4000);
	}

	/* ================= WEBGL ================= */

	if (typeof THREE !== "undefined") {

		const canvas = document.getElementById("webgl");
		if (canvas) {

			const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera(
				75,
				window.innerWidth / window.innerHeight,
				0.1,
				1000
			);
			camera.position.z = 2;

			const renderer = new THREE.WebGLRenderer({
				canvas,
				antialias: true,
				alpha: true
			});

			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

			const geometry = new THREE.PlaneGeometry(5, 5, 64, 64);

			const material = new THREE.ShaderMaterial({
				uniforms: { uTime: { value: 0 } },
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
					float wave = sin(vUv.x*10.0+uTime)*0.05;
					vec3 color = vec3(0.08+wave,0.08,0.12+wave);
					gl_FragColor = vec4(color,1.0);
				}
			`
			});

			const mesh = new THREE.Mesh(geometry, material);
			scene.add(mesh);

			function animate() {
				material.uniforms.uTime.value += 0.01;
				renderer.render(scene, camera);
				requestAnimationFrame(animate);
			}
			animate();
		}
	}

	/* ================= DYNAMIC THEMES ================= */

	document.querySelectorAll("section[data-theme]").forEach(section => {
		ScrollTrigger.create({
			trigger: section,
			start: "top center",
			onEnter: () => document.body.style.background = section.dataset.theme,
			onEnterBack: () => document.body.style.background = section.dataset.theme
		});
	});

	/* ================= CINEMATIC PARALLAX ================= */

	gsap.to(".hero-bg", {
		scale: 1.2,
		scrollTrigger: {
			trigger: ".hero",
			start: "top top",
			end: "bottom top",
			scrub: true
		}
	});

	/* ================= CURSOR ================= */

	if (!window.matchMedia("(pointer: coarse)").matches) {

		const dot = document.createElement("div");
		dot.className = "cursor-dot";

		const ring = document.createElement("div");
		ring.className = "cursor-ring";

		document.body.appendChild(dot);
		document.body.appendChild(ring);

		let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
		let pos = { ...mouse };

		document.addEventListener("mousemove", e => {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
		});

		gsap.ticker.add(() => {
			pos.x += (mouse.x - pos.x) * 0.15;
			pos.y += (mouse.y - pos.y) * 0.15;

			gsap.set(dot, { x: mouse.x - 3, y: mouse.y - 3 });
			gsap.set(ring, { x: pos.x - 30, y: pos.y - 30 });
		});

		document.querySelectorAll("a,.work-card").forEach(el => {
			el.addEventListener("mouseenter", () => {
				ring.classList.add("active");
				ring.innerHTML = "View";
			});
			el.addEventListener("mouseleave", () => {
				ring.classList.remove("active");
				ring.innerHTML = "";
				gsap.to(el, { x: 0, y: 0, duration: 0.5 });
			});
			el.addEventListener("mousemove", e => {
				const rect = el.getBoundingClientRect();
				const x = e.clientX - rect.left - rect.width / 2;
				const y = e.clientY - rect.top - rect.height / 2;
				gsap.to(el, { x: x * 0.15, y: y * 0.15, duration: 0.3 });
			});
		});
	}

});
