import type { ProprietesTemplate } from "@/features/cv/components/templates/types";
import { obtenirComposantTemplate } from "@/features/cv/components/templates/registre-templates";

const CSS_IMPRESSION = `
@page {
  size: A4 portrait;
  margin: 0;
}

* {
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Utilitaires CV */
.bg-papier {
  background-color: #FAF8F3 !important;
}

.text-encre {
  color: #161B22 !important;
}

.text-ardoise {
  color: #3D4B5C !important;
}

/* Layout utilities */
.aspect-210-297 {
  width: 210mm;
  height: 297mm;
  position: relative;
  overflow: hidden;
  background: white;
}

/* Basic Tailwind-like utilities that are commonly used */
.bg-white { background-color: #FFFFFF !important; }
.bg-slate-50 { background-color: #F8FAFC !important; }
.bg-slate-100 { background-color: #F1F5F9 !important; }
.text-slate-500 { color: #64748B !important; }
.text-slate-600 { color: #475569 !important; }
.text-slate-700 { color: #334155 !important; }
.text-slate-900 { color: #0F172A !important; }
.text-white { color: #FFFFFF !important; }
.border { border: 1px solid #E2E8F0 !important; }
.border-2 { border: 2px solid #E2E8F0 !important; }
.border-4 { border: 4px solid #E2E8F0 !important; }
.border-slate-200 { border-color: #E2E8F0 !important; }
.border-l { border-left: 1px solid #E2E8F0 !important; }
.border-r { border-right: 1px solid #E2E8F0 !important; }
.border-b { border-bottom: 1px solid #E2E8F0 !important; }
.border-t { border-top: 1px solid #E2E8F0 !important; }
.rounded { border-radius: 0.25rem !important; }
.rounded-full { border-radius: 9999px !important; }
.rounded-lg { border-radius: 0.5rem !important; }
.rounded-2xl { border-radius: 1rem !important; }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important; }
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) !important; }

@media print {
  body {
    margin: 0;
  }
  
  .no-print {
    display: none !important;
  }
  
  .page-break {
    page-break-before: always;
  }
  
  .avoid-break {
    page-break-inside: avoid;
  }
}
`;

