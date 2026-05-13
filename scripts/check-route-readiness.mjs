import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

const pages = [
	{ file: 'index.html', canonical: 'https://itcodegirl.com/', type: 'home' },
	{ file: 'notes/index.html', canonical: 'https://itcodegirl.com/notes/', type: 'notes-index' },
	{ file: 'notes/site-performance.html', canonical: 'https://itcodegirl.com/notes/site-performance.html', type: 'note' },
	{ file: 'notes/why-vanilla.html', canonical: 'https://itcodegirl.com/notes/why-vanilla.html', type: 'note' },
	{ file: 'work/index.html', canonical: 'https://itcodegirl.com/work/', type: 'work-index' },
	{ file: 'work/aura-weather/index.html', canonical: 'https://itcodegirl.com/work/aura-weather/', type: 'case-study' },
	{ file: 'work/ceo-os/index.html', canonical: 'https://itcodegirl.com/work/ceo-os/', type: 'case-study' },
	{ file: 'work/codeherway/index.html', canonical: 'https://itcodegirl.com/work/codeherway/', type: 'case-study' },
];

function readFile(relativePath) {
	return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function assert(condition, message) {
	if (!condition) failures.push(message);
}

function countMatches(value, pattern) {
	return Array.from(value.matchAll(pattern)).length;
}

function getAttributes(tag) {
	return Object.fromEntries(
		Array.from(tag.matchAll(/\s([a-zA-Z:-]+)(?:=(["'])(.*?)\2)?/g), ([, name,, value = '']) => [
			name.toLowerCase(),
			value,
		]),
	);
}

function textFromTag(tag) {
	return tag
		.replace(/<script\b[\s\S]*?<\/script>/gi, '')
		.replace(/<style\b[\s\S]*?<\/style>/gi, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&rarr;|&#8594;/g, 'right')
		.replace(/&larr;|&#8592;/g, 'left')
		.replace(/\s+/g, ' ')
		.trim();
}

function normalizedText(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function checkDuplicateIds(file, html) {
	const ids = Array.from(html.matchAll(/\sid=(["'])(.*?)\1/g), ([, , id]) => id);
	const seen = new Set();
	const duplicates = new Set();

	ids.forEach((id) => {
		if (seen.has(id)) duplicates.add(id);
		seen.add(id);
	});

	assert(duplicates.size === 0, `${file} has duplicate id values: ${Array.from(duplicates).join(', ')}.`);
}

function checkAccessibleLinkNames(file, html) {
	Array.from(html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi), ([tag]) => {
		const openingTag = tag.match(/<a\b[^>]*>/i)?.[0] || '';
		const attrs = getAttributes(openingTag);
		if (!attrs['aria-label']) return;

		const visibleText = normalizedText(textFromTag(tag));
		const ariaLabel = normalizedText(attrs['aria-label']);
		if (!visibleText) return;

		assert(
			ariaLabel.includes(visibleText) || visibleText.includes(ariaLabel),
			`${file} link text "${visibleText}" should be included in aria-label "${ariaLabel}".`,
		);
	});
}

function checkCommonPage(page) {
	const html = readFile(page.file);
	const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1] || '';

	assert(html.includes('<meta name="viewport"'), `${page.file} should include a viewport meta tag.`);
	assert(html.includes('viewport-fit=cover'), `${page.file} should preserve viewport-fit=cover for mobile safe areas.`);
	assert(description.length >= 60, `${page.file} should include a useful meta description.`);
	assert(html.includes(`<link rel="canonical" href="${page.canonical}">`), `${page.file} should include canonical URL ${page.canonical}.`);
	assert(countMatches(html, /<h1\b/gi) === 1, `${page.file} should have exactly one h1.`);
	assert(html.includes('class="skip-link" href="#main-content"'), `${page.file} should keep the skip link wired to main content.`);
	assert(html.includes('<main id="main-content"'), `${page.file} should keep main id="main-content".`);
	assert(html.includes('<nav class="nav" aria-label="Primary navigation">'), `${page.file} should keep labelled primary navigation.`);
	assert(html.includes('aria-label="Footer navigation"'), `${page.file} should keep labelled footer navigation.`);
	assert(!html.includes('<section class="section-card"'), `${page.file} should avoid floating section-card page wrappers.`);

	checkDuplicateIds(page.file, html);
	checkAccessibleLinkNames(page.file, html);

	return html;
}

function checkHome(html) {
	assert(html.includes('id="projectsGrid"'), 'index.html should keep the selected work mount point.');
	assert(html.includes('id="contactForm"'), 'index.html should keep the contact form.');
	assert(html.includes('fetchpriority="high"'), 'index.html should keep the hero image prioritized.');
}

function checkWorkIndex(html) {
	['/work/codeherway/', '/work/ceo-os/', '/work/aura-weather/'].forEach((href) => {
		assert(html.includes(`href="${href}"`), `work/index.html should link to ${href}.`);
	});

	assert(countMatches(html, /class="[^"]*\bwork-card\b/g) >= 3, 'work/index.html should keep at least three case-study cards.');
}

function checkCaseStudy(file, html) {
	const normalizedHtml = normalizedText(html);

	['Problem', 'Key UX Decisions', 'Accessibility Considerations', 'Performance Considerations', 'What I Would Improve Next'].forEach((sectionLabel) => {
		assert(normalizedHtml.includes(normalizedText(sectionLabel)), `${file} should keep the ${sectionLabel} section.`);
	});

	assert(html.includes('class="case-study-nav"'), `${file} should keep case-study cross-navigation.`);
	assert(html.includes('class="case-link case-link--primary"'), `${file} should keep the primary project link.`);
	assert(html.includes('<time datetime="2026-05-12">'), `${file} should keep review-date evidence.`);
}

pages.forEach((page) => {
	const html = checkCommonPage(page);

	if (page.type === 'home') checkHome(html);
	if (page.type === 'work-index') checkWorkIndex(html);
	if (page.type === 'case-study') checkCaseStudy(page.file, html);
});

if (failures.length) {
	console.error('Route readiness check failed:');
	failures.forEach((failure) => console.error(`- ${failure}`));
	process.exit(1);
}

console.log('Route readiness check passed.');
