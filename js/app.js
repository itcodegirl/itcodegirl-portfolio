const introVideo = document.getElementById("introVideo");
const introSkip = document.querySelector(".intro-skip");
const skipLink = document.querySelector(".skip-link");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const canUseGsap = typeof gsap !== "undefined";
const canUseScrollTrigger = typeof ScrollTrigger !== "undefined";

if (canUseGsap && canUseScrollTrigger) {
	gsap.registerPlugin(ScrollTrigger);
}

let introFinished = false;
let webGLInitialized = false;

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
		initWebGL();
	}
}

window.addEventListener("load", () => {
	// Always start background
	if (!prefersReducedMotion.matches) {
		initBackgroundWebGL();
	}

	// ALWAYS initialize portrait (critical fix)
	initWebGL();

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

	webGLInitialized = true;

	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(
		45,
		container.offsetWidth / container.offsetHeight,
		0.1,
		1000
	);

	camera.position.z = 30;

	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});

	renderer.setClearColor(0x000000, 0);
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	container.appendChild(renderer.domElement);

	if (canUseGsap) {
		gsap.from(".hero-card", {
			y: 40,
			scale: 0.96,
			duration: 1.1,
			ease: "power3.out",
			delay: 0.2
		});
	}

	const textureLoader = new THREE.TextureLoader();

	const imagePath = window.location.hostname.includes("github.io")
		? "/itcodegirl-portfolio/assets/images/Jenna_robot_1.jpg"
		: "assets/images/Jenna_robot_1.jpg";

	textureLoader.load(imagePath, (texture) => {
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
		container.classList.add("webgl-ready");
		container.parentElement?.querySelector(".hero-portrait")?.classList.add("webgl-replaced");

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

		animate();
	});

	window.addEventListener("resize", () => {
		if (!container.offsetWidth || !container.offsetHeight) return;

		camera.aspect = container.offsetWidth / container.offsetHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.offsetWidth, container.offsetHeight);
	});
}
