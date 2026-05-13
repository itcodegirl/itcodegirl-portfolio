const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const coarsePointer = window.matchMedia("(pointer: coarse)");
const motionScriptSources = {
	three: "https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js"
};
const loadedScripts = new Map();
let webGLSupport;
let webGLInitialized = false;
let webGLLoadRequested = false;
let pageHasLoaded = document.readyState === "complete";

function getConnection() {
	return navigator.connection || navigator.mozConnection || navigator.webkitConnection;
}

function hasSaveDataPreference() {
	return Boolean(getConnection()?.saveData);
}

function supportsWebGL() {
	if (typeof webGLSupport === "boolean") {
		return webGLSupport;
	}

	try {
		const canvas = document.createElement("canvas");
		webGLSupport = Boolean(
			window.WebGLRenderingContext &&
			(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
		);
	} catch {
		webGLSupport = false;
	}

	return webGLSupport;
}

function addScriptPreconnect(src) {
	const { origin } = new URL(src, window.location.href);
	const existing = Array.from(document.querySelectorAll("link[rel='preconnect']"))
		.some(link => link.href === `${origin}/` || link.href === origin);

	if (existing) return;

	const link = document.createElement("link");
	link.rel = "preconnect";
	link.href = origin;
	link.crossOrigin = "";
	document.head.appendChild(link);
}

function loadScript(src) {
	if (loadedScripts.has(src)) {
		return loadedScripts.get(src);
	}

	const loadPromise = new Promise((resolve, reject) => {
		const existingScript = Array.from(document.scripts).find(script => script.src === src);

		if (existingScript?.dataset.loaded === "true") {
			resolve(existingScript);
			return;
		}

		if (existingScript) {
			existingScript.addEventListener("load", () => resolve(existingScript), { once: true });
			existingScript.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
			return;
		}

		addScriptPreconnect(src);

		const script = document.createElement("script");
		script.src = src;
		script.async = true;
		script.onload = () => {
			script.dataset.loaded = "true";
			resolve(script);
		};
		script.onerror = () => {
			script.remove();
			loadedScripts.delete(src);
			reject(new Error(`Failed to load ${src}`));
		};

		document.head.appendChild(script);
	});

	loadedScripts.set(src, loadPromise);
	return loadPromise;
}

function shouldRunWebGLPortrait() {
	const hasPortraitTarget = Boolean(document.getElementById("three-container"));

	return (
		hasPortraitTarget &&
		!prefersReducedMotion.matches &&
		!hasSaveDataPreference() &&
		!coarsePointer.matches &&
		supportsWebGL() &&
		window.location.protocol !== "file:"
	);
}

const scrollProgress = document.querySelector(".scroll-progress");
const nav = document.querySelector(".site-header");
let revealObserver = null;

// Single rAF-batched scroll handler driving both the progress bar and the
// nav hide-on-scroll behaviour. Avoids two raw scroll listeners running per
// frame.
let lastScrollY = window.scrollY;
let scrollFrame = 0;

function onScrollFrame() {
	scrollFrame = 0;
	const y = window.scrollY;
	const reducedMotion = prefersReducedMotion.matches;

	if (scrollProgress && !reducedMotion) {
		const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
		const ratio = maxScroll > 0 ? y / maxScroll : 0;
		scrollProgress.style.transform = `scaleX(${ratio})`;
	}

	if (nav) {
		if (reducedMotion) {
			nav.classList.remove("nav-hidden");
			lastScrollY = y;
			return;
		}

		const navContainsFocus = nav.contains(document.activeElement);
		const isNearTop = y <= 90;
		const isScrollingDown = y > lastScrollY;
		const isScrollingUp = y < lastScrollY;

		if (navContainsFocus || isNearTop || isScrollingUp) {
			nav.classList.remove("nav-hidden");
		} else if (isScrollingDown) {
			nav.classList.add("nav-hidden");
		} else {
			nav.classList.remove("nav-hidden");
		}
	}

	lastScrollY = y;
}

function setupRevealObserver() {
	if (prefersReducedMotion.matches || revealObserver) return;

	const revealEls = document.querySelectorAll(
		".skill-card, .project-card, .about-content, .about-image, .contact-card"
	);

	if (!revealEls.length) return;

	revealObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add("revealed");
				revealObserver.unobserve(entry.target);
			}
		});
	}, { threshold: 0.1 });

	revealEls.forEach(el => {
		if (el.classList.contains("revealed")) return;
		el.classList.add("reveal");
		revealObserver.observe(el);
	});
}

function syncReducedMotionState() {
	if (prefersReducedMotion.matches) {
		if (nav) {
			nav.classList.remove("nav-hidden");
		}

		if (scrollProgress) {
			scrollProgress.style.transform = "";
		}

		if (revealObserver) {
			revealObserver.disconnect();
			revealObserver = null;
		}

		document.querySelectorAll(".reveal").forEach(el => {
			el.classList.remove("reveal");
			el.classList.add("revealed");
		});

		lastScrollY = window.scrollY;
		return;
	}

	setupRevealObserver();
	onScrollFrame();

	if (pageHasLoaded) {
		runSafely(requestWebGLPortrait);
	}
}

