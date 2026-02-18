gsap.registerPlugin(ScrollTrigger);

/* =====================================================
	 INTRO VIDEO SYSTEM WITH FALLBACK
===================================================== */

const introVideo = document.getElementById("introVideo");
let introFinished = false;
let introStartTime = Date.now();
const MINIMUM_INTRO_DURATION = 3000; // Minimum 3 seconds display time

function finishIntro() {
	if (introFinished) return;

	const elapsed = Date.now() - introStartTime;
	const remainingTime = Math.max(0, MINIMUM_INTRO_DURATION - elapsed);

	// If we haven't shown the intro for long enough, wait
	if (remainingTime > 0) {
		setTimeout(() => finishIntro(), remainingTime);
		return;
	}

	introFinished = true;
	console.log('Finishing intro after', elapsed, 'ms');

	// Remove intro video with smooth fade
	const intro = document.querySelector(".intro-video");
	if (intro) {
		intro.style.opacity = '0';
		setTimeout(() => intro.remove(), 800); // Slower fade out
	}

	// Enable scrolling
	document.body.classList.remove("no-scroll");

	// Show WebGL canvas
	const canvas = document.getElementById("webgl");
	if (canvas) {
		canvas.classList.remove("webgl-hidden");
		canvas.style.opacity = "1";
	}

	// Refresh ScrollTrigger and initialize animations
	if (typeof ScrollTrigger !== 'undefined') {
		ScrollTrigger.refresh(true);
	}

	// Initialize all systems
	initWebGL();
	initHeroCinematic();
	initSectionReveals();
	initSkillsAnimation();
	initNavCinematic();
	initProjectModals();
	initContactAnimations();
}

// Video event listeners
if (introVideo) {
	introVideo.addEventListener("ended", finishIntro);
	introVideo.addEventListener("error", (e) => {
		console.log('Video error, will finish intro after minimum duration:', e);
		finishIntro();
	});
	introVideo.addEventListener("abort", (e) => {
		console.log('Video aborted, will finish intro after minimum duration:', e);
		finishIntro();
	});

	// Check if video can play
	introVideo.addEventListener("canplay", () => {
		console.log('Video can play');
	});

	// Extended fallback if video doesn't load (but still respects minimum duration)
	setTimeout(() => {
		if (!introFinished) {
			console.log('Video timeout, finishing intro');
			finishIntro();
		}
	}, 8000); // Extended to 8 seconds maximum wait
} else {
	// No video element found, but still show intro screen for minimum duration
	console.log('No video element found, showing intro screen for minimum duration');
	finishIntro();
}

// Additional fallback for when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
	setTimeout(() => {
		if (!introFinished) {
			console.log('DOM ready fallback, finishing intro');
			finishIntro();
		}
	}, 2000); // Increased fallback time
});

/* =====================================================
	 ENHANCED PROJECT MODAL SYSTEM
===================================================== */

function initProjectModals() {
	const modalOverlay = document.getElementById('modalOverlay');
	const viewButtons = document.querySelectorAll('.view-btn');
	const closeButtons = document.querySelectorAll('.modal-close');

	// Open modal function
	function openModal(modalId) {
		const modal = document.getElementById(`modal${modalId}`);
		if (modal && modalOverlay) {
			modalOverlay.classList.add('active');
			modal.classList.add('active');
			document.body.style.overflow = 'hidden';

			// Add entrance animation
			gsap.from(modal.querySelector('.glass-modal'), {
				scale: 0.8,
				opacity: 0,
				y: 50,
				duration: 0.4,
				ease: "back.out(1.7)"
			});
		}
	}

	// Close modal function
	function closeModal() {
		const activeModal = document.querySelector('.modal.active');
		if (activeModal && modalOverlay) {
			// Add exit animation
			gsap.to(activeModal.querySelector('.glass-modal'), {
				scale: 0.9,
				opacity: 0,
				y: 30,
				duration: 0.3,
				ease: "power2.in",
				onComplete: () => {
					modalOverlay.classList.remove('active');
					activeModal.classList.remove('active');
					document.body.style.overflow = '';
				}
			});
		}
	}

	// Event listeners for view buttons
	viewButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			e.preventDefault();
			const projectId = button.getAttribute('data-project');
			if (projectId) {
				openModal(projectId);
			}
		});
	});

	// Event listeners for close buttons
	closeButtons.forEach(button => {
		button.addEventListener('click', closeModal);
	});

	// Close modal when clicking overlay
	modalOverlay?.addEventListener('click', (e) => {
		if (e.target === modalOverlay) {
			closeModal();
		}
	});

	// Close modal with Escape key
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			closeModal();
		}
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
	 ENHANCED SKILLS ANIMATION
