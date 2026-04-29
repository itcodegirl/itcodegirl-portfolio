const projectsGrid = document.getElementById("projectsGrid");

if (projectsGrid && projectsGrid.children.length === 0) {
	projectsGrid.innerHTML = `
		<div class="project-card project-card-featured">
	<div class="project-header">
		<span class="project-number">01</span>
		<span class="project-status">Featured Case Study</span>
	</div>

	<h3>CodeHerWay Education Platform</h3>

<p class="project-description">
	A frontend-focused learning platform built with React and Supabase, featuring structured lessons, quizzes, and progress tracking.
</p>

<p class="project-subtext">
	Designed to simulate a real-world learning experience with guided progression and user feedback systems. 
	Includes authentication, progress tracking, and reward-based feedback systems to mimic real product behavior.
</p>
</p>

	<div class="case-study-preview">
		<div>
			<span class="case-label">Problem</span>
			<p>Beginners often struggle with scattered resources and unclear progress.</p>
		</div>

		<div>
			<span class="case-label">Solution</span>
			<p>Built a guided learning experience with lessons, quizzes, XP, streaks, and progress feedback.</p>
		</div>

		<div>
			<span class="case-label">Impact</span>
			<p>Demonstrates scalable frontend architecture, backend integration, and strong UX design decisions.</p>
		</div>
	</div>

	<div class="project-tech">
		<span>React</span><span>Supabase</span><span>PostgreSQL</span><span>JavaScript</span><span>Vite</span>
	</div>

	<div class="project-links">
	<a href="https://codeherway-education-platform.netlify.app/" target="_blank" rel="noreferrer" class="project-link-btn">Live Demo</a>
<a href="https://codeherway-reward-engine-case-study.netlify.app/" target="_blank" rel="noreferrer" class="project-link-btn">Case Study</a>
<a href="https://github.com/itcodegirl/education_platform" target="_blank" rel="noreferrer" class="project-link-github">View Code →</a>
		</div>
</div>

		<div class="project-card">
			<div class="project-header"><span class="project-number">02</span></div>
			<h3>Aura Weather</h3>
			<p class="project-description">
				<p class="project-description">
	A responsive weather app built with real-time API data, featuring current conditions, hourly forecasts, and location-based weather insights.
</p>

<p class="project-subtext">
	Focused on performance, clean UI architecture, and presenting dynamic data in a clear and accessible way. Includes polished loading states and responsive layouts to ensure a smooth user experience across devices.
</p>
			<div class="project-tech"><span>JavaScript</span><span>API</span><span>CSS</span></div>
			<div class="project-links">
				<a href="https://aura-weather-platform.netlify.app/" target="_blank" rel="noreferrer" class="project-link-btn">Live Demo</a>
				<a href="https://github.com/itcodegirl/aura-weather" target="_blank" rel="noreferrer" class="project-link-github">View Code →</a>
			</div>
		</div>

		<div class="project-card">
			<div class="project-header"><span class="project-number">03</span></div>
			<h3>CodeHerWay CEO OS (Founder Dashboard)</h3>

<p class="project-description">
	A productivity and decision-support dashboard designed to help founders organize priorities, track opportunities, plan content, and review weekly progress.
</p>

<p class="project-subtext">
	Built with a focus on reducing cognitive load and improving clarity in day-to-day decision making.
</p>
<p class="project-subtext">
	Includes opportunity tracking, weekly planning, and a central workspace for managing priorities and decisions.
</p>
			<div class="project-tech"><span>React</span><span>ReactRouter</span><span>Local Storage</span><span>UX Systems</span></div>
			<div class="project-links">
			<a class="project-link-btn" href="https://codeherway-ceo-os-case-study.netlify.app/" target="_blank">
	Case Study
</a>
				<a href="https://codeherway-ceo-os.netlify.app/" target="_blank" rel="noreferrer" class="project-link-btn">Live Demo</a>
				<a href="https://github.com/itcodegirl/codeherway-ceo-os" target="_blank" rel="noreferrer" class="project-link-github">View Code →</a>
			</div>
		</div>

		<div class="project-card">
			<div class="project-header"><span class="project-number">04</span></div>
			<h3>Personal Portfolio</h3>
			<p class="project-description">
				A cinematic portfolio built with responsive layout, animation, accessibility,
				and performance-focused frontend structure.
			</p>
			<div class="project-tech"><span>HTML</span><span>CSS</span><span>JavaScript</span></div>
			<div class="project-links">
				<a href="https://itcodegirl.github.io/itcodegirl-portfolio/" target="_blank" rel="noreferrer" class="project-link-btn">Live Demo</a>
				<a href="https://github.com/itcodegirl/itcodegirl-portfolio" target="_blank" rel="noreferrer" class="project-link-github">View Code →</a>
			</div>
		</div>
	`;
}
