````md
# @t8n/ui

A **minimal, explicit UI extension for TitanPL** that lets you render HTML and inject CSS **in a single render call** — with **no static routes**, **no magic**, and **full control**.

This extension is designed for **action-based routing** and **runtime-first** TitanPL apps.

---

## ✨ Features

- `ui.render()` → render HTML + CSS in one call
- `ui.load()` → preload templates for reuse
- `ui.css()` → load CSS manually if needed
- Simple templating: `tpl{{ var }}`
- Explicit CSS injection (no hidden parsing)
- Memory + persistent (`ls`) caching
- Zero static file server
- Zero extra routes
- One extension, one mental model

---

## 📦 Installation

```bash
npm install @titanpl/ui
````

TitanPL automatically loads the extension at runtime.

---

## 📁 Project Structure

```
app/
├─ actions/
│  └─ hello.js
├─ static/
│  ├─ app.html
│  └─ styles.css
```

All paths are **relative to `app/`**.

---

## 🧠 Core Idea

TitanPL does **nothing implicitly**.

* HTML is rendered only when you call `ui.render()` or `ui.load()`
* CSS is injected **only if you explicitly request it**
* You decide where CSS goes in HTML

---

## 🧩 Template Syntax

### Variables

```html
tpl{{ name }}
```

### CSS injection point

```html
tpl{{ css }}
```

---

## 🚀 Usage

### 1️⃣ HTML Template

`app/static/app.html`

```html
<!DOCTYPE html>
<html>
<head>
  tpl{{ css }}
</head>
<body>
  <h1>tpl{{ name }}</h1>
</body>
</html>
```

---

### 2️⃣ CSS File

`app/static/styles.css`

```css
body {
  background-color: black;
  height: 100vh;
}

h1 {
  color: rgb(32, 215, 215);
}
```

---

### 3️⃣ One-Shot Render (Recommended)

```js
import { ui } from "@t8n/ui"

export const hello = () => {
  return ui.render(
    "static/app.html",
    { name: "Titan" },
    { css: "static/styles.css" }
  );
};
```

✔ HTML rendered
✔ CSS injected
✔ Single response
✔ No static routes

---

### 4️⃣ Multiple CSS Files

```js
return ui.render(
  "static/app.html",
  { name: "Titan" },
  { css: ["static/base.css", "static/theme.css"] }
);
```

CSS files are injected **in order**.

---

## 🔁 Preloading Templates with `ui.load()`

Use this for **high-traffic routes**.

```js
const page = ui.load("static/app.html");

export const hello = () => {
  return page(
    { name: "Titan" },
    { css: "static/styles.css" }
  );
};
```

### Why use `load()`?

* Template read once
* Faster per request
* Cleaner route code

---

## 🎯 Manual CSS Loading (Optional)

If you want full control:

```js
export const hello = () => {
  return ui.render("static/app.html", {
    name: "Titan",
    css: ui.css("static/styles.css")
  });
};
```

---

## 🧠 API Reference

### `ui.render(htmlPath, data?, options?)`

Render HTML once with optional CSS.

```js
ui.render(
  "static/app.html",
  { name: "Titan" },
  { css: "static/styles.css" }
);
```

---

### `ui.load(htmlPath)`

Preload template and return a reusable renderer.

```js
const page = ui.load("static/app.html");
page(data, options);
```

---

### `ui.css(cssPath)`

Load CSS and return a `<style>` block.

```js
ui.css("static/styles.css");
```

---

### `ui.clearCache()`

Clear all cached HTML and CSS files.

```js
ui.clearCache();
```

---

## 🧠 Mental Model (Important)

```text
ui.render() → returns an HTML response
tpl{{ css }}  → where styles are injected
tpl{{ var }}  → template variables
YOU           → control composition
```

No implicit behavior.
No auto static serving.
No hidden parsing.

---

## ❌ What This Extension Does NOT Do

* ❌ No static file server
* ❌ No `<link>` interception
* ❌ No auto CSS loading
* ❌ No HTML AST parsing
* ❌ No framework magic

This is **intentional**.

---

## ✅ Why This Fits TitanPL

* Runtime-first
* Predictable
* Explicit IO
* Action-based routing friendly
* Production-safe
* Easy to debug

---

## 🛣️ Possible Extensions (Future)

* `ui.js()` for inline JS
* Layouts / partials
* Scoped CSS
* Dot-path vars (`tpl{{ user.name }}`)
* HTML escaping / raw blocks


