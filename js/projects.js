// Selected work data + rendering.
//
// Each project is rendered as an article with a header (number + status),
// optional screenshot OR placeholder, title, tagline, product value,
// built-feature summary, UX/engineering challenge, proof available,
// tech list, and links.
//
// Link order is normalised on render: Live demo -> Case study -> Code.
//
const projects = [
	{
		id: "codeherway",
		number: "01",
		title: "CodeHerWay Education Platform",
		tagline: "Learning platform helping women entering tech build foundational skills.",
		status: "Flagship project",
		featured: true,
		meta: "React • Supabase • Learning platform",
		description:
			"Flagship React learning platform with guided lessons, quiz feedback, persisted progress, Supabase integration, and reward-based motivation logic.",
		productValue:
			"Helps beginners move through lessons, quizzes, progress, and rewards in one guided learner flow.",
		built:
			"React product UI, guided lesson flow, quiz feedback states, persisted learner progress, XP/streak logic, and Supabase-backed auth/data integration.",
		challenge:
			"Balancing beginner-friendly UX with real product logic across loading, feedback, saved progress, and incomplete flows.",
		proofAvailable: [
			"React product UI",
			"Supabase auth/data integration",
			"Persisted learner progress",
			"Quiz feedback states",
			"XP / streak logic",
			"Case study with decision notes",
		],
		image: "assets/images/projects/codeherway-dashboard.webp",
		imagePosition: "top center",
		imageAlt: "CodeHerWay Education Platform dashboard interface screenshot",
		tech: ["React", "Supabase", "PostgreSQL", "JavaScript", "Vite"],
		links: [
			{
				kind: "live",
				label: "Live demo",
				url: "https://codeherway-education-platform.netlify.app/",
				ariaLabel: "Live demo for CodeHerWay Education Platform",
			},
			{
				kind: "case-study",
				label: "Case study",
				url: "/work/codeherway/",
				ariaLabel: "Case study for CodeHerWay Education Platform",
			},
			{
				kind: "code",
				label: "View code",
				url: "https://github.com/itcodegirl/education_platform",
				ariaLabel: "View code for CodeHerWay Education Platform",
			},
		],
	},
	{
		id: "ceo",
		number: "02",
		title: "CodeHerWay CEO OS",
		tagline: "Founder dashboard for tracking priorities, opportunities, and weekly execution.",
		cardClass: "ceo-os",
		description:
			"Focused React founder dashboard for priorities, opportunities, weekly planning, and local-first workflow state.",
		productValue:
			"Helps a solo founder see what needs attention now without scattering work across unrelated tools.",
		built:
			"Focus Home, opportunity tracker, weekly planning views, workspace routing, persisted local state, and source-status cues.",
		challenge:
			"Making local-first data feel trustworthy while keeping a dense founder workflow calm and scannable.",
		proofAvailable: [
			"Live demo",
			"Source code",
			"Case study",
			"QA notes",
			"Last verified date",
		],
		image: "assets/images/projects/ceo-os-dashboard.webp",
		imagePosition: "top center",
		imageAlt: "CodeHerWay CEO OS dashboard interface screenshot",
		tech: ["React", "React Router", "Local Storage", "JavaScript"],
		links: [
			{
				kind: "live",
				label: "Live demo",
				url: "https://codeherway-ceo-os.netlify.app/",
				ariaLabel: "Live demo for CodeHerWay CEO OS",
			},
			{
				kind: "case-study",
				label: "Case study",
				url: "/work/ceo-os/",
				ariaLabel: "Case study for CodeHerWay CEO OS",
			},
			{
				kind: "code",
				label: "View code",
				url: "https://github.com/itcodegirl/codeherway-ceo-os",
				ariaLabel: "View code for CodeHerWay CEO OS",
			},
		],
	},
	{
		id: "aura",
		number: "03",
		title: "Aura Weather",
		tagline: "Responsive weather app focused on clear hierarchy and quick scanning.",
		description:
			"Frontend weather dashboard centered on quick scanning, resilient API states, and honest handling of missing data.",
		productValue:
			"Helps people check current conditions and forecast context quickly before making daily decisions.",
		built:
			"Responsive forecast interface, city search, API data handling, loading and unavailable states, and mobile layout behavior.",
		challenge:
			"Keeping weather data readable while representing delayed or missing provider values honestly.",
		proofAvailable: [
			"Live demo",
			"Source code",
			"Case study",
			"QA notes",
			"Last verified date",
		],
		image: "assets/images/projects/aura-weather-interface.webp",
		imagePosition: "top center",
		imageAlt: "Aura Weather app interface screenshot",
		tech: ["JavaScript", "HTML5", "CSS", "REST API"],
		links: [
			{
				kind: "live",
				label: "Live demo",
				url: "https://aura-weather-platform.netlify.app/",
				ariaLabel: "Live demo for Aura Weather",
			},
			{
				kind: "case-study",
				label: "Case study",
				url: "/work/aura-weather/",
				ariaLabel: "Case study for Aura Weather",
			},
			{
				kind: "code",
				label: "View code",
				url: "https://github.com/itcodegirl/aura-weather",
				ariaLabel: "View code for Aura Weather",
			},
		],
	},
];

const LINK_ORDER = ["live", "case-study", "code"];

const projectsGrid = document.getElementById("projectsGrid");

function appendTextElement(parent, tagName, className, text) {
	const element = document.createElement(tagName);

	if (className) {
		element.className = className;
	}

	element.textContent = text;
	parent.appendChild(element);

	return element;
}

function classForLink(kind) {
	if (kind === "code") return "project-link-github";
	if (kind === "case-study") return "project-link-btn project-link-btn--case-study";
	return "project-link-btn project-link-btn--primary";
}

