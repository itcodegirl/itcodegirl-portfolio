// =======================
// INTRO ANIMATION (GSAP)
// =======================

window.addEventListener("load", () => {

	const intro = document.querySelector(".intro");
	const spans = document.querySelectorAll(".intro-text span");

	if (!intro) return;

	const tl = gsap.timeline({
		onComplete: () => {
			intro.style.display = "none";
		}
	});

	tl.to(spans, {
		opacity: 1,
		y: -20,
		stagger: 0.25,
		duration: 1.2,
		ease: "power3.out"
	});

	tl.to(intro, {
		y: "-100%",
		duration: 1.3,
		ease: "power4.inOut",
		delay: 0.3
	});

	setTimeout(() => {
		intro.style.display = "none";
	}, 4000);

});

