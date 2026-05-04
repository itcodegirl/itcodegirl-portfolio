console.log("CINEMATIC PARTICLE SYSTEM LOADED");

const introVideo = document.getElementById("introVideo");

function finishIntro() {
	const intro = document.querySelector(".intro-video");

	if (intro) {
		intro.style.opacity = "0";
		setTimeout(() => intro.remove(), 800);
	}

	document.body.classList.remove("no-scroll");
	initWebGL();
}

window.addEventListener("load", () => {
	if (introVideo) {
		introVideo.addEventListener("ended", finishIntro);
	} else {
		setTimeout(finishIntro, 4000);
	}
});

// function initWebGL() {

// 	const container = document.getElementById("three-container");
// 	if (!container) return;

// 	const scene = new THREE.Scene();

// 	const camera = new THREE.PerspectiveCamera(
// 		45,
// 		container.offsetWidth / container.offsetHeight,
// 		0.1,
// 		1000
// 	);

// 	camera.position.z = 25;

// 	const renderer = new THREE.WebGLRenderer({
// 		antialias: true,
// 		alpha: true
// 	});

// 	renderer.setSize(container.offsetWidth, container.offsetHeight);
// 	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// 	container.appendChild(renderer.domElement);

// 	const textureLoader = new THREE.TextureLoader();

// 	const imagePath = window.location.hostname.includes("github.io")
// 		? "/itcodegirl-portfolio/Jenna_robot_1.jpg"
// 		: "Jenna_robot_1.jpg";

// 	textureLoader.load(imagePath, (texture) => {

// 		const geometry = new THREE.PlaneGeometry(
// 			16,
// 			22,
// 			200,   // width segments
// 			280    // height segments
// 		);

// 		const material = new THREE.ShaderMaterial({
// 			uniforms: {
// 				uTexture: { value: texture },
// 				uMouse: { value: new THREE.Vector2(0, 0) },
// 				uHover: { value: 0 }
// 			},
// 			vertexShader: `
//                 uniform vec2 uMouse;
//                 uniform float uHover;
//                 varying vec2 vUv;

//                 void main() {

//                     vUv = uv;

//                     vec3 pos = position;

//                     float dist = distance(uv, uMouse);

//                     float wave = sin(dist * 30.0 - uHover * 5.0) * 0.5;

//                     float influence = smoothstep(0.4, 0.0, dist);

//                     pos.z += wave * influence * 4.0;

//                     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//                 }
//             `,
// 			fragmentShader: `
//                 uniform sampler2D uTexture;
//                 varying vec2 vUv;

//                 void main() {
//                     gl_FragColor = texture2D(uTexture, vUv);
//                 }
//             `,
// 			transparent: true
// 		});

// 		const mesh = new THREE.Mesh(geometry, material);
// 		scene.add(mesh);

// 		let hover = 0;

// 		container.addEventListener("mousemove", (e) => {

// 			const rect = container.getBoundingClientRect();

// 			const x = (e.clientX - rect.left) / rect.width;
// 			const y = 1.0 - (e.clientY - rect.top) / rect.height;

// 			material.uniforms.uMouse.value.set(x, y);
// 			hover = 1;
// 		});

// 		container.addEventListener("mouseleave", () => {
// 			hover = 0;
// 		});

// 		function animate() {
// 			requestAnimationFrame(animate);

// 			material.uniforms.uHover.value += 0.05 * hover;

// 			renderer.render(scene, camera);
// 		}

// 		animate();
// 	});

// 	window.addEventListener("resize", () => {
// 		camera.aspect = container.offsetWidth / container.offsetHeight;
// 		camera.updateProjectionMatrix();
// 		renderer.setSize(container.offsetWidth, container.offsetHeight);
// 	});
// }

// /* Hover:
// • Glass ripple distortion
// • Depth wave
// • Shards splitting outward
// • Smooth cinematic easing on hover in/out */

// function initWebGL() {

