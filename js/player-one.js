/*
 * Player One homepage behaviour: the hero portrait split and the skills ticker.
 * Both are progressive — the page is complete and readable without them.
 */

function setupHeroPortraitSplit() {
	const range = document.querySelector(".hero-portrait-range");
	const overlay = document.querySelector(".hero-portrait-overlay");
	const divider = document.querySelector(".hero-portrait-divider");

	if (!range || !overlay || !divider) return;

	const applySplit = () => {
		const value = Number(range.value);
		overlay.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
		divider.style.left = `${value}%`;
	};

	range.addEventListener("input", applySplit);
	applySplit();
}

function setupSkillsTicker() {
	const track = document.querySelector(".skills-ticker-track");
	const line = track && track.querySelector("[data-ticker-line]");

	if (!track || !line) return;

	const clone = line.cloneNode(true);
	clone.removeAttribute("data-ticker-line");
	track.appendChild(clone);
}

setupHeroPortraitSplit();
setupSkillsTicker();
