// Type definitions for @titanpl/ui
// This file enables type inference when the UI extension
// is installed in a TitanPL project.

declare global {
    namespace Titan {
      interface Runtime {
        /**
         * @titanpl/ui Extension
         *
         * Unified UI rendering utilities for TitanPL
         * (HTML + CSS, runtime-first, action-safe)
         */
        ui: {
          /**
           * Render an HTML template in one call.
           *
           * @param htmlPath Path relative to `app/`
           * @param data Template variables (tpl{{ var }})
           * @param options Optional render options
           */
          render(
            htmlPath: string,
            data?: Record<string, any>,
            options?: {
              /**
               * CSS file or files to inline
               * Paths are relative to `app/`
               */
              css?: string | string[];
            }
          ): unknown; // Titan Response
  
          /**
           * Preload an HTML template and return a reusable renderer.
           *
           * @param htmlPath Path relative to `app/`
           */
          load(
            htmlPath: string
          ): (
            data?: Record<string, any>,
            options?: {
              css?: string | string[];
            }
          ) => unknown; // Titan Response
  
          /**
           * Load a CSS file and return a <style> string.
           *
           * @param cssPath Path relative to `app/`
           */
          css(cssPath: string): string;
  
          /**
           * Clear all cached UI templates and styles.
           */
          clearCache(): boolean;
        };
      }
    }
  }
  
  export {};
  