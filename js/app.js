const introVideo = document.getElementById("introVideo");

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

	initWebGL();
}

window.addEventListener("load", () => {
	if (introVideo) {
		introVideo.addEventListener("ended", finishIntro);
		introVideo.addEventListener("error", finishIntro);

		setTimeout(finishIntro, 4500);
	} else {
		finishIntro();
	}
});

function initWebGL() {
	if (webGLInitialized) return;
	webGLInitialized = true;

	const container = document.getElementById("three-container");
	if (!container || typeof THREE === "undefined") return;

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

	renderer.setSize(container.offsetWidth, container.offsetHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	container.appendChild(renderer.domElement);

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