===================================================== */

function initSkillsAnimation() {
	const timeline = document.querySelector(".skills-timeline");

	if (!timeline) return;

	// Create the animated line element if it doesn't exist
	let animatedLine = timeline.querySelector('.timeline-progress');
	if (!animatedLine) {
		animatedLine = document.createElement('div');
		animatedLine.className = 'timeline-progress';
		animatedLine.style.cssText = `
			position: absolute;
			left: -1px;
			top: 0;
			width: 2px;
			height: 0%;
			background: linear-gradient(#ffffffaa, #ffffff33);
			box-shadow: 0 0 15px #ffffff55;
			z-index: 1;
		`;
		timeline.appendChild(animatedLine);
	}

	// Animate the timeline line
	ScrollTrigger.create({
		trigger: ".skills-timeline",
		start: "top 80%",
		end: "bottom 20%",
		scrub: 1,
		onUpdate: (self) => {
			const progress = self.progress;
			animatedLine.style.height = `${progress * 100}%`;
		}
	});

	// Animate skill items
	gsap.utils.toArray(".skill-item").forEach((item, index) => {
		gsap.fromTo(item,
			{
				opacity: 0,
				y: 40
			},
			{
				opacity: 1,
				y: 0,
				duration: 1.1,
				ease: "power3.out",
				delay: index * 0.2,
				scrollTrigger: {
					trigger: item,
					start: "top 85%"
				}
			}
		);
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
	 ENHANCED WORK CARD ANIMATIONS
===================================================== */

gsap.utils.toArray(".glass-card").forEach((card, i) => {
	// Entrance animation
	gsap.from(card, {
		opacity: 0,
		y: 50,
		scale: 0.9,
		duration: 1,
		delay: i * 0.1,
		ease: "back.out(1.7)",
		scrollTrigger: {
			trigger: card,
			start: "top 85%"
		}
	});

	// Hover parallax effect
	card.addEventListener('mousemove', (e) => {
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left - rect.width / 2;
		const y = e.clientY - rect.top - rect.height / 2;

		gsap.to(card, {
			duration: 0.3,
			rotateX: y * 0.05,
			rotateY: x * 0.05,
			transformPerspective: 1000
		});
	});

	card.addEventListener('mouseleave', () => {
		gsap.to(card, {
			duration: 0.5,
			rotateX: 0,
			rotateY: 0
		});
	});
});

/* =====================================================
	 SCROLL PROGRESS BAR
===================================================== */

const progressBar = document.querySelector(".scroll-progress");

window.addEventListener("scroll", () => {
	const scrollTop = window.scrollY;
	const docHeight = document.body.scrollHeight - innerHeight;
	const progress = Math.min((scrollTop / docHeight) * 100, 100);
	if (progressBar) {
		progressBar.style.height = progress + "%";
	}
});

/* =====================================================
	 PREMIUM — MAGNETIC CURSOR
===================================================== */

const cursor = document.querySelector(".custom-cursor");

if (cursor) {
	let mouseX = 0;
	let mouseY = 0;
	let cursorX = 0;
	let cursorY = 0;

	// Smooth cursor movement
	function updateCursor() {
		cursorX += (mouseX - cursorX) * 0.1;
		cursorY += (mouseY - cursorY) * 0.1;

		cursor.style.left = cursorX + "px";
		cursor.style.top = cursorY + "px";

		requestAnimationFrame(updateCursor);
	}

	window.addEventListener("mousemove", (e) => {
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	updateCursor();

	// Magnetic attraction for interactive elements
	document.querySelectorAll("a, button, .glass-card").forEach(el => {
		el.addEventListener("mousemove", (e) => {
			const rect = el.getBoundingClientRect();
			const x = e.clientX - rect.left - rect.width / 2;
			const y = e.clientY - rect.top - rect.height / 2;

			gsap.to(el, {
				duration: 0.3,
				x: x * 0.1,
				y: y * 0.1,
				scale: 1.03,
				ease: "power2.out"
			});
		});

		el.addEventListener("mouseleave", () => {
			gsap.to(el, {
				duration: 0.5,
				x: 0,
				y: 0,
				scale: 1,
				ease: "power2.out"
			});
		});
	});
}

/* =====================================================
	 HERO — Scroll Light Sweep
===================================================== */

gsap.to(".hero-title::after", {
	xPercent: 180,
	scrollTrigger: {
		trigger: ".hero",
		start: "top 20%",
		end: "bottom top",
		scrub: 1.2
	}
});

/* =====================================================
	 PARALLAX SECTION FLOAT
===================================================== */

gsap.utils.toArray(".parallax-section").forEach((sec, i) => {
	gsap.fromTo(sec,
		{ y: 0 },
		{
			y: 40,
			ease: "none",
			scrollTrigger: {
				trigger: sec,
				start: "top bottom",
				end: "bottom top",
				scrub: 1.3
			}
		}
	);
});

/* =====================================================
	 SMOOTH SCROLL NAVIGATION
===================================================== */

document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute('href'));

		if (target) {
			gsap.to(window, {
				duration: 1.5,
				scrollTo: target,
				ease: "power2.inOut"
			});
		}
	});
});