const CSS_TAILWIND_BASE = `
/* Reset et styles de base */
*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #E4E0D6;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 500;
  line-height: 1.2;
}

p {
  line-height: 1.5;
}

/* Icons - SVG styles */
svg {
  display: inline-block;
  vertical-align: middle;
}

.w-3 { width: 0.75rem; }
.w-3\\.5 { width: 0.875rem; }
.w-4 { width: 1rem; }
.w-5 { width: 1.25rem; }
.h-3 { height: 0.75rem; }
.h-3\\.5 { height: 0.875rem; }
.h-4 { height: 1rem; }
.h-5 { height: 1.25rem; }

/* Gradient background support */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

/* Clip path support */
.clip-path-polygon {
  clip-path: polygon(var(--tw-clip-path));
}

/* Clip path specific values */
.clip-corner {
  clip-path: polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%);
}

.clip-corner-inner {
  clip-path: polygon(0 0, calc(100% - 26.5px) 0, 100% 26.5px, 100% 100%, 0 100%);
}

.clip-corner-triangle {
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}

/* Circle and circular utilities */
.circle {
  border-radius: 50%;
}

.rounded-tl-none {
  border-top-left-radius: 0;
}

/* Stroke utilities */
.stroke-current {
  stroke: currentColor;
}

.stroke-width-4 {
  stroke-width: 4;
}

.fill-none {
  fill: none;
}

.transform {
  transform: var(--tw-transform);
}

.rotate-\\[-90_18\\] {
  transform: rotate(-90deg);
}

/* Color mix support */
.color-mix {
  color: color-mix(in srgb, var(--color-mix-color) var(--color-mix-percent), #161B22);
}

/* Flexbox utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.items-baseline { align-items: baseline; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-1 { gap: 0.25rem; }
.gap-1\\.5 { gap: 0.375rem; }
.gap-2 { gap: 0.5rem; }
.gap-2\\.5 { gap: 0.625rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-5 { gap: 1.25rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }
.gap-10 { gap: 2.5rem; }
.gap-12 { gap: 3rem; }
.gap-16 { gap: 4rem; }
.gap-24 { gap: 6rem; }

/* Spacing */
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-2\\.5 { padding: 0.625rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }
.p-10 { padding: 2.5rem; }
.p-12 { padding: 3rem; }
.p-16 { padding: 4rem; }
.px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
.px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
.px-2\\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.px-7 { padding-left: 1.75rem; padding-right: 1.75rem; }
.px-8 { padding-left: 2rem; padding-right: 2rem; }
.px-10 { padding-left: 2.5rem; padding-right: 2.5rem; }
.px-12 { padding-left: 3rem; padding-right: 3rem; }
.px-16 { padding-left: 4rem; padding-right: 4rem; }
.py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.py-9 { padding-top: 2.25rem; padding-bottom: 2.25rem; }
.py-10 { padding-top: 2.5rem; padding-bottom: 2.5rem; }
.py-12 { padding-top: 3rem; padding-bottom: 3rem; }
.py-14 { padding-top: 3.5rem; padding-bottom: 3.5rem; }
.pt-0\\.5 { padding-top: 0.125rem; }
.pt-1 { padding-top: 0.25rem; }
.pt-1\\.5 { padding-top: 0.375rem; }
.pt-2 { padding-top: 0.5rem; }
.pt-4 { padding-top: 1rem; }
.pt-6 { padding-top: 1.5rem; }
.pt-7 { padding-top: 1.75rem; }
.pt-8 { padding-top: 2rem; }
.pt-9 { padding-top: 2.25rem; }
.pt-10 { padding-top: 2.5rem; }
.pt-12 { padding-top: 3rem; }
.pt-14 { padding-top: 3.5rem; }
.pb-2 { padding-bottom: 0.5rem; }
.pb-4 { padding-bottom: 1rem; }
.pb-6 { padding-bottom: 1.5rem; }
.pb-8 { padding-bottom: 2rem; }
.pb-10 { padding-bottom: 2.5rem; }
.pb-16 { padding-bottom: 4rem; }
.pl-3 { padding-left: 0.75rem; }
.pl-3\\.5 { padding-left: 0.875rem; }
.pl-4 { padding-left: 1rem; }
.pl-6 { padding-left: 1.5rem; }
.pl-8 { padding-left: 2rem; }
.pr-2 { padding-right: 0.5rem; }
.pr-12 { padding-right: 3rem; }
.m-0 { margin: 0; }
.mt-0\\.5 { margin-top: 0.125rem; }
.mt-1 { margin-top: 0.25rem; }
.mt-1\\.5 { margin-top: 0.375rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mt-5 { margin-top: 1.25rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2rem; }
.mt-10 { margin-top: 2.5rem; }
.mt-12 { margin-top: 3rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-3\\.5 { margin-bottom: 0.875rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-5 { margin-bottom: 1.25rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-7 { margin-bottom: 1.75rem; }
.mb-8 { margin-bottom: 2rem; }
.mb-10 { margin-bottom: 2.5rem; }
.mb-12 { margin-bottom: 3rem; }
.mb-14 { margin-bottom: 3.5rem; }
.ml-10 { margin-left: 2.5rem; }
.mr-1 { margin-right: 0.25rem; }
.ml-2 { margin-left: 0.5rem; }
.ml-4 { margin-left: 1rem; }
.-mt-12 { margin-top: -3rem; }

/* Display */
.block { display: block; }
.inline-block { display: inline-block; }
.inline { display: inline; }
.inline-flex { display: inline-flex; }
.hidden { display: none; }
.relative { position: relative; }
.absolute { position: absolute; }
.w-full { width: 100%; }
.w-12 { width: 3rem; }
.w-16 { width: 4rem; }
.w-20 { width: 5rem; }
.w-24 { width: 6rem; }
.w-32 { width: 8rem; }
.w-48 { width: 12rem; }
.w-64 { width: 16rem; }
.w-80 { width: 20rem; }
.w-\\[34\\%\\] { width: 34%; }
.w-\\[90px\\] { width: 90px; }
.h-full { height: 100%; }
.h-0\\.5 { height: 0.125rem; }
.h-2 { height: 0.5rem; }
.h-2\\.5 { height: 0.625rem; }
.h-3 { height: 0.75rem; }
.h-3\\.5 { height: 0.875rem; }
.h-4 { height: 1rem; }
.h-6 { height: 1.5rem; }
.h-7 { height: 1.75rem; }
.h-8 { height: 2rem; }
.h-16 { height: 4rem; }
.h-20 { height: 5rem; }
.h-24 { height: 6rem; }
.h-32 { height: 8rem; }
.h-64 { height: 16rem; }
.h-80 { height: 20rem; }
.h-px { height: 1px; }
.min-h-0 { min-height: 0; }
.min-w-0 { min-width: 0; }
.shrink-0 { flex-shrink: 0; }
.flex-1 { flex: 1 1 0%; }
.grow { flex-grow: 1; }

/* Grid */
.grid { display: grid; }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-\\[90px_1fr\\] { grid-template-columns: 90px 1fr; }
.gap-2 { gap: 0.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }
.gap-12 { gap: 3rem; }

/* Typography utilities */
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.text-\\[10px\\] { font-size: 10px; }
.text-\\[11px\\] { font-size: 11px; }
.text-\\[12px\\] { font-size: 12px; }
.text-\\[28px\\] { font-size: 28px; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.font-light { font-weight: 300; }
.leading-tight { line-height: 1.25; }
.leading-none { line-height: 1; }
.leading-relaxed { line-height: 1.625; }
.tracking-tight { letter-spacing: -0.025em; }
.tracking-wide { letter-spacing: 0.025em; }
.tracking-widest { letter-spacing: 0.1em; }
.tracking-\\[0\\.18em\\] { letter-spacing: 0.18em; }
.tracking-\\[0\\.2em\\] { letter-spacing: 0.2em; }
.tracking-\\[0\\.22em\\] { letter-spacing: 0.22em; }
.tracking-\\[0\\.28em\\] { letter-spacing: 0.28em; }
.uppercase { text-transform: uppercase; }
.lowercase { text-transform: lowercase; }
.capitalize { text-transform: capitalize; }
.italic { font-style: italic; }
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-justify { text-align: justify; }
.whitespace-pre-line { white-space: pre-line; }
.whitespace-nowrap { white-space: nowrap; }
.break-words { overflow-wrap: break-word; }
.overflow-hidden { overflow: hidden; }

/* Colors */
.bg-white { background-color: #FFFFFF; }
.bg-slate-50 { background-color: #F8FAFC; }
.bg-slate-100 { background-color: #F1F5F9; }
.text-slate-500 { color: #64748B; }
.text-slate-600 { color: #475569; }
.text-slate-700 { color: #334155; }
.text-slate-900 { color: #0F172A; }
.text-white { color: #FFFFFF; }
.text-\\[\\#161B22\\] { color: #161B22; }
.text-\\[\\#3D4B5C\\] { color: #3D4B5C; }
.text-\\[\\#161B22\\]\\/75 { color: rgba(22, 27, 34, 0.75); }
.text-\\[\\#161B22\\]/85 { color: rgba(22, 27, 34, 0.85); }
.text-\\[\\#161B22\\]\\/\\[\\.85\\] { color: rgba(22, 27, 34, 0.85); }
.text-white\\/75 { color: rgba(255, 255, 255, 0.75); }
.text-white\\/85 { color: rgba(255, 255, 255, 0.85); }
.text-white\\/90 { color: rgba(255, 255, 255, 0.9); }
.text-slate-700\\/85 { color: rgba(51, 65, 85, 0.85); }

/* Borders */
.border { border-width: 1px; }
.border-2 { border-width: 2px; }
.border-4 { border-width: 4px; }
.border-slate-200 { border-color: #E2E8F0; }
.border-ardoise\\/20 { border-color: rgba(61, 75, 92, 0.2); }
.border-ardoise\\/15 { border-color: rgba(61, 75, 92, 0.15); }
.border-r { border-right-width: 1px; }
.border-l { border-left-width: 1px; }
.border-b { border-bottom-width: 1px; }
.border-t { border-top-width: 1px; }
.border-solid { border-style: solid; }
.rounded { border-radius: 0.25rem; }
.rounded-full { border-radius: 9999px; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-2xl { border-radius: 1rem; }
.rounded-\\[12px\\] { border-radius: 12px; }
.rounded-\\[8px\\] { border-radius: 8px; }

/* Background opacity */
.bg-white\\/10 { background-color: rgba(255, 255, 255, 0.1); }
.bg-slate-50 { background-color: #F8FAFC; }

/* Shadow */
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }

/* Other */
.opacity-75 { opacity: 0.75; }
.opacity-85 { opacity: 0.85; }
.space-y-2 > * + * { margin-top: 0.5rem; }
.space-y-3 > * + * { margin-top: 0.75rem; }
.space-y-3\\.5 > * + * { margin-top: 0.875rem; }
.space-y-4 > * + * { margin-top: 1rem; }
.space-y-5 > * + * { margin-top: 1.25rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }
.space-y-7 > * + * { margin-top: 1.75rem; }
.space-x-4 > * + * { margin-left: 1rem; }
.space-x-6 > * + * { margin-left: 1.5rem; }
.min-w-0 { min-width: 0; }
.max-w-none { max-width: none; }
.object-cover { object-fit: cover; }
`;

export function obtenirCssPourPdf(): string {
  return CSS_IMPRESSION + CSS_TAILWIND_BASE;
}

export function obtenirComposantTemplatePourPdf(templateId: string) {
  return obtenirComposantTemplate(templateId);
}
