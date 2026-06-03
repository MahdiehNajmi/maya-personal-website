interface CalendlyInlineWidgetOptions {
  url: string;
  parentElement: HTMLElement;
  prefill?: Record<string, string>;
  utm?: Record<string, string>;
}

interface CalendlyPopupWidgetOptions {
  url: string;
  prefill?: Record<string, string>;
  utm?: Record<string, string>;
}

interface CalendlyNamespace {
  initInlineWidget: (options: CalendlyInlineWidgetOptions) => void;
  initPopupWidget: (options: CalendlyPopupWidgetOptions) => void;
}

interface Window {
  Calendly?: CalendlyNamespace;
}