/* =====================================================
	 DRAG-CONTROLLED PARTICLE DISPLACEMENT
===================================================== */

function initWebGL() {
	const container = document.getElementById('three-container');
	if (!container || typeof THREE === 'undefined') {
		console.log('Three.js not available or container not found');
		return;
	}

	console.log('Initializing drag-controlled particle displacement');

	// Scene setup
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});

	renderer.setSize(container.offsetWidth, container.offsetHeight);
	renderer.setClearColor(0x000000, 0);
	container.appendChild(renderer.domElement);

	// Load the image texture
	const textureLoader = new THREE.TextureLoader();
	const imageTexture = textureLoader.load('./Jenna_robot_1.jpg', function (texture) {
		console.log('Portrait texture loaded successfully');
	});

	// Create particle system
	const imageWidth = 100;
	const imageHeight = 120;
	const particleCount = imageWidth * imageHeight;

	const geometry = new THREE.BufferGeometry();
	const positions = new Float32Array(particleCount * 3);
	const originalPositions = new Float32Array(particleCount * 3);
	const targetPositions = new Float32Array(particleCount * 3);
	const velocities = new Float32Array(particleCount * 3);
	const uvs = new Float32Array(particleCount * 2);
	const sizes = new Float32Array(particleCount);

	// Initialize particle positions and UVs
	let index = 0;
	for (let i = 0; i < imageWidth; i++) {
		for (let j = 0; j < imageHeight; j++) {
			const x = (i / imageWidth) * 14 - 7;
			const y = (j / imageHeight) * 16 - 8;
			const z = 0;

			positions[index * 3] = x;
			positions[index * 3 + 1] = y;
			positions[index * 3 + 2] = z;

			originalPositions[index * 3] = x;
			originalPositions[index * 3 + 1] = y;
			originalPositions[index * 3 + 2] = z;

			targetPositions[index * 3] = x;
			targetPositions[index * 3 + 1] = y;
			targetPositions[index * 3 + 2] = z;

			velocities[index * 3] = 0;
			velocities[index * 3 + 1] = 0;
			velocities[index * 3 + 2] = 0;

			uvs[index * 2] = i / imageWidth;
			uvs[index * 2 + 1] = j / imageHeight;

			sizes[index] = Math.random() * 0.4 + 0.2;
			index++;
		}
	}

	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
	geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

	// Custom shader material
	const vertexShader = `
		uniform sampler2D uTexture;
		
		attribute float size;
		
		varying vec2 vUv;
		varying vec4 vColor;
		
		void main() {
			vUv = uv;
			vColor = texture2D(uTexture, uv);
			
			vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
			gl_Position = projectionMatrix * mvPosition;
			gl_PointSize = size * (400.0 / -mvPosition.z);
		}
	`;

	const fragmentShader = `
		varying vec2 vUv;
		varying vec4 vColor;
		
		void main() {
			vec2 center = gl_PointCoord - vec2(0.5);
			float dist = length(center);
			
			if (dist > 0.5) discard;
			
			float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
			
			// Brighten colors for better visibility
			vec3 brightColor = vColor.rgb * 1.8;
			brightColor = pow(brightColor, vec3(0.9));
			
			gl_FragColor = vec4(brightColor, alpha * 0.95);
		}
	`;

	const material = new THREE.ShaderMaterial({
		uniforms: {
			uTexture: { value: imageTexture }
		},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		transparent: true
	});

	const particleSystem = new THREE.Points(geometry, material);
	scene.add(particleSystem);

	camera.position.z = 20;

	// Mouse/drag interaction variables
	let isDragging = false;
	let mouseX = 0;
	let mouseY = 0;
	let dragForce = 0;
	let animationProgress = 0;
	let isReturning = false;

	// Mouse event handlers
	function onMouseDown(event) {
		isDragging = true;
		isReturning = false;
		container.style.cursor = 'grabbing';
		updateMousePosition(event);
	}

	function onMouseMove(event) {
		updateMousePosition(event);

		if (isDragging) {
			dragForce = Math.min(dragForce + 0.02, 1.0);
			animationProgress = Math.min(animationProgress + 0.015, 1.0);

			// Calculate displacement for particles
			for (let i = 0; i < particleCount; i++) {
				const originalX = originalPositions[i * 3];
				const originalY = originalPositions[i * 3 + 1];
				const originalZ = originalPositions[i * 3 + 2];

				// Distance from mouse
				const screenX = (originalX + 7) / 14; // Normalize to 0-1
				const screenY = (originalY + 8) / 16; // Normalize to 0-1
				const mouseDistance = Math.sqrt(
					Math.pow(screenX - mouseX, 2) +
					Math.pow(screenY - mouseY, 2)
				);

				// Explosive displacement
				const maxDistance = 0.4;
				if (mouseDistance < maxDistance) {
					const force = (maxDistance - mouseDistance) / maxDistance;
					const angle = Math.atan2(screenY - mouseY, screenX - mouseX);

					const displaceX = Math.cos(angle) * force * 12 * animationProgress;
					const displaceY = Math.sin(angle) * force * 12 * animationProgress;
					const displaceZ = force * 6 * animationProgress;

					targetPositions[i * 3] = originalX + displaceX;
					targetPositions[i * 3 + 1] = originalY + displaceY;
					targetPositions[i * 3 + 2] = originalZ + displaceZ;
				}
			}
		}
	}

	function onMouseUp(event) {
		isDragging = false;
		isReturning = true;
		container.style.cursor = 'grab';
	}

	function updateMousePosition(event) {
		const rect = container.getBoundingClientRect();
		mouseX = (event.clientX - rect.left) / rect.width;
		mouseY = 1.0 - (event.clientY - rect.top) / rect.height;
	}

	// Add event listeners
	container.addEventListener('mousedown', onMouseDown);
	container.addEventListener('mousemove', onMouseMove);
	container.addEventListener('mouseup', onMouseUp);
	container.style.cursor = 'grab';

	// Animation loop
	function animate() {
		requestAnimationFrame(animate);

		const positionAttribute = geometry.attributes.position;

		// Return to original positions when not dragging
		if (isReturning) {
			animationProgress = Math.max(animationProgress - 0.03, 0);
			dragForce = Math.max(dragForce - 0.05, 0);

			if (animationProgress <= 0) {
				isReturning = false;
			}
		}

		// Update particle positions with smooth interpolation
		for (let i = 0; i < particleCount; i++) {
			const originalX = originalPositions[i * 3];
			const originalY = originalPositions[i * 3 + 1];
			const originalZ = originalPositions[i * 3 + 2];

			const targetX = targetPositions[i * 3];
			const targetY = targetPositions[i * 3 + 1];
			const targetZ = targetPositions[i * 3 + 2];

			// Smooth interpolation
			const lerpFactor = 0.1;
			positions[i * 3] += (targetX - positions[i * 3]) * lerpFactor;
			positions[i * 3 + 1] += (targetY - positions[i * 3 + 1]) * lerpFactor;
			positions[i * 3 + 2] += (targetZ - positions[i * 3 + 2]) * lerpFactor;

			// Return to original when not dragging
			if (!isDragging) {
				targetPositions[i * 3] = originalX;
				targetPositions[i * 3 + 1] = originalY;
				targetPositions[i * 3 + 2] = originalZ;
			}
		}

		positionAttribute.needsUpdate = true;

		renderer.render(scene, camera);
	}

	animate();

	// Handle resize
	function handleResize() {
		if (!container.offsetWidth || !container.offsetHeight) return;

		camera.aspect = container.offsetWidth / container.offsetHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.offsetWidth, container.offsetHeight);
	}

	window.addEventListener('resize', handleResize);
	setTimeout(handleResize, 100);

	// Cleanup
	return function cleanup() {
		container.removeEventListener('mousedown', onMouseDown);
		container.removeEventListener('mousemove', onMouseMove);
		container.removeEventListener('mouseup', onMouseUp);
		window.removeEventListener('resize', handleResize);
		if (container.contains(renderer.domElement)) {
			container.removeChild(renderer.domElement);
		}
		renderer.dispose();
		material.dispose();
		geometry.dispose();
		imageTexture.dispose();
	};
}