function isExternalLink(url) {
	return /^https?:\/\//i.test(url);
}

function sortLinks(links) {
	return [...links].sort((a, b) => {
		const aIndex = LINK_ORDER.indexOf(a.kind);
		const bIndex = LINK_ORDER.indexOf(b.kind);
		return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
	});
}

function createProjectLinks(links) {
	const linksContainer = document.createElement("div");
	linksContainer.className = "project-links";

	sortLinks(links).forEach((link) => {
		const anchor = document.createElement("a");
		anchor.href = link.url;
		if (isExternalLink(link.url)) {
			anchor.target = "_blank";
			anchor.rel = "noopener noreferrer";
		}
		anchor.className = classForLink(link.kind);
		if (link.ariaLabel) anchor.setAttribute("aria-label", link.ariaLabel);
		anchor.textContent = link.label;
		linksContainer.appendChild(anchor);
	});

	return linksContainer;
}

function createProjectEvidenceList(project) {
	const evidenceItems = [
		["Product value", project.productValue],
		["What I built", project.built],
		["UX / engineering challenge", project.challenge],
	].filter(([, text]) => Boolean(text));

	if (!evidenceItems.length) return null;

	const evidenceList = document.createElement("dl");
	evidenceList.className = "project-evidence";

	evidenceItems.forEach(([label, text]) => {
		const group = document.createElement("div");
		appendTextElement(group, "dt", "project-evidence-label", label);
		appendTextElement(group, "dd", "", text);
		evidenceList.appendChild(group);
	});

	return evidenceList;
}

function createProjectProofList(proofPoints, projectTitle) {
	const proofGroup = document.createElement("div");
	proofGroup.className = "project-proof-group";

	appendTextElement(proofGroup, "p", "project-proof-label", "Proof Available");

	const proofList = document.createElement("ul");
	proofList.className = "project-proof";
	proofList.setAttribute("aria-label", `Proof available for ${projectTitle}`);

	proofPoints.forEach((point) => {
		appendTextElement(proofList, "li", "", point);
	});

	proofGroup.appendChild(proofList);

	return proofGroup;
}

function createProjectTechList(techItems) {
	const techList = document.createElement("ul");
	techList.className = "project-tech";
	techList.setAttribute("aria-label", "Technology used");

	techItems.forEach((tech) => {
		appendTextElement(techList, "li", "", tech);
	});

	return techList;
}

function createScreenshot(project) {
	const img = document.createElement("img");
	img.src = project.image;
	img.alt = project.imageAlt || `${project.title} interface screenshot`;
	img.className = "project-screenshot";
	img.loading = "lazy";
	img.decoding = "async";
	if (project.imagePosition) {
		img.style.setProperty("--project-image-position", project.imagePosition);
	}
	img.width = 800;
	img.height = 450;
	return img;
}

function createPlaceholder(project) {
	const placeholder = document.createElement("div");
	placeholder.className = "project-placeholder";
	placeholder.setAttribute("aria-hidden", "true");

	const number = document.createElement("span");
	number.className = "project-placeholder-number";
	number.textContent = project.number;
	placeholder.appendChild(number);

	const liveLink = (project.links || []).find((l) => l.kind === "live");
	const label = document.createElement("span");
	label.className = "project-placeholder-label";
	label.textContent = liveLink ? "Live preview available" : "Project preview";
	placeholder.appendChild(label);

	return placeholder;
}

function createProjectCard(project) {
	const article = document.createElement("article");
	const titleId = `project-${project.id}-title`;

	article.className = [
		"project-card",
		project.featured ? "project-card-featured" : "",
		project.image ? "" : "project-card--no-image",
		project.cardClass || "",
	]
		.filter(Boolean)
		.join(" ");
	article.setAttribute("aria-labelledby", titleId);

	if (project.meta) {
		article.dataset.meta = project.meta;
	}

	const header = document.createElement("div");
	header.className = "project-header";

	const number = appendTextElement(header, "span", "project-number", project.number);
	number.setAttribute("aria-hidden", "true");

	if (project.status) {
		appendTextElement(header, "span", "project-status", project.status);
	}

	article.appendChild(header);

	if (project.image) {
		const screenshot = createScreenshot(project);
		screenshot.addEventListener(
			"error",
			() => {
				article.classList.add("project-card--no-image");
				screenshot.replaceWith(createPlaceholder(project));
			},
			{ once: true }
		);
		article.appendChild(screenshot);
	} else {
		article.appendChild(createPlaceholder(project));
	}

	const title = appendTextElement(article, "h3", "", project.title);
	title.id = titleId;

	if (project.tagline) {
		appendTextElement(article, "p", "project-tagline", project.tagline);
	}

	appendTextElement(article, "p", "project-description", project.description);

	const evidenceList = createProjectEvidenceList(project);
	if (evidenceList) {
		article.appendChild(evidenceList);
	}

	if (project.proofAvailable) {
		article.appendChild(createProjectProofList(project.proofAvailable, project.title));
	}

	if (project.role) {
		const roleParagraph = document.createElement("p");
		roleParagraph.className = "project-role";
		appendTextElement(roleParagraph, "span", "project-role-label", "My role");
		roleParagraph.append(` - ${project.role}`);
		article.appendChild(roleParagraph);
	}

	article.appendChild(createProjectTechList(project.tech));
	article.appendChild(createProjectLinks(project.links));

	return article;
}

if (projectsGrid) {
	const fragment = document.createDocumentFragment();

	projects.forEach((project) => {
		fragment.appendChild(createProjectCard(project));
	});

	projectsGrid.replaceChildren(fragment);
}
