const projectsGrid = document.getElementById("projectsGrid");

if (projectsGrid) {
	projectsGrid.innerHTML = `
		<div class="project-card">
			<div class="project-header">
				<span class="project-number">01</span>
				<span class="project-status">Featured Project</span>
			</div>
			<h3>CodeHerWay Education Platform</h3>
			<p class="project-description">
				A full-stack learning platform with structured frontend lessons, quizzes,
				progress tracking, and backend-driven rewards.
			</p>
			<div class="project-tech">
				<span>React</span><span>Supabase</span><span>PostgreSQL</span><span>JavaScript</span><span>Vite</span>
			</div>
			<div class="project-links">
				<a href="https://codeherway-education-platform.netlify.app/" target="_blank" rel="noreferrer" class="project-link-btn">View Platform</a>
				<a href="https://codeherway-reward-engine-case-study.netlify.app/" target="_blank" rel="noreferrer" class="project-link-btn secondary">View Case Study</a>
				<a href="https://github.com/itcodegirl/education_platform" target="_blank" rel="noreferrer" class="project-link-github">GitHub →</a>
			</div>
		</div>

		<div class="project-card">
			<div class="project-header"><span class="project-number">02</span></div>
			<h3>Aura Weather</h3>
			<p class="project-description">
				A responsive weather app with real-time API data, polished loading states,
				and clean forecast UI.
			</p>
			<div class="project-tech"><span>JavaScript</span><span>API</span><span>CSS</span></div>
			<div class="project-links">
				<a href="https://aura-weather-platform.netlify.app/" target="_blank" rel="noreferrer" class="project-link-btn">View Live</a>
				<a href="https://github.com/itcodegirl/aura-weather" target="_blank" rel="noreferrer" class="project-link-github">GitHub →</a>
			</div>
		</div>

		<div class="project-card">
			<div class="project-header"><span class="project-number">03</span></div>
			<h3>CodeHerWay CEO OS</h3>
			<p class="project-description">
				A React productivity dashboard for priorities, opportunities, content planning,
				and weekly execution.
			</p>
			<div class="project-tech"><span>React</span><span>Router</span><span>Local Storage</span></div>
			<div class="project-links">
				<a href="https://codeherway-ceo-os.netlify.app/" target="_blank" rel="noreferrer" class="project-link-btn">View Live</a>
				<a href="https://github.com/itcodegirl/codeherway-ceo-os" target="_blank" rel="noreferrer" class="project-link-github">GitHub →</a>
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
				<a href="https://itcodegirl.github.io/itcodegirl-portfolio/" target="_blank" rel="noreferrer" class="project-link-btn">View Live</a>
				<a href="https://github.com/itcodegirl/itcodegirl-portfolio" target="_blank" rel="noreferrer" class="project-link-github">GitHub →</a>
			</div>
		</div>
	`;
}