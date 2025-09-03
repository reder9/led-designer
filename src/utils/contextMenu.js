export const createContextMenu = (x, y) => {
  const menu = document.createElement("div");
  menu.className = "absolute bg-white text-black rounded shadow-md z-50";
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.style.padding = "8px";
  menu.textContent = "Right-click menu (todo)";
  document.body.appendChild(menu);

  const cleanup = () => menu.remove();
  setTimeout(() => window.addEventListener("click", cleanup, { once: true }), 0);
};
