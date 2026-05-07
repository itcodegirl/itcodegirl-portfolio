// Selected work data + rendering.
//
// Each project is rendered as an article with a header (number + status),
// optional screenshot OR placeholder, title, tagline, description, optional
// highlights (problem / decisions / status), tech list, and links.
//
// Link order is normalised on render: Live demo -> Case study -> Code.
//
// TODO: replace `image: null` with real screenshots in /assets/images/projects/
// once available. The placeholder treatment is intentional, not broken state.

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
		subtext: [
			"Authentication, persisted progress, and a reward engine (XP and streaks) are wired through Supabase so the experience matches real product behavior, not a static demo.",
		],
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
		image: null,
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
				url: "https://codeherway-reward-engine-case-study.netlify.app/",
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
		subtext: [
			"Designed to reduce cognitive load: a single source of truth for what matters this week, with persistence between sessions.",
		],
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
		image: null,
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
				url: "https://codeherway-ceo-os-case-study.netlify.app/",
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
		subtext: [
			"Polished loading and empty states keep the interface trustworthy when data is in flight or unavailable.",
		],
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
		image: null,
		tech: ["JavaScript", "HTML5", "CSS", "REST API"],
		links: [
			{
				kind: "live",
				label: "Live demo",
				url: "https://aura-weather-platform.netlify.app/",
				ariaLabel: "Open the Aura Weather live demo",
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
		anchor.target = "_blank";
		anchor.rel = "noopener noreferrer";
		anchor.className = classForLink(link.kind);
		if (link.ariaLabel) anchor.setAttribute("aria-label", link.ariaLabel);
		anchor.textContent = link.label;
		linksContainer.appendChild(anchor);
	});

	return linksContainer;
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
	img.alt = `${project.title} interface screenshot`;
	img.className = "project-screenshot";
	img.loading = "lazy";
	img.decoding = "async";
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
		article.appendChild(createScreenshot(project));
	} else {
		article.appendChild(createPlaceholder(project));
	}

	const title = appendTextElement(article, "h3", "", project.title);
	title.id = titleId;

	if (project.tagline) {
		appendTextElement(article, "p", "project-tagline", project.tagline);
	}

	appendTextElement(article, "p", "project-description", project.description);

	if (project.subtext) {
		project.subtext.forEach((text) => {
			appendTextElement(article, "p", "project-subtext", text);
		});
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