if (scrollProgress || nav) {
	window.addEventListener("scroll", () => {
		if (scrollFrame) return;
		scrollFrame = requestAnimationFrame(onScrollFrame);
	}, { passive: true });
}

if (nav) {
	nav.addEventListener("focusin", () => {
		nav.classList.remove("nav-hidden");
	});
}

if (typeof prefersReducedMotion.addEventListener === "function") {
	prefersReducedMotion.addEventListener("change", syncReducedMotionState);
} else if (typeof prefersReducedMotion.addListener === "function") {
	prefersReducedMotion.addListener(syncReducedMotionState);
}

// Active nav link tracks current section
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav a[href^='#']");
if (sections.length && navLinks.length) {
	const setActiveNavLink = (sectionId) => {
		navLinks.forEach(link => {
			const isActive = link.getAttribute("href") === `#${sectionId}`;
			link.classList.toggle("nav-active", isActive);

			if (isActive) {
				link.setAttribute("aria-current", "location");
			} else {
				link.removeAttribute("aria-current");
			}
		});
	};

	const sectionObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				setActiveNavLink(entry.target.id);
			}
		});
	}, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
	sections.forEach(s => sectionObserver.observe(s));
}

// Scroll reveal for cards and sections
setupRevealObserver();
syncReducedMotionState();

function runSafely(callback) {
	try {
		const result = callback();

		if (result && typeof result.catch === "function") {
			result.catch((error) => {
				console.warn("Interactive effect failed to start.", error);
			});
		}
	} catch (error) {
		console.warn("Interactive effect failed to start.", error);
	}
}

function requestWebGLPortrait() {
	if (!shouldRunWebGLPortrait() || webGLInitialized || webGLLoadRequested) return;

	webGLLoadRequested = true;

	return loadScript(motionScriptSources.three)
		.then(() => {
			if (typeof window.THREE === "undefined") {
				throw new Error("Three.js did not attach to window.");
			}

			initWebGL();
		})
		.catch((error) => {
			webGLLoadRequested = false;
			console.warn("Three.js failed to load; keeping the static portrait.", error);
		});
}

window.addEventListener("load", () => {
	pageHasLoaded = true;

	runSafely(requestWebGLPortrait);
});

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const contactFieldConfigs = [
	{
		field: document.getElementById("contactName"),
		errorEl: document.getElementById("contactNameError")
	},
	{
		field: document.getElementById("contactEmail"),
		errorEl: document.getElementById("contactEmailError")
	},
	{
		field: document.getElementById("contactMessage"),
		errorEl: document.getElementById("contactMessageError")
	}
].filter(({ field, errorEl }) => field && errorEl);

function getContactFieldMessage(field) {
	const fieldValue = field.value.trim();

	if (field.id === "contactName") {
		if (!fieldValue) return "Please enter your name.";
		return "";
	}

	if (field.id === "contactEmail") {
		if (!fieldValue) return "Please enter your email address.";
		if (!emailPattern.test(fieldValue)) return "Please enter a valid email address.";
		return "";
	}

	if (field.id === "contactMessage") {
		if (!fieldValue) return "Please add a message before sending.";
		return "";
	}

	return field.validationMessage;
}

function clearFieldError(field, errorEl) {
	field.removeAttribute("aria-invalid");
	errorEl.textContent = "";
}

function updateFieldError(config) {
	const { field, errorEl } = config;

	if (field.validity.valid) {
		clearFieldError(field, errorEl);
		return true;
	}

	field.setAttribute("aria-invalid", "true");
	errorEl.textContent = getContactFieldMessage(field) || field.validationMessage;
	return false;
}

function clearContactFieldErrors() {
	contactFieldConfigs.forEach(({ field, errorEl }) => {
		clearFieldError(field, errorEl);
	});
}

function validateContactFields() {
	let allValid = true;

	contactFieldConfigs.forEach((config) => {
		if (!updateFieldError(config)) {
			allValid = false;
		}
	});

	return allValid;
}

