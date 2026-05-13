import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const budgetPath = path.join(rootDir, 'lighthouse-budget.json');
const budget = JSON.parse(fs.readFileSync(budgetPath, 'utf8'));
const reportPaths = process.argv.slice(2);
const failures = [];

function formatScore(score) {
	return Math.round(score * 100);
}

function assert(condition, message) {
	if (!condition) failures.push(message);
}

function loadReport(reportPath) {
	const absolutePath = path.resolve(process.cwd(), reportPath);
	return {
		name: path.relative(rootDir, absolutePath) || reportPath,
		report: JSON.parse(fs.readFileSync(absolutePath, 'utf8')),
	};
}

function checkCategory(reportName, report, categoryName, minimumScore) {
	const category = report.categories?.[categoryName];

	assert(Boolean(category), `${reportName} is missing Lighthouse category: ${categoryName}.`);
	if (!category) return;

	assert(
		category.score >= minimumScore,
		`${reportName} ${categoryName} score ${formatScore(category.score)} is below ${formatScore(minimumScore)}.`,
	);
}

function checkAudit(reportName, report, auditName, maximumValue) {
	const audit = report.audits?.[auditName];

	assert(Boolean(audit), `${reportName} is missing Lighthouse audit: ${auditName}.`);
	if (!audit) return;

	assert(
		audit.numericValue <= maximumValue,
		`${reportName} ${auditName} ${audit.numericValue.toFixed(2)} is over ${maximumValue}.`,
	);
}

function checkReport({ name, report }) {
	assert(Boolean(report.finalDisplayedUrl || report.finalUrl || report.requestedUrl), `${name} is missing the audited URL.`);
	assert(Boolean(report.fetchTime), `${name} is missing fetchTime evidence.`);

	Object.entries(budget.categories).forEach(([categoryName, minimumScore]) => {
		checkCategory(name, report, categoryName, minimumScore);
	});

	Object.entries(budget.audits).forEach(([auditName, maximumValue]) => {
		checkAudit(name, report, auditName, maximumValue);
	});
}

if (!reportPaths.length || reportPaths.includes('--help')) {
	console.log('Usage: node scripts/check-lighthouse-result.mjs path/to/lighthouse-result.json [...]');
	console.log('The report must be a Lighthouse JSON export from a deployed URL.');
	process.exit(reportPaths.includes('--help') ? 0 : 1);
}

reportPaths.map(loadReport).forEach(checkReport);

if (failures.length) {
	console.error('Lighthouse budget check failed:');
	failures.forEach((failure) => console.error(`- ${failure}`));
	process.exit(1);
}

console.log(`Lighthouse budget check passed for ${reportPaths.length} report(s).`);
