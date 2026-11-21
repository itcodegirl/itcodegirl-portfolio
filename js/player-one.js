/* Player One portrait split: progressive enhancement. */
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

setupHeroPortraitSplit();