// 	const container = document.getElementById("three-container");
// 	if (!container) return;

// 	const scene = new THREE.Scene();

// 	const camera = new THREE.PerspectiveCamera(
// 		45,
// 		container.offsetWidth / container.offsetHeight,
// 		0.1,
// 		1000
// 	);

// 	camera.position.z = 28;

// 	const renderer = new THREE.WebGLRenderer({
// 		antialias: true,
// 		alpha: true
// 	});

// 	renderer.setSize(container.offsetWidth, container.offsetHeight);
// 	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// 	container.appendChild(renderer.domElement);

// 	const textureLoader = new THREE.TextureLoader();

// 	const imagePath = window.location.hostname.includes("github.io")
// 		? "/itcodegirl-portfolio/Jenna_robot_1.jpg"
// 		: "Jenna_robot_1.jpg";

// 	textureLoader.load(imagePath, (texture) => {

// 		const width = 16;
// 		const height = 22;

// 		const geometry = new THREE.PlaneGeometry(width, height, 180, 240);

// 		// Add random per-vertex direction
// 		const count = geometry.attributes.position.count;
// 		const randoms = new Float32Array(count * 3);

// 		for (let i = 0; i < count; i++) {
// 			randoms[i * 3] = (Math.random() - 0.5) * 2;
// 			randoms[i * 3 + 1] = (Math.random() - 0.5) * 2;
// 			randoms[i * 3 + 2] = Math.random();
// 		}

// 		geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));

// 		const material = new THREE.ShaderMaterial({
// 			uniforms: {
// 				uTexture: { value: texture },
// 				uMouse: { value: new THREE.Vector2(0.5, 0.5) },
// 				uHover: { value: 0 }
// 			},
// 			vertexShader: `
//                 uniform vec2 uMouse;
//                 uniform float uHover;

//                 attribute vec3 aRandom;

//                 varying vec2 vUv;

//                 void main() {

//                     vUv = uv;

//                     vec3 pos = position;

//                     float dist = distance(uv, uMouse);

//                     float influence = smoothstep(0.4, 0.0, dist);

//                     // Glass ripple distortion
//                     pos.z += sin(dist * 40.0) * influence * uHover * 2.5;

//                     // Shard split
//                     pos += aRandom * influence * uHover * 3.0;

//                     gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
//                 }
//             `,
// 			fragmentShader: `
//                 uniform sampler2D uTexture;
//                 varying vec2 vUv;

//                 void main() {

//                     // Subtle glass refraction shift
//                     vec2 distortedUv = vUv + sin(vUv.yx * 20.0) * 0.003;

//                     gl_FragColor = texture2D(uTexture, distortedUv);
//                 }
//             `,
// 			transparent: true
// 		});

// 		const mesh = new THREE.Mesh(geometry, material);
// 		scene.add(mesh);

// 		let hover = 0;

// 		container.addEventListener("mousemove", (e) => {

// 			const rect = container.getBoundingClientRect();

// 			const x = (e.clientX - rect.left) / rect.width;
// 			const y = 1.0 - (e.clientY - rect.top) / rect.height;

// 			material.uniforms.uMouse.value.set(x, y);
// 			hover = 1;
// 		});

// 		container.addEventListener("mouseleave", () => {
// 			hover = 0;
// 		});

// 		function animate() {
// 			requestAnimationFrame(animate);

// 			material.uniforms.uHover.value += (hover - material.uniforms.uHover.value) * 0.08;

// 			renderer.render(scene, camera);
// 		}

// 		animate();
// 	});

// 	window.addEventListener("resize", () => {
// 		camera.aspect = container.offsetWidth / container.offsetHeight;
// 		camera.updateProjectionMatrix();
// 		renderer.setSize(container.offsetWidth, container.offsetHeight);
// 	});
// }

/* At rest:
• Perfect flat image
• Clean
• Sharp

Hover:
• Shards split outward
• Real 3D depth
• Subtle floating motion
• Cinematic micro - rotation */