/* =====================================================
	 CONTACT FORM ENHANCEMENT (if needed)
===================================================== */

function initContactAnimations() {
	gsap.utils.toArray(".contact-link").forEach((link, i) => {
		gsap.from(link, {
			opacity: 0,
			y: 30,
			duration: 0.8,
			delay: i * 0.1,
			ease: "back.out(1.7)",
			scrollTrigger: {
				trigger: link,
				start: "top 90%"
			}
		});
	});
}

/* =====================================================
	 ACCESSIBILITY ENHANCEMENTS
===================================================== */

// Keyboard navigation for modals
document.addEventListener('keydown', (e) => {
	if (e.key === 'Tab') {
		const activeModal = document.querySelector('.modal.active');
		if (activeModal) {
			const focusableElements = activeModal.querySelectorAll(
				'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
			);

			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			if (e.shiftKey && document.activeElement === firstElement) {
				lastElement.focus();
				e.preventDefault();
			} else if (!e.shiftKey && document.activeElement === lastElement) {
				firstElement.focus();
				e.preventDefault();
			}
		}
	}
});

/* =====================================================
	 PERFORMANCE OPTIMIZATIONS
===================================================== */

// Debounce scroll events
function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}

// Initialize contact animations after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	initContactAnimations();
});

/* =====================================================
	 ERROR HANDLING
===================================================== */

window.addEventListener('error', (e) => {
	console.error('JavaScript error:', e.error);
});

// Handle GSAP/ScrollTrigger not loading
if (typeof gsap === 'undefined') {
	console.warn('GSAP not loaded, falling back to CSS animations');
}

if (typeof ScrollTrigger === 'undefined') {
	console.warn('ScrollTrigger not loaded, some animations may not work');
}