/**
 * TitanPL UI Extension (HTML + CSS)
 * Provides:
 *   t.ui.load()
 *   t.ui.render()
 *   t.ui.css()
 *   t.ui.clearCache()
 */

import { registerExtension } from "./utils/registerExtension.js";
import { fs, ls } from "@titanpl/core"

const _G = globalThis;
const t =
    typeof Titan !== "undefined"
        ? Titan
        : typeof _G.t !== "undefined"
            ? _G.t
            : typeof _G.Titan !== "undefined"
                ? _G.Titan
                : null;

if (!t) {
    throw new Error("[@t8n/ui] Titan runtime not found");
}


// --------------------------------------------------
// Internal cache
// --------------------------------------------------
const memoryCache = Object.create(null);

// --------------------------------------------------
// Resolve paths relative to app/  ✅ FIXED
// --------------------------------------------------
function resolvePath(path) {
    const root = "app"
    return root + `/${path.replace(/^\/+/, "")}`;
}

// --------------------------------------------------
// Load file with memory + persistent cache
// --------------------------------------------------
function loadFile(path, prefix) {
    if (memoryCache[path]) return memoryCache[path];

    const cached = ls.get(`${prefix}:${path}`);
    if (cached) {
        memoryCache[path] = cached;
        return cached;
    }

    const content = fs.readFile(path);
    memoryCache[path] = content;
    ls.set(`${prefix}:${path}`, content);

    return content;
}

// --------------------------------------------------
// Render tpl{{ var }}
// --------------------------------------------------
function renderTemplate(template, data = {}) {
    return template.replace(
        /tpl\{\{\s*(\w+)\s*\}\}/g,
        (m, k) => (k in data ? String(data[k]) : m)
    );
}

// --------------------------------------------------
// Inject CSS into render data
// --------------------------------------------------
function injectCSS(data, opts = {}) {
    if (!opts.css) return data;

    const files = Array.isArray(opts.css) ? opts.css : [opts.css];

    const styles = files
        .map(p => {
            const css = loadFile(resolvePath(p), "css");
            return `<style>\n${css}\n</style>`;
        })
        .join("\n");

    return { ...data, css: styles };
}

// --------------------------------------------------
// UI SERVICE (SAFE TO EXPORT)
// --------------------------------------------------
export const ui = {
    load(htmlPath) {
        const tpl = loadFile(resolvePath(htmlPath), "html");

        return (data = {}, opts = {}) => {
            const html = renderTemplate(tpl, injectCSS(data, opts));
            return t.response.html(html);
        };
    },

    render(htmlPath, data = {}, opts = {}) {
        const tpl = loadFile(resolvePath(htmlPath), "html");
        const html = renderTemplate(tpl, injectCSS(data, opts));
        return t.response.html(html);
    },

    css(cssPath) {
        const css = loadFile(resolvePath(cssPath), "css");
        return `<style>\n${css}\n</style>`;
    },

    clearCache() {
        for (const k in memoryCache) delete memoryCache[k];

        ls.keys().forEach(k => {
            if (k.startsWith("html:") || k.startsWith("css:")) {
                ls.remove(k);
            }
        });

        return true;
    }
};

// --------------------------------------------------
// REGISTER INTO TITAN (SuperLS-style) ✅ FIXED
// --------------------------------------------------
registerExtension("ui", ui);

// Optional default export (same pattern as SuperLocalStorage)
export default ui;
