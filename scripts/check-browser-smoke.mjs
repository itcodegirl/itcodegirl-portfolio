import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { join, extname, resolve, sep } from "node:path";
import { strict as assert } from "node:assert";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";

const chrome = process.env.CHROME_BIN;
if (!chrome) throw new Error("Set CHROME_BIN to an installed Chrome or Chromium executable.");
const root = resolve(".");
const mime = { ".html":"text/html", ".css":"text/css", ".js":"text/javascript", ".webp":"image/webp", ".png":"image/png", ".jpg":"image/jpeg", ".svg":"image/svg+xml", ".woff2":"font/woff2", ".pdf":"application/pdf" };
const server = createServer(async (req, res) => {
	try {
		let name = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
		if (name.endsWith("/")) name += "index.html";
		const path = resolve(root, "." + name);
		if (!path.startsWith(root + sep)) throw new Error("outside root");
		const body = await readFile(path);
		res.writeHead(200, { "Content-Type": mime[extname(path)] ?? "application/octet-stream" });
		res.end(body);
	} catch { res.writeHead(404).end(); }
});
await new Promise((done, fail) => server.once("error", fail).listen(0, "127.0.0.1", done));
const base = "http://127.0.0.1:" + server.address().port;
const profile = await mkdtemp(join(tmpdir(), "portfolio-browser-"));
const child = spawn(chrome, ["--headless=new", "--remote-debugging-port=0", "--user-data-dir=" + profile, "about:blank"], { windowsHide:true, stdio:["ignore","ignore","pipe"] });
let diagnostics = "";
child.stderr.on("data", (chunk) => { diagnostics = (diagnostics + chunk).slice(-1200); });
child.on("error", (error) => { diagnostics += error.message; });
const pause = (ms) => new Promise((done) => setTimeout(done, ms));
let sock;
try {
	let port;
	for (let i = 0; i < 100 && !port; i++) {
		try { port = Number((await readFile(join(profile, "DevToolsActivePort"), "utf8")).split(/\r?\n/)[0]); } catch {}
		if (!port) await pause(100);
	}
	assert(port, "Chrome did not start its isolated debugging session: " + diagnostics);
	const [tab] = await (await fetch("http://127.0.0.1:" + port + "/json/list")).json();
	assert(tab?.webSocketDebuggerUrl, "No headless Chrome tab found");
	sock = new WebSocket(tab.webSocketDebuggerUrl);
	await new Promise((done, fail) => { sock.addEventListener("open", done, { once:true }); sock.addEventListener("error", fail, { once:true }); });
	let next = 0;
	const pending = new Map();
	let loaded;
	sock.addEventListener("message", ({data}) => {
		const msg = JSON.parse(data);
		if (msg.method === "Page.loadEventFired") loaded?.();
		if (msg.id && pending.has(msg.id)) {
			const { done, fail } = pending.get(msg.id);
			pending.delete(msg.id);
			msg.error ? fail(new Error(msg.error.message)) : done(msg.result);
		}
	});
	const call = (method, params = {}) => new Promise((done, fail) => {
		const id = ++next;
		const timer = setTimeout(() => { pending.delete(id); fail(new Error(method + " timed out")); }, 10000);
		pending.set(id, { done(value) { clearTimeout(timer); done(value); }, fail(error) { clearTimeout(timer); fail(error); } });
		sock.send(JSON.stringify({ id, method, params }));
	});
	const run = async (expression) => {
		const result = await call("Runtime.evaluate", {expression, returnByValue:true, awaitPromise:true});
		if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
		return result.result.value;
	};
	const go = async (path) => {
		let timer;
		const navigated = new Promise((done, fail) => { loaded = done; timer = setTimeout(() => fail(new Error("Load timed out: " + path)), 10000); });
		try { await Promise.all([call("Page.navigate", { url: base + path }), navigated]); }
		finally { clearTimeout(timer); loaded = undefined; }
	};
	await call("Page.enable");
	for (const [width, reduced] of [[320, true], [390, true], [1440, false]]) {
		await call("Emulation.setDeviceMetricsOverride", { width, height:width === 320 ? 740 : 900, deviceScaleFactor:1, mobile:false });
		await call("Emulation.setEmulatedMedia", { features:[{ name:"prefers-reduced-motion", value:reduced ? "reduce" : "no-preference" }] });
		await go("/");
		assert.equal(await run("matchMedia('(prefers-reduced-motion: reduce)').matches"), reduced);
		assert(await run("document.documentElement.scrollWidth <= innerWidth"), width + "px homepage overflow");
		assert.equal(await run("document.querySelector('#hero-title').textContent.trim()"), "Frontend Web Developer | Accessible UI & AI-Assisted Implementation");
		if (width === 320) assert(await run("document.querySelector('.hero-cta--primary').getBoundingClientRect().bottom <= innerHeight"), "Primary action should fit in the first 320 by 740 viewport");
		assert(await run("getComputedStyle(document.querySelector('.skills-ticker')).animationName === 'none' && [...document.querySelectorAll('.skills-ticker span')].every(el => getComputedStyle(el).animationName === 'none')"), "skills strip should be static");
		assert(await run("document.querySelectorAll('#projectsGrid a[href*=\"codeherway\"]').length > 0"), "CodeHerWay work card not linked");
		assert.equal(await run("document.activeElement.tagName"), "BODY");
		await call("Input.dispatchKeyEvent", { type:"rawKeyDown", key:"Tab", code:"Tab", windowsVirtualKeyCode:9 });
		await call("Input.dispatchKeyEvent", { type:"keyUp", key:"Tab", code:"Tab", windowsVirtualKeyCode:9 });
		assert.equal(await run("document.activeElement.className"), "skip-link", "skip link should be first in tab order");
		await call("Input.dispatchKeyEvent", { type:"rawKeyDown", key:"Enter", code:"Enter", windowsVirtualKeyCode:13 });
		await call("Input.dispatchKeyEvent", { type:"keyUp", key:"Enter", code:"Enter", windowsVirtualKeyCode:13 });
		assert.equal(await run("document.activeElement.id"), "main-content", "skip link should move focus to main");
		await run("document.querySelector('.hero-portrait-range').focus()");
		const before = await run("document.activeElement.valueAsNumber");
		await call("Input.dispatchKeyEvent", { type:"rawKeyDown", key:"ArrowRight", code:"ArrowRight", windowsVirtualKeyCode:39 });
		await call("Input.dispatchKeyEvent", { type:"keyUp", key:"ArrowRight", code:"ArrowRight", windowsVirtualKeyCode:39 });
		assert(await run("document.activeElement.valueAsNumber") > before, "slider should respond to arrow keys");
		assert(await run("Boolean(document.querySelector('.hero-portrait-overlay').style.clipPath)"), "slider should update the portrait");
		const proofHref = await run("document.querySelector('.contact-services a[href*=\"#my-role\"]').getAttribute('href')");
		await go("/" + proofHref);
		assert(await run("document.documentElement.scrollWidth <= innerWidth"), width + "px flagship overflow");
		assert(await run("document.querySelector('#my-role').textContent.includes('AI-Assisted')"), "service link missed the founder workflow");
		assert(await run("Boolean(document.querySelector('#verify-90 a[href*=\"codeherway.com\"]'))"), "missing public proof link");
		assert(await run("['Vera','flashcards','notes','glossary','cheat sheets','build projects','coding challenge','Practice Lab'].every(term => document.querySelector('#learner-journey').textContent.includes(term))"), "missing learner journey capability");
		console.log("PASS " + width + "px, reduced motion " + (reduced ? "on" : "off"));
	}
} finally {
	sock?.close();
	server.close();
	child.kill();
	await Promise.race([new Promise((done) => child.once("exit", done)), pause(2000)]);
	await rm(profile, { recursive:true, force:true, maxRetries:2, retryDelay:250 }).catch(() => {});
}
