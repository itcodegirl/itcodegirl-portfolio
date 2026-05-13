import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const pageFiles = [
	'index.html',
	'404.html',
	'notes/index.html',
	'notes/site-performance.html',
	'notes/why-vanilla.html',
	'work/index.html',
	'work/aura-weather/index.html',
	'work/ceo-os/index.html',
	'work/codeherway/index.html',
];

const canonicalPages = [
	'index.html',
	'notes/index.html',
	'notes/site-performance.html',
	'notes/why-vanilla.html',
	'work/index.html',
	'work/aura-weather/index.html',
	'work/ceo-os/index.html',
	'work/codeherway/index.html',
];

const cssFiles = [
	'css/styles.css',
	'css/hero.css',
	'css/projects.css',
	'notes/notes.css',
	'work/work.css',
];

const jsFiles = [
	'js/app.js',
	'js/projects.js',
];

const assetBudgets = [
	{
		label: 'image asset',
		match: /\.(avif|jpe?g|png|webp)$/i,
		maxKb: 220,
	},
	{
		label: 'resume PDF',
		match: /\.pdf$/i,
		maxKb: 650,
	},
	{
		label: 'SVG icon',
		match: /\.svg$/i,
		maxKb: 20,
	},
];

const fileBudgets = [
	{
		label: 'total JavaScript',
		files: jsFiles,
		maxKb: 40,
	},
	{
		label: 'total CSS',
		files: cssFiles,
		maxKb: 80,
	},
	{
		label: 'homepage HTML',
		files: ['index.html'],
		maxKb: 18,
	},
];

const failures = [];

