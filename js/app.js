const introVideo = document.getElementById("introVideo");
const introSkip = document.querySelector(".intro-skip");
const skipLink = document.querySelector(".skip-link");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const canUseGsap = typeof gsap !== "undefined";

const scrollProgress = document.querySelector(".scroll-progress");
const nav = document.querySelector(".nav");

// Scroll progress bar
if (scrollProgress) {
	window.addEventListener("scroll", () => {
		const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
		scrollProgress.style.transform = `scaleX(${maxScroll > 0 ? window.scrollY / maxScroll : 0})`;
	}, { passive: true });
}

// Nav: hide on scroll down, reveal on scroll up
let lastScrollY = window.scrollY;
window.addEventListener("scroll", () => {
	const y = window.scrollY;
	if (y > lastScrollY && y > 90) {
		nav?.classList.add("nav-hidden");
	} else {
		nav?.classList.remove("nav-hidden");
	}
	lastScrollY = y;
}, { passive: true });

// Active nav link tracks current section
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll("nav a[href^='#']");
if (sections.length && navLinks.length) {
	const sectionObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				navLinks.forEach(link => link.classList.toggle(
					"nav-active",
					link.getAttribute("href") === `#${entry.target.id}`
				));
			}
		});
	}, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
	sections.forEach(s => sectionObserver.observe(s));
}

// Scroll reveal for cards and sections
if (!prefersReducedMotion.matches) {
	const revealEls = document.querySelectorAll(
		".skill-card, .project-card, .about-content, .about-image, .contact-card"
	);
	const revealObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add("revealed");
				revealObserver.unobserve(entry.target);
			}
		});
	}, { threshold: 0.1 });
	revealEls.forEach(el => {
		el.classList.add("reveal");
		revealObserver.observe(el);
	});
}

let introFinished = false;
let webGLInitialized = false;

function runSafely(callback) {
	try {
		callback();
	} catch (error) {
		console.warn("Interactive effect failed to start.", error);
	}
}

function finishIntro() {
	if (introFinished) return;
	introFinished = true;

	const intro = document.querySelector(".intro-video");

	if (intro) {
		intro.style.opacity = "0";
		intro.style.pointerEvents = "none";

		setTimeout(() => {
			intro.remove();
		}, 800);
	}

	document.body.classList.remove("no-scroll");

	if (!prefersReducedMotion.matches) {
		runSafely(initWebGL);
	}
}

window.addEventListener("load", () => {
	runSafely(initWebGL);

	if (!prefersReducedMotion.matches) {
		runSafely(initBackgroundWebGL);
	}

	// Handle intro separately
	if (prefersReducedMotion.matches) {
		finishIntro();
		return;
	}

	if (introVideo) {
		introVideo.addEventListener("ended", finishIntro);
		introVideo.addEventListener("error", finishIntro);

		const playPromise = introVideo.play();
		if (playPromise) {
			playPromise.catch(finishIntro);
		}

		setTimeout(finishIntro, 4500);
	} else {
		finishIntro();
	}
});

if (introSkip) {
	introSkip.addEventListener("click", finishIntro);
}

if (skipLink) {
	skipLink.addEventListener("click", finishIntro);
}

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm && formStatus) {
	contactForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		const btn = contactForm.querySelector(".form-submit");
		btn.disabled = true;
		btn.textContent = "Sending…";
		formStatus.className = "form-status";
		formStatus.textContent = "";

		try {
			const res = await fetch(contactForm.action, {
				method: "POST",
				body: new FormData(contactForm),
				headers: { Accept: "application/json" }
			});
			if (res.ok) {
				formStatus.className = "form-status form-status--success";
				formStatus.textContent = "Message sent! I'll be in touch soon.";
				contactForm.reset();
			} else {
				throw new Error();
			}
		} catch {
			formStatus.className = "form-status form-status--error";
			formStatus.textContent = "Something went wrong. Please email me directly.";
		} finally {
			btn.disabled = false;
			btn.innerHTML = "Send message <span aria-hidden='true'>→</span>";
		}
	});
}