/* function initWebGL() {

	const container = document.getElementById("three-container");
	if (!container) return;

	const scene = new THREE.Scene();

	const camera = new THREE.PerspectiveCamera(
		45,
		container.offsetWidth / container.offsetHeight,
		0.1,
		1000
	);

	camera.position.z = 32;

	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});

	renderer.setSize(container.offsetWidth, container.offsetHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	container.appendChild(renderer.domElement);

	const textureLoader = new THREE.TextureLoader();

	const imagePath = window.location.hostname.includes("github.io")
		? "/itcodegirl-portfolio/Jenna_robot_1.jpg"
		: "Jenna_robot_1.jpg";

	textureLoader.load(imagePath, (texture) => {

		const width = 16;
		const height = 22;

		// HEAVY subdivision = shard density
		const geometry = new THREE.PlaneGeometry(width, height, 200, 280);

		const count = geometry.attributes.position.count;

		const randoms = new Float32Array(count * 3);
		const offsets = new Float32Array(count);

		for (let i = 0; i < count; i++) {
			randoms[i * 3] = (Math.random() - 0.5) * 2;
			randoms[i * 3 + 1] = (Math.random() - 0.5) * 2;
			randoms[i * 3 + 2] = Math.random() * 2.0;

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
										float influence = smoothstep(0.4, 0.0, dist);

										// shard explosion depth
										vec3 explode = aRandom * influence * uHover * 6.0;

										// floating cinematic drift
										float floatMotion = sin(uTime + aOffset * 10.0) * 0.6;

										pos += explode;
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

		container.addEventListener("mousemove", (e) => {

			const rect = container.getBoundingClientRect();

			const x = (e.clientX - rect.left) / rect.width;
			const y = 1.0 - (e.clientY - rect.top) / rect.height;

			material.uniforms.uMouse.value.set(x, y);
			hover = 1;
		});

		container.addEventListener("mouseleave", () => {
			hover = 0;
		});

		function animate() {

			requestAnimationFrame(animate);

			material.uniforms.uTime.value += 0.02;

			material.uniforms.uHover.value += (hover - material.uniforms.uHover.value) * 0.08;

			// subtle cinematic rotation
			mesh.rotation.y = Math.sin(material.uniforms.uTime.value * 0.2) * 0.1;

			renderer.render(scene, camera);
		}

		animate();
	});

	window.addEventListener("resize", () => {
		camera.aspect = container.offsetWidth / container.offsetHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.offsetWidth, container.offsetHeight);
	});
} */


/* At rest:
• Perfectly sharp image
• No distortion
• Looks completely normal

On hover:
• Glass - like micro fracture
• Shards gently lift in depth
• Soft floating motion
• No chaos
• No explosion

On leave:
• Smooth, slow recomposition
• No snapping */

/*function initWebGL() {

	const container = document.getElementById("three-container");
	if (!container) return;

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
		? "/itcodegirl-portfolio/Jenna_robot_1.jpg"
		: "Jenna_robot_1.jpg";

	textureLoader.load(imagePath, (texture) => {

		const width = 16;
		const height = 22;

		// Moderate subdivision (cleaner, not chaotic)
		const geometry = new THREE.PlaneGeometry(width, height, 120, 160);

		const count = geometry.attributes.position.count;

		const randoms = new Float32Array(count * 3);
		const offsets = new Float32Array(count);

		for (let i = 0; i < count; i++) {
			randoms[i * 3] = (Math.random() - 0.5) * 1.5;
			randoms[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
			randoms[i * 3 + 2] = Math.random() * 1.2;

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

										// Subtle shard lift
										vec3 explode = aRandom * influence * uHover * 2.5;

										// Very soft floating motion
										float floatMotion = sin(uTime * 0.8 + aOffset * 8.0) * 0.15;

										pos += explode;
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

		container.addEventListener("mousemove", (e) => {

			const rect = container.getBoundingClientRect();

			const x = (e.clientX - rect.left) / rect.width;
			const y = 1.0 - (e.clientY - rect.top) / rect.height;

			material.uniforms.uMouse.value.set(x, y);
			hover = 1;
		});

		container.addEventListener("mouseleave", () => {
			hover = 0;
		});

		function animate() {

			requestAnimationFrame(animate);

			material.uniforms.uTime.value += 0.02;

			// Smooth easing (premium feel)
			material.uniforms.uHover.value +=
				(hover - material.uniforms.uHover.value) * 0.06;

			renderer.render(scene, camera);
		}

		animate();
	});

	window.addEventListener("resize", () => {
		camera.aspect = container.offsetWidth / container.offsetHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.offsetWidth, container.offsetHeight);
	});
} */