if (contactForm && formStatus) {
	contactFieldConfigs.forEach((config) => {
		const { field, errorEl } = config;

		field.addEventListener("blur", () => {
			updateFieldError(config);
		});

		field.addEventListener("input", () => {
			if (field.validity.valid) {
				clearFieldError(field, errorEl);
				return;
			}

			if (field.getAttribute("aria-invalid") === "true") {
				updateFieldError(config);
			}
		});

		field.addEventListener("invalid", () => {
			updateFieldError(config);
		});
	});

	contactForm.addEventListener("submit", async (e) => {
		e.preventDefault();
		const btn = contactForm.querySelector(".form-submit");
		formStatus.className = "form-status";
		formStatus.textContent = "";

		const isValid = contactForm.checkValidity();
		validateContactFields();

		if (!isValid) {
			contactForm.reportValidity();
			return;
		}

		btn.disabled = true;
		btn.textContent = "Sending...";

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
				clearContactFieldErrors();
			} else {
				throw new Error();
			}
		} catch {
			formStatus.className = "form-status form-status--error";
			formStatus.textContent = "Something went wrong. Please email me directly.";
		} finally {
			btn.disabled = false;
			btn.innerHTML = "Send message <span aria-hidden='true'>&rarr;</span>";
		}
	});
}

async function initHeroCardAnimation() {
	if (!shouldRunHeroCardAnimation()) return;

	try {
		await loadScript(motionScriptSources.gsap);
	} catch (error) {
		console.warn("GSAP failed to load; skipping hero animation.", error);
		return;
	}

	if (typeof gsap === "undefined") {
		console.warn("GSAP unavailable; skipping hero animation.");
		return;
	}

	gsap.from(".hero-card", {
		y: 40,
		scale: 0.96,
		duration: 1.1,
		ease: "power3.out",
		delay: 0.2
	});
}

async function initWebGLExperience() {
	if (!shouldRunWebGLPortrait()) return;

	try {
		await loadScript(motionScriptSources.three);
	} catch (error) {
		console.warn("Three.js failed to load; keeping the static portrait.", error);
		return;
	}

	if (typeof THREE === "undefined") {
		console.warn("Three.js unavailable; keeping the static portrait.");
		return;
	}

	if (!shouldRunWebGLPortrait()) return;

	initWebGL();
	initBackgroundWebGL();
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

	let bgFrame = 0;
	function animateBackground() {
		material.uniforms.uTime.value += 0.01;
		renderer.render(scene, camera);
		bgFrame = requestAnimationFrame(animateBackground);
	}

	function startBg() {
		if (!bgFrame) bgFrame = requestAnimationFrame(animateBackground);
	}

	function stopBg() {
		if (bgFrame) {
			cancelAnimationFrame(bgFrame);
			bgFrame = 0;
		}
	}

	startBg();

	// Pause when the tab is hidden to avoid wasted GPU/CPU work.
	document.addEventListener("visibilitychange", () => {
		if (document.hidden) stopBg(); else startBg();
	});

	window.addEventListener("resize", () => {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
}

function initWebGL(retries = 0) {
	if (webGLInitialized) return;

	const container = document.getElementById("three-container");
	if (!container || typeof THREE === "undefined") return;

	const fallbackPortrait = container.parentElement?.querySelector(".hero-portrait");
	const containerBox = container.getBoundingClientRect();
	const width = containerBox.width || container.offsetWidth;
	const height = containerBox.height || container.offsetHeight;

	if (!width || !height) {
		// Container has no layout box yet (e.g. fonts/CSS still loading).
		// Retry on the next frame, but cap to avoid an infinite loop if the
		// hero is hidden for some reason.
		if (retries < 60) {
			requestAnimationFrame(() => initWebGL(retries + 1));
		}
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
		alpha: true
	});

	renderer.setClearColor(0x000000, 0);
	renderer.setSize(width, height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	container.appendChild(renderer.domElement);
	webGLInitialized = true;

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
		let frame = 0;
		let inView = true;

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
			frame = requestAnimationFrame(animate);

			material.uniforms.uTime.value += 0.02;
			material.uniforms.uHover.value +=
				(hover - material.uniforms.uHover.value) * 0.06;

			renderer.render(scene, camera);
		}

		function start() {
			if (!frame && inView && !document.hidden) {
				frame = requestAnimationFrame(animate);
			}
		}

		function stop() {
			if (frame) {
				cancelAnimationFrame(frame);
				frame = 0;
			}
		}

		// Pause when the hero is offscreen — saves GPU/CPU while reading
		// other sections.
		const heroVisibility = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				inView = entry.isIntersecting;
				if (inView) start(); else stop();
			});
		}, { threshold: 0 });
		heroVisibility.observe(container);

		// Pause when the tab is hidden.
		document.addEventListener("visibilitychange", () => {
			if (document.hidden) stop(); else start();
		});

		renderer.render(scene, camera);
		requestAnimationFrame(() => {
			container.classList.add("webgl-ready");
			fallbackPortrait?.classList.add("webgl-replaced");
		});

		start();
	};

	const handleTextureError = (error) => {
		console.warn("WebGL portrait image failed to load; keeping the static portrait.", error);
		container.replaceChildren();
		container.classList.remove("webgl-ready");
		fallbackPortrait?.classList.remove("webgl-replaced");
		webGLInitialized = false;
		webGLLoadRequested = false;
	};

	new THREE.TextureLoader().load(
		"assets/images/Jenna_robot_840.webp",
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