function readFile(relativePath) {
	return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function fileSizeKb(relativePath) {
	return fs.statSync(path.join(rootDir, relativePath)).size / 1024;
}

function assert(condition, message) {
	if (!condition) failures.push(message);
}

function listFiles(relativeDir) {
	const absoluteDir = path.join(rootDir, relativeDir);
	if (!fs.existsSync(absoluteDir)) return [];

	return fs.readdirSync(absoluteDir, { withFileTypes: true }).flatMap((entry) => {
		const relativePath = path.join(relativeDir, entry.name);

		if (entry.isDirectory()) {
			return listFiles(relativePath);
		}

		return [relativePath];
	});
}

function getAttributes(tag) {
	return Object.fromEntries(
		Array.from(tag.matchAll(/\s([a-zA-Z:-]+)(?:=(["'])(.*?)\2)?/g), ([, name,, value = '']) => [
			name.toLowerCase(),
			value,
		]),
	);
}

function checkRequiredFiles() {
	[...pageFiles, ...cssFiles, ...jsFiles].forEach((relativePath) => {
		assert(fs.existsSync(path.join(rootDir, relativePath)), `${relativePath} is missing.`);
	});
}

function checkBudgets() {
	fileBudgets.forEach(({ label, files, maxKb }) => {
		const totalKb = files.reduce((sum, relativePath) => sum + fileSizeKb(relativePath), 0);
		assert(totalKb <= maxKb, `${label} is ${totalKb.toFixed(1)} kB, over ${maxKb} kB budget.`);
	});

	listFiles('assets').forEach((relativePath) => {
		const budget = assetBudgets.find(({ match }) => match.test(relativePath));
		if (!budget) return;

		const sizeKb = fileSizeKb(relativePath);
		assert(
			sizeKb <= budget.maxKb,
			`${relativePath} is ${sizeKb.toFixed(1)} kB, over ${budget.maxKb} kB ${budget.label} budget.`,
		);
	});
}

function checkScriptLoading() {
	pageFiles.forEach((relativePath) => {
		const html = readFile(relativePath);
		const remoteScripts = Array.from(
			html.matchAll(/<script\b[^>]*\bsrc=["'](https?:\/\/[^"']+)["'][^>]*>/gi),
			(match) => match[1],
		);

		assert(
			remoteScripts.length === 0,
			`${relativePath} loads remote scripts directly: ${remoteScripts.join(', ')}. Keep motion libraries lazy.`,
		);
	});

	const appJs = readFile('js/app.js');
	assert(appJs.includes('requestAnimationFrame(onScrollFrame)'), 'Scroll updates must stay requestAnimationFrame-batched.');
	assert(appJs.includes('{ passive: true }'), 'Scroll listener should stay passive.');
	assert(appJs.includes('prefersReducedMotion'), 'Motion effects must honor prefers-reduced-motion.');
	assert(appJs.includes('hasSaveDataPreference'), 'Heavy motion effects must honor Save-Data.');
	assert(appJs.includes('shouldRunWebGLPortrait'), 'WebGL portrait must stay behind capability/preference checks.');
}

function checkImages() {
	pageFiles.forEach((relativePath) => {
		const html = readFile(relativePath);

		Array.from(html.matchAll(/<img\b[^>]*>/gi), ([tag]) => {
			const attrs = getAttributes(tag);
			const src = attrs.src || '(missing src)';

			assert(Boolean(attrs.width), `${relativePath} image ${src} is missing width.`);
			assert(Boolean(attrs.height), `${relativePath} image ${src} is missing height.`);
			assert(attrs.decoding === 'async', `${relativePath} image ${src} should use decoding="async".`);

			const isPriorityImage = attrs.fetchpriority === 'high' || attrs.loading === 'eager';

			if (!tag.includes('hero-portrait') && !src.includes('headshot') && !isPriorityImage) {
				assert(attrs.loading === 'lazy', `${relativePath} image ${src} should lazy-load.`);
			}
		});
	});

	const homeHtml = readFile('index.html');
	assert(homeHtml.includes('fetchpriority="high"'), 'Hero portrait should keep fetchpriority="high".');
	assert(homeHtml.includes('type="image/avif"'), 'Hero portrait should offer AVIF source.');
	assert(homeHtml.includes('srcset="assets/images/Jenna_robot_420.webp'), 'Hero portrait should keep responsive WebP source.');
}

function checkContactAccessibility() {
	const homeHtml = readFile('index.html');
	const styles = readFile('css/styles.css');
	const appJs = readFile('js/app.js');

	['contactName', 'contactEmail', 'contactMessage'].forEach((fieldId) => {
		assert(homeHtml.includes(`${fieldId}Error`), `${fieldId} should reference a field-specific error message.`);
	});

	assert(homeHtml.includes('aria-live="polite"'), 'Contact errors/status should announce politely.');
	assert(styles.includes('.field-error'), 'Contact field errors need visible styling.');
	assert(styles.includes('[aria-invalid="true"]'), 'Invalid fields need an explicit visual state.');
	assert(appJs.includes('validateContactFields'), 'Contact form should validate fields before submitting.');
}

function checkNavigationStructure() {
	canonicalPages.forEach((relativePath) => {
		const html = readFile(relativePath);

		assert(
			html.includes('<header class="site-header nav-show">'),
			`${relativePath} should use the shared fixed navigation wrapper.`,
		);
		assert(
			html.includes('<nav class="nav" aria-label="Primary navigation">'),
			`${relativePath} should keep primary navigation labelled on the inner nav element.`,
		);
	});
}

function getCanonicalUrl(relativePath) {
	if (relativePath === 'index.html') return 'https://itcodegirl.com/';
	if (relativePath.endsWith('/index.html')) {
		return `https://itcodegirl.com/${relativePath.replace(/index\.html$/, '')}`;
	}

	return `https://itcodegirl.com/${relativePath}`;
}

function checkDiscoveryMetadata() {
	assert(fs.existsSync(path.join(rootDir, 'robots.txt')), 'robots.txt is missing.');
	assert(fs.existsSync(path.join(rootDir, 'sitemap.xml')), 'sitemap.xml is missing.');

	const robots = readFile('robots.txt');
	const sitemap = readFile('sitemap.xml');

	assert(
		robots.includes('Sitemap: https://itcodegirl.com/sitemap.xml'),
		'robots.txt should point crawlers to the sitemap.',
	);

	canonicalPages.forEach((relativePath) => {
		const canonicalUrl = getCanonicalUrl(relativePath);
		const html = readFile(relativePath);

		assert(
			html.includes(`<link rel="canonical" href="${canonicalUrl}">`),
			`${relativePath} should include canonical URL ${canonicalUrl}.`,
		);
		assert(sitemap.includes(`<loc>${canonicalUrl}</loc>`), `sitemap.xml should include ${canonicalUrl}.`);
	});
}

function checkEvidenceFramework() {
	const homeHtml = readFile('index.html');
	const codeHerWayHtml = readFile('work/codeherway/index.html');
	const readme = readFile('README.md');
	const evidenceReadmePath = path.join(rootDir, 'assets/evidence/README.md');

	assert(homeHtml.includes('Evidence, Not Just Claims'), 'Homepage should include Evidence, Not Just Claims section.');
	assert(homeHtml.includes('90-Second Review Path'), 'Homepage should include 90-Second Review Path section.');
	assert(codeHerWayHtml.includes('Evidence Snapshot'), 'CodeHerWay case study should include Evidence Snapshot.');
	assert(
		codeHerWayHtml.includes('What to verify in 90 seconds'),
		'CodeHerWay case study should include what to verify in 90 seconds.',
	);
	assert(readme.includes('Evidence Layer'), 'README should include Evidence Layer section.');
	assert(readme.includes('Evidence Capture Checklist'), 'README should include Evidence Capture Checklist section.');
	assert(fs.existsSync(evidenceReadmePath), 'assets/evidence/README.md is missing.');
}

checkRequiredFiles();
checkBudgets();
checkScriptLoading();
checkImages();
checkContactAccessibility();
checkNavigationStructure();
checkDiscoveryMetadata();
checkEvidenceFramework();

if (failures.length) {
	console.error('Static site quality check failed:');
	failures.forEach((failure) => console.error(`- ${failure}`));
	process.exit(1);
}

console.log('Static site quality check passed.');
