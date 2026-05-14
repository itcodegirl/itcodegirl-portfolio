import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteOrigin = 'https://itcodegirl.com';
const args = new Set(process.argv.slice(2));
const runLiveChecks = args.has('--live');
const timeoutArg = process.argv.find((arg) => arg.startsWith('--timeout='));
const timeoutMs = timeoutArg ? Number(timeoutArg.split('=')[1]) : 10000;
const failures = [];
const warnings = [];

function normalizePath(relativePath) {
	return relativePath.replace(/\\/g, '/').replace(/^\.\//, '');
}

function listFiles(relativeDir = '.') {
	return fs.readdirSync(path.join(rootDir, relativeDir), { withFileTypes: true }).flatMap((entry) => {
		if (entry.name === '.git') return [];

		const relativePath = normalizePath(path.join(relativeDir, entry.name));
		if (entry.isDirectory()) return listFiles(relativePath);

		return [relativePath];
	});
}

function readFile(relativePath) {
	return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function getAttributes(tag) {
	return Object.fromEntries(
		Array.from(tag.matchAll(/\s([a-zA-Z:-]+)(?:=(["'])(.*?)\2)?/g), ([, name,, value = '']) => [
			name.toLowerCase(),
			value,
		]),
	);
}

function getRelTokens(attrs) {
	return (attrs.rel || '').trim().split(/\s+/).filter(Boolean);
}

function pageUrl(relativePath) {
	if (relativePath === 'index.html') return `${siteOrigin}/`;
	if (relativePath.endsWith('/index.html')) {
		return `${siteOrigin}/${relativePath.replace(/index\.html$/, '')}`;
	}

	return `${siteOrigin}/${relativePath}`;
}

function isIgnoredReference(reference) {
	return (
		!reference ||
		reference.startsWith('#') ||
		reference.startsWith('mailto:') ||
		reference.startsWith('tel:') ||
		reference.startsWith('sms:') ||
		reference.startsWith('data:') ||
		reference.startsWith('javascript:')
	);
}

function toExternalUrl(reference, baseFile) {
	if (isIgnoredReference(reference)) return null;

	try {
		const url = new URL(reference, pageUrl(baseFile));
		if (!/^https?:$/i.test(url.protocol)) return null;
		if (url.origin === siteOrigin) return null;
		return url.href;
	} catch {
		return null;
	}
}

function addExternalUrl(urls, reference, sourceFile, context) {
	const url = toExternalUrl(reference, sourceFile);
	if (!url) return;

	const existing = urls.get(url);
	if (existing) {
		existing.sources.push(`${sourceFile} ${context}`);
		return;
	}

	urls.set(url, {
		url,
		sources: [`${sourceFile} ${context}`],
	});
}

function collectHtmlUrls(urls) {
	listFiles()
		.filter((relativePath) => relativePath.endsWith('.html'))
		.forEach((sourceFile) => {
			const html = readFile(sourceFile);

			Array.from(html.matchAll(/<([a-z][a-z0-9:-]*)\b[^>]*>/gi), ([tag, tagName]) => {
				const attrs = getAttributes(tag);
				const relTokens = getRelTokens(attrs);

				if (tagName.toLowerCase() === 'link' && relTokens.includes('preconnect')) return;

				['href', 'src', 'poster'].forEach((attrName) => {
					if (attrs[attrName]) addExternalUrl(urls, attrs[attrName], sourceFile, attrName);
				});

				if (attrs.action) addExternalUrl(urls, attrs.action, sourceFile, 'form action');
				if (!attrs.srcset) return;

				attrs.srcset.split(',').forEach((candidate) => {
					addExternalUrl(urls, candidate.trim().split(/\s+/)[0], sourceFile, 'srcset');
				});
			});
		});
}

function collectCssUrls(urls) {
	listFiles('css')
		.concat(listFiles('notes').filter((relativePath) => relativePath.endsWith('.css')))
		.concat(listFiles('work').filter((relativePath) => relativePath.endsWith('.css')))
		.filter((relativePath) => relativePath.endsWith('.css'))
		.forEach((sourceFile) => {
			Array.from(readFile(sourceFile).matchAll(/url\((["']?)(.*?)\1\)/gi), ([, , reference]) => {
				addExternalUrl(urls, reference, sourceFile, 'CSS url()');
			});
		});
}

function collectProjectDataUrls(urls) {
	const sourceFile = 'js/projects.js';
	const projectsJs = readFile(sourceFile);

	Array.from(projectsJs.matchAll(/\burl:\s*["']([^"']+)["']/g), ([, reference]) => {
		addExternalUrl(urls, reference, sourceFile, 'project link');
	});
}

async function fetchWithTimeout(url, method) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);

	try {
		return await fetch(url, {
			method,
			redirect: 'follow',
			signal: controller.signal,
			headers: {
				'user-agent': 'itcodegirl-portfolio-link-check/1.0',
			},
		});
	} finally {
		clearTimeout(timeout);
	}
}

async function checkUrl({ url, sources }) {
	const hostname = new URL(url).hostname;

	try {
		let response = await fetchWithTimeout(url, 'HEAD');

		if (response.status === 405 || response.status === 403) {
			response = await fetchWithTimeout(url, 'GET');
		}

		if (response.status >= 400) {
			if (hostname === 'www.linkedin.com' && response.status === 999) {
				warnings.push(`${url} returned LinkedIn anti-bot status 999; manual browser verification recommended.`);
				return;
			}

			failures.push(`${url} returned ${response.status}. Sources: ${sources.join('; ')}`);
		}
	} catch (error) {
		failures.push(`${url} failed live check: ${error.message}. Sources: ${sources.join('; ')}`);
	}
}

const urls = new Map();
collectHtmlUrls(urls);
collectCssUrls(urls);
collectProjectDataUrls(urls);

const sortedUrls = Array.from(urls.values()).sort((a, b) => a.url.localeCompare(b.url));
console.log(`Found ${sortedUrls.length} external URL(s).`);

if (!runLiveChecks) {
	sortedUrls.forEach(({ url }) => console.log(`- ${url}`));
	console.log('Live checks skipped. Run with --live to verify response status.');
	process.exit(0);
}

await Promise.all(sortedUrls.map(checkUrl));

warnings.forEach((warning) => console.warn(`Warning: ${warning}`));

if (failures.length) {
	console.error('External URL health check failed:');
	failures.forEach((failure) => console.error(`- ${failure}`));
	process.exit(1);
}

console.log('External URL health check passed.');