/*	At rest:
• Looks completely normal
• No visible effect

On hover:
• Slight refraction under cursor
• Micro RGB separation at edges
• Subtle moving shimmer
• Feels like glass catching light
• Very restrained */

/* function initWebGL() {

	const container = document.getElementById("three-container");
	if (!container) return;

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
		? "/itcodegirl-portfolio/Jenna_robot_1.jpg"
		: "Jenna_robot_1.jpg";

	textureLoader.load(imagePath, (texture) => {

		const width = 16;
		const height = 22;

		// Moderate subdivision (cleaner, not chaotic)
		const geometry = new THREE.PlaneGeometry(width, height, 120, 160);

		const count = geometry.attributes.position.count;

		const randoms = new Float32Array(count * 3);
		const offsets = new Float32Array(count);

		for (let i = 0; i < count; i++) {
			randoms[i * 3] = (Math.random() - 0.5) * 1.5;
			randoms[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
			randoms[i * 3 + 2] = Math.random() * 1.2;

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
				varying float vDist;

				void main() {

						vUv = uv;

						vec3 pos = position;

						float dist = distance(uv, uMouse);
						vDist = dist;

						float influence = smoothstep(0.35, 0.0, dist);

						vec3 explode = aRandom * influence * uHover * 2.0;

						float floatMotion = sin(uTime * 0.8 + aOffset * 8.0) * 0.15;

						pos += explode;
						pos.z += floatMotion * uHover;

						gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
				}
		`,
			fragmentShader: `
				uniform sampler2D uTexture;
				uniform float uHover;
				uniform float uTime;

				varying vec2 vUv;
				varying float vDist;

				void main() {

						vec2 uv = vUv;

						// Micro glass refraction near cursor
						float glassInfluence = smoothstep(0.4, 0.0, vDist) * uHover;

						vec2 offset = (uv - 0.5) * 0.01 * glassInfluence;

						vec4 baseColor = texture2D(uTexture, uv + offset);

						// Subtle chromatic separation
						vec4 r = texture2D(uTexture, uv + offset * 1.5);
						vec4 g = texture2D(uTexture, uv);
						vec4 b = texture2D(uTexture, uv - offset * 1.5);

						vec3 chroma = vec3(r.r, g.g, b.b);

						vec3 finalColor = mix(baseColor.rgb, chroma, glassInfluence * 0.4);

						// Soft shimmer highlight
						float shimmer = sin(uTime * 3.0 + vUv.y * 20.0) * 0.03;
						finalColor += shimmer * glassInfluence;

						gl_FragColor = vec4(finalColor, 1.0);
				}
		`,
			transparent: true
		});

		const mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);

		let hover = 0;

		container.addEventListener("mousemove", (e) => {

			const rect = container.getBoundingClientRect();

			const x = (e.clientX - rect.left) / rect.width;
			const y = 1.0 - (e.clientY - rect.top) / rect.height;

			material.uniforms.uMouse.value.set(x, y);
			hover = 1;
		});

		container.addEventListener("mouseleave", () => {
			hover = 0;
		});

		function animate() {

			requestAnimationFrame(animate);

			material.uniforms.uTime.value += 0.02;

			// Smooth easing (premium feel)
			material.uniforms.uHover.value +=
				(hover - material.uniforms.uHover.value) * 0.06;

			renderer.render(scene, camera);
		}

		animate();
	});

	window.addEventListener("resize", () => {
		camera.aspect = container.offsetWidth / container.offsetHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.offsetWidth, container.offsetHeight);
	});
} */

