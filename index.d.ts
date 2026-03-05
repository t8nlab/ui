/**
 * @package @t8n/ui
 * Minimal UI rendering utilities for TitanPL.
 *
 * @description
 * `@t8n/ui` provides a lightweight HTML templating system for TitanPL
 * applications. It allows developers to render HTML templates with
 * variable interpolation and optional CSS injection directly from
 * Titan actions.
 *
 * Templates use the syntax:
 *
 * tpl{{ variable }}
 *
 * CSS can be injected using tpl{{ css }} inside the template.
 */

/**
 * Options used when rendering templates.
 */
export interface RenderOptions {

  /**
   * CSS file or files to inline.
   *
   * Paths are resolved relative to the `app/` directory.
   */
  css?: string | string[]
}

/**
 * Template data used for interpolation.
 */
export type TemplateData = Record<string, any>

/**
 * Function returned by `ui.load()`.
 *
 * A reusable renderer for a specific template.
 */
export type UIRenderer = (
  data?: TemplateData,
  options?: RenderOptions
) => any

/**
 * Main UI API.
 */
export interface UI {

  /**
   * Render an HTML template.
   *
   * Example:
   *
   * ```js
   * import { ui } from "@t8n/ui"
   *
   * export const page = () => {
   *   return ui.render(
   *     "static/app.html",
   *     { name: "Titan" },
   *     { css: "static/styles.css" }
   *   )
   * }
   * ```
   *
   * @param htmlPath Path to HTML template relative to `app/`
   * @param data Template variables
   * @param options Optional rendering options
   */
  render(
    htmlPath: string,
    data?: TemplateData,
    options?: RenderOptions
  ): any

  /**
   * Preload an HTML template and return a reusable renderer.
   *
   * Example:
   *
   * ```js
   * const page = ui.load("static/app.html")
   *
   * export const hello = () => {
   *   return page({ name: "Titan" })
   * }
   * ```
   *
   * @param htmlPath Path to HTML template relative to `app/`
   */
  load(htmlPath: string): UIRenderer

  /**
   * Load a CSS file and return an inline `<style>` block.
   *
   * Example:
   *
   * ```js
   * const styles = ui.css("static/styles.css")
   * ```
   *
   * @param cssPath Path to CSS file relative to `app/`
   */
  css(cssPath: string): string

  /**
   * Clear all cached HTML templates and CSS files.
   *
   * This clears both memory cache and persistent storage cache.
   */
  clearCache(): boolean
}

/**
 * Default UI instance.
 */
export const ui: UI

export default ui