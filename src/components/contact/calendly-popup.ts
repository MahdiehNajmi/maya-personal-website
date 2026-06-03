const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";
const CALENDLY_STYLES = "https://assets.calendly.com/assets/external/widget.css";

let scriptPromise: Promise<void> | null = null;

function loadCalendlyAssets(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly?.initPopupWidget) return Promise.resolve();

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      if (!document.querySelector(`link[href="${CALENDLY_STYLES}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = CALENDLY_STYLES;
        document.head.appendChild(link);
      }

      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${CALENDLY_SCRIPT}"]`,
      );

      if (existing) {
        if (window.Calendly?.initPopupWidget) {
          resolve();
          return;
        }
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () =>
          reject(new Error("Calendly script failed to load")),
        );
        return;
      }

      const script = document.createElement("script");
      script.src = CALENDLY_SCRIPT;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Calendly script failed to load"));
      document.head.appendChild(script);
    });
  }

  return scriptPromise;
}

export async function openCalendlyPopup(url: string) {
  await loadCalendlyAssets();
  window.Calendly?.initPopupWidget({ url });
}
