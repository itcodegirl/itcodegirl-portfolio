/* INTRO SAFE VERSION */

window.addEventListener("load", () => {

	const intro = document.querySelector(".intro");
	const introSpans = document.querySelectorAll(".intro-text span");

	if (!intro) return;

	const tl = gsap.timeline({
		onComplete: () => {
			intro.style.display = "none";
		}
	});

	tl.to(introSpans, {
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

	// FAILSAFE — remove intro no matter what after 4 seconds
	setTimeout(() => {
		intro.style.display = "none";
	}, 4000);

});

gsap.registerPlugin(ScrollTrigger);

/* ================= LENIS ================= */

let lenis;

if (typeof Lenis !== "undefined") {

	lenis = new Lenis({
		smooth: true,
		lerp: 0.08
	});

	function raf(time) {
		lenis.raf(time);
		requestAnimationFrame(raf);
	}

	requestAnimationFrame(raf);

} else {
	console.warn("Lenis not loaded — smooth scroll disabled.");
}

/* ================= FINAL BOSS CURSOR ================= */

const dot = document.createElement("div");
dot.classList.add("cursor-dot");

const ring = document.createElement("div");
ring.classList.add("cursor-ring");

document.body.appendChild(dot);
document.body.appendChild(ring);

let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let pos = { x: mouse.x, y: mouse.y };

document.addEventListener("mousemove", e => {
	mouse.x = e.clientX;
	mouse.y = e.clientY;
});

/* Smooth physics follow */
gsap.ticker.add(() => {
	pos.x += (mouse.x - pos.x) * 0.15;
	pos.y += (mouse.y - pos.y) * 0.15;

	gsap.set(dot, {
		x: mouse.x - 3,
		y: mouse.y - 3
	});

	gsap.set(ring, {
		x: pos.x - 30,
		y: pos.y - 30
	});
});

/* Stretch effect on velocity */
let lastX = mouse.x;
let lastY = mouse.y;

gsap.ticker.add(() => {
	const dx = mouse.x - lastX;
	const dy = mouse.y - lastY;
	const speed = Math.sqrt(dx * dx + dy * dy);

	const scaleX = 1 + Math.min(speed / 150, 0.5);
	const scaleY = 1 - Math.min(speed / 300, 0.3);

	gsap.to(ring, {
		scaleX: scaleX,
		scaleY: scaleY,
		duration: 0.2,
		transformOrigin: "center"
	});

	lastX = mouse.x;
	lastY = mouse.y;
});

document.addEventListener("DOMContentLoaded", () => {

	const dot = document.createElement("div");
	dot.classList.add("cursor-dot");

	const ring = document.createElement("div");
	ring.classList.add("cursor-ring");

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

		gsap.set(dot, {
			x: mouse.x - 3,
			y: mouse.y - 3
		});

		gsap.set(ring, {
			x: pos.x - 30,
			y: pos.y - 30
		});
	});

});


/* ================= MAGNETIC BUTTONS ================= */

document.querySelectorAll("a, .work-card").forEach(el => {
	el.addEventListener("mouseenter", () => {
		ring.classList.add("active");
		ring.innerHTML = "View";
	});

	el.addEventListener("mouseleave", () => {
		ring.classList.remove("active");
		ring.innerHTML = "";
	});

	el.addEventListener("mousemove", e => {
		const rect = el.getBoundingClientRect();
		const x = e.clientX - rect.left - rect.width / 2;
		const y = e.clientY - rect.top - rect.height / 2;

		gsap.to(el, {
			x: x * 0.15,
			y: y * 0.15,
			duration: 0.3,
			ease: "power3.out"
		});
	});

	el.addEventListener("mouseleave", () => {
		gsap.to(el, {
			x: 0,
			y: 0,
			duration: 0.5,
			ease: "elastic.out(1, 0.3)"
		});
	});
});

/* ================= SPLIT HERO ================= */

const splitText = document.querySelector(".split");
if (splitText) {
	const words = splitText.innerText.split(" ");
	splitText.innerHTML = words.map(word => `<span>${word}</span>`).join(" ");

	gsap.from(".split span", {
		opacity: 0,
		y: 80,
		stagger: 0.05,
		duration: 1.2,
		ease: "power4.out",
		delay: 1.5
	});
}

/* ================= SCROLL REVEALS ================= */

gsap.utils.toArray(".fade-up").forEach(el => {
	gsap.from(el, {
		y: 80,
		opacity: 0,
		duration: 1.2,
		ease: "power3.out",
		scrollTrigger: {
			trigger: el,
			start: "top 85%"
		}
	});
});




