export function ensureRoot(): HTMLElement {
  const el = document.getElementById('root');
  if (!el) throw new Error("Missing <div id='root'></div> in index.html");
  return el;
}
