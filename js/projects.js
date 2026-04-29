const projects = [
	{
		id: "codeherway",
		number: "01",
		title: "CodeHerWay Education Platform",
		status: "Featured Case Study",
		featured: true,
		meta: "React | Supabase | Learning Platform",
		description:
			"A frontend-focused learning platform built with React and Supabase, featuring structured lessons, quizzes, progress tracking, and a clean, beginner-friendly learning experience.",
		subtext: [
			"Designed to simulate a real-world learning experience with guided progression and user feedback systems.",
			"Includes authentication, progress tracking, and reward-based feedback systems to mimic real product behavior.",
		],
		highlights: [
			{
				label: "Problem",
				text: "Beginners often struggle with scattered resources and unclear progress.",
			},
			{
				label: "Solution",
				text: "Built a guided learning experience with lessons, quizzes, XP, streaks, and progress feedback.",
			},
			{
				label: "Impact",
				text: "Demonstrates scalable frontend architecture, backend integration, and strong UX design decisions.",
			},
		],
		tech: ["React", "Supabase", "PostgreSQL", "JavaScript", "Vite"],
		links: [
			{
				label: "Live Demo",
				url: "https://codeherway-education-platform.netlify.app/",
				style: "primary",
				ariaLabel: "View the CodeHerWay Education Platform live demo",
			},
			{
				label: "Case Study",
				url: "https://codeherway-reward-engine-case-study.netlify.app/",
				style: "primary",
				ariaLabel: "View the CodeHerWay Education Platform case study",
			},
			{
				label: "View Code",
				url: "https://github.com/itcodegirl/education_platform",
				style: "github",
				ariaLabel: "View the CodeHerWay Education Platform GitHub repository",
			},
		],
	},
	{
		id: "aura",
		number: "02",
		title: "Aura Weather",
		description:
			"A responsive weather app built with real-time API data, featuring current conditions, hourly forecasts, and location-based weather insights.",
		subtext: [
			"Focused on performance, clean UI architecture, and presenting dynamic data in a clear and accessible way.",
			"Includes polished loading states and responsive layouts to ensure a smooth user experience across devices.",
		],
		tech: ["JavaScript", "API", "CSS"],
		links: [
			{
				label: "Live Demo",
				url: "https://aura-weather-platform.netlify.app/",
				style: "primary",
				ariaLabel: "View Aura Weather live demo",
			},
			{
				label: "View Code",
				url: "https://github.com/itcodegirl/aura-weather",
				style: "github",
				ariaLabel: "View the Aura Weather GitHub repository",
			},
		],
	},
	{
		id: "ceo",
		number: "03",
		title: "CodeHerWay CEO OS (Founder Dashboard)",
		cardClass: "ceo-os",
		description:
			"A React productivity dashboard designed to help founders manage priorities, opportunities, content planning, and weekly execution.",
		subtext: [
			"Built with a focus on reducing cognitive load and improving clarity in day-to-day decision making.",
			"Includes opportunity tracking, weekly planning, and a central workspace for managing priorities and decisions.",
		],
		tech: ["React", "React Router", "Local Storage", "UX Systems"],
		links: [
			{
				label: "Case Study",
				url: "https://codeherway-ceo-os-case-study.netlify.app/",
				style: "primary",
				ariaLabel: "View the CodeHerWay CEO OS case study",
			},
			{
				label: "Live Demo",
				url: "https://codeherway-ceo-os.netlify.app/",
				style: "primary",
				ariaLabel: "View CodeHerWay CEO OS live demo",
			},
			{
				label: "View Code",
				url: "https://github.com/itcodegirl/codeherway-ceo-os",
				style: "github",
				ariaLabel: "View the CodeHerWay CEO OS GitHub repository",
			},
		],
	},
	{
		id: "portfolio",
		number: "04",
		title: "Personal Portfolio",
		description:
			"A cinematic portfolio built with responsive layout, animation, accessibility, and performance-focused frontend structure.",
		tech: ["HTML", "CSS", "JavaScript"],
		links: [
			{
				label: "Live Demo",
				url: "https://itcodegirl.github.io/itcodegirl-portfolio/",
				style: "primary",
				ariaLabel: "View the personal portfolio live demo",
			},
			{
				label: "View Code",
				url: "https://github.com/itcodegirl/itcodegirl-portfolio",
				style: "github",
				ariaLabel: "View the personal portfolio GitHub repository",
			},
		],
	},
];

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

function createProjectLinks(links) {
	const linksContainer = document.createElement("div");
	linksContainer.className = "project-links";

	links.forEach((link) => {
		const anchor = document.createElement("a");
		anchor.href = link.url;
		anchor.target = "_blank";
		anchor.rel = "noopener noreferrer";
		anchor.className = link.style === "github" ? "project-link-github" : "project-link-btn";
		anchor.setAttribute("aria-label", link.ariaLabel);
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

function createProjectCard(project) {
	const article = document.createElement("article");
	const titleId = `project-${project.id}-title`;

	article.className = [
		"project-card",
		project.featured ? "project-card-featured" : "",
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

	const title = appendTextElement(article, "h3", "", project.title);
	title.id = titleId;

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
