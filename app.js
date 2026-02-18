gsap.registerPlugin(ScrollTrigger);

/* ================================
	 INTRO
================================ */

const introVideo = document.getElementById("introVideo");
let introFinished = false;

function finishIntro() {
	if (introFinished) return;
	introFinished = true;

	const intro = document.querySelector(".intro-video");
	if (intro) {
		intro.style.opacity = "0";
		setTimeout(() => intro.remove(), 800);
	}

	document.body.classList.remove("no-scroll");

	initWebGL();
	initHeroAnimation();
	initSectionReveals();
}

introVideo?.addEventListener("ended", finishIntro);
setTimeout(finishIntro, 5000);

/* ================================
	 HERO TEXT ANIMATION
================================ */

function initHeroAnimation() {
	gsap.from(".hero-title", {
		opacity: 0,
		y: 60,
		duration: 1.6,
		ease: "power3.out"
	});

	gsap.from(".hero-sub", {
		opacity: 0,
		y: 40,
		duration: 1.6,
		delay: 0.3,
		ease: "power3.out"
	});
}

/* ================================
	 SECTION REVEALS
================================ */

function initSectionReveals() {
	gsap.utils.toArray("section:not(.hero)").forEach((sec) => {
		gsap.from(sec, {
			opacity: 0,
			y: 60,
			duration: 1.2,
			ease: "power3.out",
			scrollTrigger: {
				trigger: sec,
				start: "top 85%",
				once: true
			}
		});
	});
}

/* ================================
	 WEBGL PARTICLE PORTRAIT
================================ */

function initWebGL() {

	const container = document.getElementById('three-container');
	if (!container) return;

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);

	const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(container.offsetWidth, container.offsetHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	container.appendChild(renderer.domElement);

	const textureLoader = new THREE.TextureLoader();

	textureLoader.load(
		'Jenna_robot_1.jpg',
		(texture) => {

			texture.minFilter = THREE.LinearFilter;
			texture.magFilter = THREE.LinearFilter;
			texture.generateMipmaps = false;

			const material = new THREE.ShaderMaterial({
				uniforms: { uTexture: { value: texture } },
				vertexShader: `
				uniform sampler2D uTexture;
				attribute float size;
				varying vec4 vColor;

				void main() {
					vColor = texture2D(uTexture, uv);
					vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
					gl_Position = projectionMatrix * mvPosition;
					gl_PointSize = size * (400.0 / -mvPosition.z);
				}
			`,
				fragmentShader: `
				varying vec4 vColor;

				void main() {
					vec2 center = gl_PointCoord - vec2(0.5);
					float dist = length(center);
					if (dist > 0.5) discard;

					float alpha = 1.0 - smoothstep(0.2, 0.5, dist);

					vec3 boosted = pow(vColor.rgb * 1.8, vec3(0.85));

					gl_FragColor = vec4(boosted, alpha);
				}
			`,
				transparent: true,
				depthWrite: false,
				blending: THREE.AdditiveBlending
			});

			const particles = new THREE.Points(geometry, material);
			scene.add(particles);
		}
	);


	///Better Values For Portrait
	const imageWidth = 110;
	const imageHeight = 160;

	const particleCount = imageWidth * imageHeight;

	const geometry = new THREE.BufferGeometry();
	const positions = new Float32Array(particleCount * 3);
	const originalPositions = new Float32Array(particleCount * 3);
	const targetPositions = new Float32Array(particleCount * 3);
	const uvs = new Float32Array(particleCount * 2);
	const sizes = new Float32Array(particleCount);

	let index = 0;
	for (let i = 0; i < imageWidth; i++) {
		for (let j = 0; j < imageHeight; j++) {

			const x = (i / imageWidth) * 14 - 7;
			const y = (j / imageHeight) * 16 - 8;

			positions[index * 3] = x;
			positions[index * 3 + 1] = y;
			positions[index * 3 + 2] = 0;

			originalPositions.set([x, y, 0], index * 3);
			targetPositions.set([x, y, 0], index * 3);

			uvs[index * 2] = i / (imageWidth - 1);
			uvs[index * 2 + 1] = j / (imageHeight - 1);


			sizes[index] = Math.random() * 0.6 + 0.4;


			index++;
		}
	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
	geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));


	const particles = new THREE.Points(geometry, material);
	scene.add(particles);

	camera.position.z = 20;

	let isDragging = false;
	let mouseX = 0;
	let mouseY = 0;

	container.addEventListener('mousedown', () => isDragging = true);
	container.addEventListener('mouseup', () => isDragging = false);

	container.addEventListener('mousemove', (e) => {
		if (!isDragging) return;

		const rect = container.getBoundingClientRect();
		mouseX = (e.clientX - rect.left) / rect.width;
		mouseY = 1 - (e.clientY - rect.top) / rect.height;

		for (let i = 0; i < particleCount; i++) {
			const ox = originalPositions[i * 3];
			const oy = originalPositions[i * 3 + 1];

			const dx = ox - (mouseX * 14 - 7);
			const dy = oy - (mouseY * 16 - 8);
			const dist = Math.sqrt(dx * dx + dy * dy);

			if (dist < 2) {
				targetPositions[i * 3] = ox + dx * 2;
				targetPositions[i * 3 + 1] = oy + dy * 2;
			}
		}
	});

	function animate() {
		requestAnimationFrame(animate);

		for (let i = 0; i < particleCount; i++) {
			positions[i * 3] += (targetPositions[i * 3] - positions[i * 3]) * 0.08;
			positions[i * 3 + 1] += (targetPositions[i * 3 + 1] - positions[i * 3 + 1]) * 0.08;

			targetPositions[i * 3] = originalPositions[i * 3];
			targetPositions[i * 3 + 1] = originalPositions[i * 3 + 1];
		}

		geometry.attributes.position.needsUpdate = true;
		renderer.render(scene, camera);
	}

	animate();

	window.addEventListener('resize', () => {
		camera.aspect = container.offsetWidth / container.offsetHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.offsetWidth, container.offsetHeight);
	});
}