function initBackgroundWebGL() {
	const canvas = document.getElementById("webgl");
	if (!canvas || typeof THREE === "undefined") return;

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

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
		`,
		fragmentShader: `
			uniform float uTime;
			varying vec2 vUv;

			void main() {
				float waveA = sin(vUv.x * 8.0 + uTime * 0.8) * 0.035;
				float waveB = cos(vUv.y * 6.0 + uTime * 0.6) * 0.025;

				vec3 base = vec3(0.025, 0.03, 0.06);
				vec3 purple = vec3(0.28, 0.08, 0.45);
				vec3 blue = vec3(0.02, 0.22, 0.35);

				vec3 color = base + waveA * purple + waveB * blue;

				gl_FragColor = vec4(color, 0.95);
			}
		`,
		transparent: true
	});

	const mesh = new THREE.Mesh(geometry, material);
	mesh.position.z = -1;
	scene.add(mesh);

	function animateBackground() {
		material.uniforms.uTime.value += 0.01;
		renderer.render(scene, camera);
		requestAnimationFrame(animateBackground);
	}

	animateBackground();

	window.addEventListener("resize", () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
}

function initWebGL() {
	if (webGLInitialized) return;

	const container = document.getElementById("three-container");
	if (!container || typeof THREE === "undefined") return;

	const fallbackPortrait = container.parentElement?.querySelector(".hero-portrait");
	const containerBox = container.getBoundingClientRect();
	const width = containerBox.width || container.offsetWidth;
	const height = containerBox.height || container.offsetHeight;

	if (!width || !height) {
		requestAnimationFrame(initWebGL);
		return;
	}

	if (window.location.protocol === "file:") {
		console.info("WebGL portrait requires an HTTP server; showing the static portrait instead.");
		return;
	}

	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(
		45,
		width / height,
		0.1,
		1000
	);

	camera.position.z = 30;

	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
		preserveDrawingBuffer: true
	});

	renderer.setClearColor(0x000000, 0);
	renderer.setSize(width, height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	container.appendChild(renderer.domElement);
	webGLInitialized = true;

	if (canUseGsap) {
		gsap.from(".hero-card", {
			y: 40,
			scale: 0.96,
			duration: 1.1,
			ease: "power3.out",
			delay: 0.2
		});
	}

	const startPortrait = (texture) => {
		if (THREE.SRGBColorSpace) {
			texture.colorSpace = THREE.SRGBColorSpace;
		}

		const geometry = new THREE.PlaneGeometry(16, 22, 80, 110);

		const count = geometry.attributes.position.count;
		const randoms = new Float32Array(count * 3);
		const offsets = new Float32Array(count);

		for (let i = 0; i < count; i++) {
			randoms[i * 3] = (Math.random() - 0.5) * 1.2;
			randoms[i * 3 + 1] = (Math.random() - 0.5) * 1.2;
			randoms[i * 3 + 2] = Math.random() * 0.8;
			offsets[i] = Math.random();
		}

		geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));
		geometry.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 1));

		const material = new THREE.ShaderMaterial({
			uniforms: {
				uTexture: { value: texture },
				uMouse: { value: new THREE.Vector2(0.5, 0.5) },
				uHover: { value: 0 },
				uTime: { value: 0 }
			},
			vertexShader: `
				uniform vec2 uMouse;
				uniform float uHover;
				uniform float uTime;

				attribute vec3 aRandom;
				attribute float aOffset;

				varying vec2 vUv;

				void main() {
					vUv = uv;

					vec3 pos = position;

					float dist = distance(uv, uMouse);
					float influence = smoothstep(0.35, 0.0, dist);

					vec3 lift = aRandom * influence * uHover * 1.6;
					float floatMotion = sin(uTime * 0.8 + aOffset * 8.0) * 0.08;

					pos += lift;
					pos.z += floatMotion * uHover;

					gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
				}
			`,
			fragmentShader: `
				uniform sampler2D uTexture;
				varying vec2 vUv;

				void main() {
					gl_FragColor = texture2D(uTexture, vUv);
				}
			`,
			transparent: true
		});

		const mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);

		let hover = 0;

		container.addEventListener("mousemove", (event) => {
			const rect = container.getBoundingClientRect();

			const x = (event.clientX - rect.left) / rect.width;
			const y = 1.0 - (event.clientY - rect.top) / rect.height;

			material.uniforms.uMouse.value.set(x, y);
			hover = 1;
		});

		container.addEventListener("mouseleave", () => {
			hover = 0;
		});

		function animate() {
			requestAnimationFrame(animate);

			material.uniforms.uTime.value += 0.02;
			material.uniforms.uHover.value +=
				(hover - material.uniforms.uHover.value) * 0.06;

			renderer.render(scene, camera);
		}

		renderer.render(scene, camera);
		requestAnimationFrame(() => {
			container.classList.add("webgl-ready");
			fallbackPortrait?.classList.add("webgl-replaced");
		});

		animate();
	};

	const handleTextureError = (error) => {
		console.warn("WebGL portrait image failed to load; keeping the static portrait.", error);
		container.replaceChildren();
		container.classList.remove("webgl-ready");
		fallbackPortrait?.classList.remove("webgl-replaced");
		webGLInitialized = false;
	};

	new THREE.TextureLoader().load(
		"assets/images/Jenna_robot_1.webp",
		startPortrait,
		undefined,
		handleTextureError
	);

	window.addEventListener("resize", () => {
		if (!container.offsetWidth || !container.offsetHeight) return;

		camera.aspect = container.offsetWidth / container.offsetHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.offsetWidth, container.offsetHeight);
	});
}
