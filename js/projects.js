// Selected work data + rendering.
//
// Each project is rendered as an article with a header (number + status),
// optional screenshot OR placeholder, title, tagline, optional proof points,
// description, optional subtext, an explicit "My role" line, optional
// highlights (problem / decisions / focus), tech list, and links.
//
// Link order is normalised on render: Live demo -> Case study -> Code.
//
const projects = [
	{
		id: "codeherway",
		number: "01",
		title: "CodeHerWay Education Platform",
		tagline: "Learning platform helping women entering tech build foundational skills.",
		status: "Featured Case Study",
		featured: true,
		meta: "React • Supabase • Learning platform",
		description:
			"A frontend-focused learning platform with structured lessons, quizzes, progress tracking, and a beginner-friendly interface. Built around how people actually learn, not how courses are usually packaged.",
		proofPoints: ["Supabase auth", "Persisted progress", "XP / streak logic", "Quiz feedback"],
		subtext: [
			"Authentication, persisted progress, and a reward engine (XP and streaks) are wired through Supabase so the experience matches real product behavior, not a static demo.",
		],
		role:
			"I own this product end to end — frontend architecture, the lesson and quiz UI, progress tracking, and the XP/streak reward engine, plus the Supabase auth and data layer behind it.",
		highlights: [
			{
				label: "Problem",
				text: "Beginners drop off when resources are scattered and progress is invisible.",
			},
			{
				label: "Key decisions",
				text: "Guided lesson flow, immediate quiz feedback, and a streak/XP system that rewards consistency over volume.",
			},
			{
				label: "Engineering focus",
				text: "Component structure for a scalable lesson tree, Supabase auth and row-level data access, and async UI states throughout.",
			},
		],
		image: "",
		imagePosition: "top center",
		imageAlt: "CodeHerWay Education Platform dashboard interface screenshot",
		tech: ["React", "Supabase", "PostgreSQL", "JavaScript", "Vite"],
		links: [
			{
				kind: "live",
				label: "Live demo",
				url: "https://codeherway-education-platform.netlify.app/",
				ariaLabel: "Open the CodeHerWay Education Platform live demo",
			},
			{
				kind: "case-study",
				label: "Case study",
				url: "/work/codeherway/",
				ariaLabel: "Read the CodeHerWay Education Platform case study",
			},
			{
				kind: "code",
				label: "View code",
				url: "https://github.com/itcodegirl/education_platform",
				ariaLabel: "View the CodeHerWay Education Platform GitHub repository",
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
			"A React productivity dashboard for founders managing priorities, opportunities, content planning, and weekly execution in one workspace.",
		proofPoints: ["React routing", "Local persistence", "Founder workflow UI", "Weekly planning"],
		subtext: [
			"Designed to reduce cognitive load: a single source of truth for what matters this week, with persistence between sessions.",
		],
		role:
			"I designed and built the dashboard: the one-screen overview, opportunity tracker, and weekly planning views, the routing per workspace area, and the persisted local state between sessions.",
		highlights: [
			{
				label: "Problem",
				text: "Founders juggle context across too many tools; the important work gets lost in tool-switching.",
			},
			{
				label: "Key decisions",
				text: "One-screen overview, opportunity tracking, weekly planning view, and minimal chrome so the data is the interface.",
			},
			{
				label: "Engineering focus",
				text: "Routing per workspace area, persisted state via Local Storage, and a small, predictable component tree.",
			},
		],
		image: "",
		imagePosition: "top center",
		imageAlt: "CodeHerWay CEO OS dashboard interface screenshot",
		tech: ["React", "React Router", "Local Storage", "JavaScript"],
		links: [
			{
				kind: "live",
				label: "Live demo",
				url: "https://codeherway-ceo-os.netlify.app/",
				ariaLabel: "Open the CodeHerWay CEO OS live demo",
			},
			{
				kind: "case-study",
				label: "Case study",
				url: "/work/ceo-os/",
				ariaLabel: "Read the CodeHerWay CEO OS case study",
			},
			{
				kind: "code",
				label: "View code",
				url: "https://github.com/itcodegirl/codeherway-ceo-os",
				ariaLabel: "View the CodeHerWay CEO OS GitHub repository",
			},
		],
	},
	{
		id: "aura",
		number: "03",
		title: "Aura Weather",
		tagline: "Responsive weather app focused on clear hierarchy and quick scanning.",
		description:
			"A weather app built around how people actually use weather data: glance, decide, move on. Real-time conditions, hourly forecasts, and location-based insights with a clean information hierarchy.",
		proofPoints: ["REST API data", "Loading states", "Responsive layout", "Clear forecast hierarchy"],
		subtext: [
			"Polished loading and empty states keep the interface trustworthy when data is in flight or unavailable.",
		],
		role:
			"I built the whole frontend — the responsive layout, the scannable hourly forecast, the async data flow against the weather API, and the loading and empty states that keep it trustworthy.",
		highlights: [
			{
				label: "Problem",
				text: "Most weather UIs bury the answer under decoration and density.",
			},
			{
				label: "Key decisions",
				text: "Clear visual hierarchy, scannable hourly strip, and meaningful loading/empty states instead of spinners.",
			},
			{
				label: "Engineering focus",
				text: "Async data flow, component-driven UI, and responsive layout work without a framework.",
			},
		],
		image: "",
		imagePosition: "top center",
		imageAlt: "Aura Weather app interface screenshot",
		tech: ["JavaScript", "HTML5", "CSS", "REST API"],
		links: [
			{
				kind: "live",
				label: "Live demo",
				url: "https://aura-weather-platform.netlify.app/",
				ariaLabel: "Open the Aura Weather live demo",
			},
			{
				kind: "case-study",
				label: "Case study",
				url: "/work/aura-weather/",
				ariaLabel: "Read the Aura Weather case study",
			},
			{
				kind: "code",
				label: "View code",
				url: "https://github.com/itcodegirl/aura-weather",
				ariaLabel: "View the Aura Weather GitHub repository",
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

function createProjectProofList(proofPoints, projectTitle) {
	const proofList = document.createElement("ul");
	proofList.className = "project-proof";
	proofList.setAttribute("aria-label", `Implementation highlights for ${projectTitle}`);

	proofPoints.forEach((point) => {
		appendTextElement(proofList, "li", "", point);
	});

	return proofList;
}

function createProjectTechList(techItems) {
	const techList = document.createElement("ul");
	techList.className = "project-tech";

	techItems.forEach((tech) => {
		appendTextElement(techList, "li", "", tech);
	});

	return techList;
}

function createProjectHighlights(highlights) {
	const highlightsList = document.createElement("ul");
	highlightsList.className = "case-study-preview";

	highlights.forEach((highlight) => {
		const item = document.createElement("li");
		appendTextElement(item, "span", "case-label", highlight.label);
		appendTextElement(item, "p", "", highlight.text);
		highlightsList.appendChild(item);
	});

	return highlightsList;
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

	if (project.proofPoints) {
		article.appendChild(createProjectProofList(project.proofPoints, project.title));
	}

	appendTextElement(article, "p", "project-description", project.description);

	if (project.subtext) {
		project.subtext.forEach((text) => {
			appendTextElement(article, "p", "project-subtext", text);
		});
	}

	if (project.role) {
		const roleParagraph = document.createElement("p");
		roleParagraph.className = "project-role";
		appendTextElement(roleParagraph, "span", "project-role-label", "My role");
		roleParagraph.append(` — ${project.role}`);
		article.appendChild(roleParagraph);
	}

	if (project.highlights) {
		article.appendChild(createProjectHighlights(project.highlights));
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
