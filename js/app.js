const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const scrollProgress = document.querySelector(".scroll-progress");
const nav = document.querySelector(".site-header");
let revealObserver = null;

// Single rAF-batched scroll handler driving both the progress bar and the
// nav hide-on-scroll behavior. Avoids multiple raw scroll listeners per frame.
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
		".evidence-card, .review-path, .skill-card, .project-card, .about-content, .about-image, .contact-card"
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

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav a[href^='#']");

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

	sections.forEach(section => sectionObserver.observe(section));
}

setupRevealObserver();
syncReducedMotionState();

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

	contactForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		const btn = contactForm.querySelector(".form-submit");
		formStatus.className = "form-status";
		formStatus.textContent = "";

		const isValid = contactForm.checkValidity();
		validateContactFields();

		if (!isValid) {
			contactForm.reportValidity();
			return;
		}

		if (btn) {
			btn.disabled = true;
			btn.textContent = "Sending...";
		}

		try {
			const res = await fetch(contactForm.action, {
				method: "POST",
				body: new FormData(contactForm),
				headers: { Accept: "application/json" }
			});

			if (!res.ok) throw new Error();

			formStatus.className = "form-status form-status--success";
			formStatus.textContent = "Message sent! I'll be in touch soon.";
			contactForm.reset();
			clearContactFieldErrors();
		} catch {
			formStatus.className = "form-status form-status--error";
			formStatus.textContent = "Something went wrong. Please email me directly.";
		} finally {
			if (btn) {
				btn.disabled = false;
				btn.innerHTML = "Send message <span aria-hidden='true'>&rarr;</span>";
			}
		}
	});
}
