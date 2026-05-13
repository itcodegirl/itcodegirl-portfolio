import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteOrigin = 'https://itcodegirl.com';
const failures = [];

function normalizePath(relativePath) {
	return relativePath.replace(/\\/g, '/').replace(/^\.\//, '');
}

function listFiles(relativeDir = '.') {
	const absoluteDir = path.join(rootDir, relativeDir);

	return fs.readdirSync(absoluteDir, { withFileTypes: true }).flatMap((entry) => {
		if (entry.name === '.git') return [];

		const relativePath = normalizePath(path.join(relativeDir, entry.name));

		if (entry.isDirectory()) {
			return listFiles(relativePath);
		}

		return [relativePath];
	});
}

function readFile(relativePath) {
	return fs.readFileSync(path.join(rootDir, relativePath), 'utf8');
}

function assert(condition, message) {
	if (!condition) failures.push(message);
}

function pageUrl(relativePath) {
	if (relativePath === 'index.html') return `${siteOrigin}/`;
	if (relativePath.endsWith('/index.html')) {
		return `${siteOrigin}/${relativePath.replace(/index\.html$/, '')}`;
	}

	return `${siteOrigin}/${relativePath}`;
}

function sitePathToFile(pathname) {
	const cleanPath = decodeURIComponent(pathname).replace(/^\/+/, '');

	if (!cleanPath) return 'index.html';
	if (cleanPath.endsWith('/')) return `${cleanPath}index.html`;

	const directPath = cleanPath;
	const indexPath = `${cleanPath}/index.html`;

	if (fs.existsSync(path.join(rootDir, directPath))) return directPath;
	if (fs.existsSync(path.join(rootDir, indexPath))) return indexPath;

	return directPath;
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

function isInternalUrl(url) {
	return url.origin === siteOrigin;
}

function getAttributes(tag) {
	return Object.fromEntries(
		Array.from(tag.matchAll(/\s([a-zA-Z:-]+)(?:=(["'])(.*?)\2)?/g), ([, name,, value = '']) => [
			name.toLowerCase(),
			value,
		]),
	);
}

function isExternalHttpReference(reference, baseFile) {
	if (isIgnoredReference(reference)) return false;

	try {
		const url = new URL(reference, pageUrl(baseFile));
		return /^https?:$/i.test(url.protocol) && !isInternalUrl(url);
	} catch {
		return false;
	}
}

function hasFragmentTarget(relativePath, fragment) {
	if (!fragment) return true;
	if (!relativePath.endsWith('.html')) return true;

	const decodedFragment = decodeURIComponent(fragment);
	const html = readFile(relativePath);
	const quoted = decodedFragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const targetPattern = new RegExp(`\\s(?:id|name)=["']${quoted}["']`, 'i');

	return targetPattern.test(html);
}

function checkResolvedReference({ reference, sourceFile, baseFile = sourceFile, context }) {
	if (isIgnoredReference(reference)) return;

	let url;
	try {
		url = new URL(reference, pageUrl(baseFile));
	} catch {
		failures.push(`${sourceFile} has an invalid ${context}: ${reference}`);
		return;
	}

	if (!isInternalUrl(url)) return;

	const relativePath = sitePathToFile(url.pathname);
	const absolutePath = path.join(rootDir, relativePath);

	assert(
		fs.existsSync(absolutePath),
		`${sourceFile} ${context} points to missing internal path: ${reference} -> ${relativePath}`,
	);

	if (fs.existsSync(absolutePath)) {
		assert(
			hasFragmentTarget(relativePath, url.hash.slice(1)),
			`${sourceFile} ${context} points to missing fragment ${url.hash} in ${relativePath}.`,
		);
	}
}

function getAttributeReferences(html) {
	const references = [];

	Array.from(html.matchAll(/\s(?:href|src|poster)=["']([^"']+)["']/gi), ([, reference]) => {
		references.push({ reference, context: 'attribute reference' });
	});

	Array.from(html.matchAll(/\ssrcset=["']([^"']+)["']/gi), ([, srcset]) => {
		srcset.split(',').forEach((candidate) => {
			const reference = candidate.trim().split(/\s+/)[0];
			references.push({ reference, context: 'srcset reference' });
		});
	});

	return references;
}

function checkHtmlReferences() {
	listFiles()
		.filter((relativePath) => relativePath.endsWith('.html'))
		.forEach((sourceFile) => {
			const html = readFile(sourceFile);

			getAttributeReferences(html).forEach(({ reference, context }) => {
				checkResolvedReference({ reference, sourceFile, context });
			});

			Array.from(html.matchAll(/<a\b[^>]*>/gi), ([tag]) => {
				const attrs = getAttributes(tag);
				if (!isExternalHttpReference(attrs.href, sourceFile) || attrs.target !== '_blank') return;

				const relTokens = attrs.rel.split(/\s+/);
				assert(
					relTokens.includes('noopener') && relTokens.includes('noreferrer'),
					`${sourceFile} external link ${attrs.href} should use rel="noopener noreferrer".`,
				);
			});
		});
}

function checkCssReferences() {
	listFiles('css')
		.concat(listFiles('notes').filter((relativePath) => relativePath.endsWith('.css')))
		.concat(listFiles('work').filter((relativePath) => relativePath.endsWith('.css')))
		.filter((relativePath) => relativePath.endsWith('.css'))
		.forEach((sourceFile) => {
			Array.from(readFile(sourceFile).matchAll(/url\((["']?)(.*?)\1\)/gi), ([, , reference]) => {
				checkResolvedReference({ reference, sourceFile, baseFile: sourceFile, context: 'CSS url() reference' });
			});
		});
}

function checkProjectDataReferences() {
	const projectsJs = readFile('js/projects.js');

	Array.from(projectsJs.matchAll(/\burl:\s*["']([^"']+)["']/g), ([, reference]) => {
		checkResolvedReference({ reference, sourceFile: 'js/projects.js', baseFile: 'index.html', context: 'project link' });
	});

	Array.from(projectsJs.matchAll(/\bimage:\s*["']([^"']+)["']/g), ([, reference]) => {
		checkResolvedReference({ reference, sourceFile: 'js/projects.js', baseFile: 'index.html', context: 'project image' });
	});
}

checkHtmlReferences();
checkCssReferences();
checkProjectDataReferences();

if (failures.length) {
	console.error('Static link check failed:');
	failures.forEach((failure) => console.error(`- ${failure}`));
	process.exit(1);
}

console.log('Static link check passed.');