/*At rest:
Perfect image.
No distortion.
No visible effect.

Hover:
Soft separation.
Gentle light shift.
Very controlled depth.
Looks expensive.*/

function initWebGL() {

	const container = document.getElementById("three-container");
	if (!container) return;

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
		? "/itcodegirl-portfolio/Jenna_robot_1.jpg"
		: "Jenna_robot_1.jpg";

	textureLoader.load(imagePath, (texture) => {

		const width = 16;
		const height = 22;

		// Moderate subdivision (cleaner, not chaotic)
		const geometry = new THREE.PlaneGeometry(width, height, 60, 80);

		const count = geometry.attributes.position.count;

		const randoms = new Float32Array(count * 3);
		const offsets = new Float32Array(count);

		for (let i = 0; i < count; i++) {
			randoms[i * 3] = (Math.random() - 0.5) * 1.5;
			randoms[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
			randoms[i * 3 + 2] = Math.random() * 1.2;

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
        varying float vDist;

        void main() {

            vUv = uv;

            vec3 pos = position;

            float dist = distance(uv, uMouse);
            vDist = dist;

            float influence = smoothstep(0.22, 0.0, dist);

            // Gentle glass separation
            vec3 lift = aRandom * influence * uHover * 0.25;

            // Slow editorial float
            float floatZ = sin(uTime * 0.6 + aOffset * 4.0) * 0.02;

            pos += lift;
            pos.z += floatZ * uHover;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
			fragmentShader: `
        uniform sampler2D uTexture;
        uniform float uHover;
        uniform float uTime;

        varying vec2 vUv;
        varying float vDist;

        void main() {

            vec2 uv = vUv;

            float influence = smoothstep(0.4, 0.0, vDist) * uHover;

            // Micro refraction
            vec2 refractOffset = (uv - 0.5) * 0.003 * influence;

            vec4 base = texture2D(uTexture, uv + refractOffset);

            // Subtle chromatic glass edge
            vec4 r = texture2D(uTexture, uv + refractOffset * 1.4);
            vec4 g = texture2D(uTexture, uv);
            vec4 b = texture2D(uTexture, uv - refractOffset * 1.4);

            vec3 glassColor = vec3(r.r, g.g, b.b);

            vec3 color = mix(base.rgb, glassColor, influence * 0.25);

            // Editorial light sweep
            float sweep = smoothstep(0.2, 0.8, vUv.y + sin(uTime * 0.4) * 0.1);
            color += sweep * influence * 0.06;

            gl_FragColor = vec4(color, 1.0);
        }
    `,
			transparent: true
		});

		const mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);

		let hover = 0;

		container.addEventListener("mousemove", (e) => {

			const rect = container.getBoundingClientRect();

			const x = (e.clientX - rect.left) / rect.width;
			const y = 1.0 - (e.clientY - rect.top) / rect.height;

			material.uniforms.uMouse.value.set(x, y);
			hover = 1;
		});

		container.addEventListener("mouseleave", () => {
			hover = 0;
		});

		function animate() {

			requestAnimationFrame(animate);

			material.uniforms.uTime.value += 0.01;

			// Smooth easing (premium feel)
			material.uniforms.uHover.value +=
				(hover - material.uniforms.uHover.value) * 0.06;

			renderer.render(scene, camera);
		}

		animate();
	});

	window.addEventListener("resize", () => {
		camera.aspect = container.offsetWidth / container.offsetHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.offsetWidth, container.offsetHeight);
	});
}