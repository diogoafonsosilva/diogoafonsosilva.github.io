// Proteção contra cópia e clonagem. Carregado em todas as páginas, antes dos outros scripts.
// Dissuade cópia casual e clones preguiçosos; não impede quem souber o que faz —
// tudo o que o browser mostra pode ser copiado. A parte contra bots está no robots.txt.
(() => {
  const ORIGIN = "https://diogoafonsosilva.github.io";
  // Ao mudar para domínio próprio, acrescentar aqui ANTES de o ligar — senão o site redireciona para si mesmo.
  const ALLOWED_HOSTS = ["diogoafonsosilva.github.io", "localhost", "127.0.0.1"];

  // Clone alojado noutro domínio → volta ao original
  if (location.protocol !== "file:" && !ALLOWED_HOSTS.includes(location.hostname)) {
    location.replace(ORIGIN + "/");
    return;
  }

  // Não deixa embutir o site num iframe de terceiros
  if (window.top !== window.self) {
    try { window.top.location.replace(location.href); } catch { document.documentElement.innerHTML = ""; }
    return;
  }

  const editable = (el) => el instanceof Element && el.closest("input, textarea, [contenteditable='true']");

  document.addEventListener("contextmenu", (e) => { if (!editable(e.target)) e.preventDefault(); });
  document.addEventListener("dragstart", (e) => { if (!editable(e.target)) e.preventDefault(); });
  document.addEventListener("selectstart", (e) => { if (!editable(e.target)) e.preventDefault(); });

  // Se algo for copiado, vai a fonte em vez do texto
  document.addEventListener("copy", (e) => {
    if (editable(e.target)) return;
    e.preventDefault();
    e.clipboardData?.setData("text/plain", `© Diogo Silva — ${location.href}`);
  });

  // Atalhos de ver código, guardar página e ferramentas de programador
  document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    const mod = e.ctrlKey || e.metaKey;
    if (
      e.key === "F12" ||
      (mod && (k === "u" || k === "s")) ||
      (mod && e.shiftKey && (k === "i" || k === "j" || k === "c")) ||
      (e.metaKey && e.altKey && (k === "i" || k === "j" || k === "c" || k === "u"))
    ) {
      e.preventDefault();
    }
  });

  console.log(
    "%cConteúdo, código e imagens © Diogo Silva. Reprodução sem autorização não é permitida.",
    "font: 600 13px system-ui; color: #e8714a"
  );
})();
