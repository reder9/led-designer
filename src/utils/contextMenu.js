export const createContextMenu = (x, y, options = {}) => {
  const {
    onCopy,
    onCut,
    onPaste,
    onDuplicate,
    onDelete,
    onBringToFront,
    onSendToBack,
    hasSelectedElement = false,
    canPaste = true,
  } = options;

  // Remove any existing context menu
  const existingMenu = document.querySelector('.context-menu');
  if (existingMenu) {
    existingMenu.remove();
  }

  const menu = document.createElement("div");
  menu.className = "context-menu fixed bg-gray-800 border border-gray-600 rounded-lg shadow-2xl z-50 py-2 min-w-48";
  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;

  const menuItems = [];

  if (hasSelectedElement) {
    menuItems.push(
      { label: "Copy", icon: "⌘C", action: onCopy, shortcut: "Ctrl+C" },
      { label: "Cut", icon: "✂️", action: onCut, shortcut: "Ctrl+X" },
      { separator: true },
      { label: "Duplicate", icon: "📄", action: onDuplicate, shortcut: "Ctrl+D" },
      { separator: true },
      { label: "Bring to Front", icon: "⬆️", action: onBringToFront },
      { label: "Send to Back", icon: "⬇️", action: onSendToBack },
      { separator: true },
      { label: "Delete", icon: "🗑️", action: onDelete, shortcut: "Del", danger: true }
    );
  }

  if (canPaste) {
    if (menuItems.length > 0) {
      menuItems.splice(2, 0, { label: "Paste", icon: "📋", action: onPaste, shortcut: "Ctrl+V" });
    } else {
      menuItems.push({ label: "Paste", icon: "📋", action: onPaste, shortcut: "Ctrl+V" });
    }
  }

  if (menuItems.length === 0) {
    menuItems.push({ label: "No actions available", disabled: true });
  }

  menuItems.forEach((item) => {
    if (item.separator) {
      const separator = document.createElement("div");
      separator.className = "h-px bg-gray-600 my-1 mx-2";
      menu.appendChild(separator);
      return;
    }

    const menuItem = document.createElement("div");
    menuItem.className = `flex items-center justify-between px-3 py-2 text-sm cursor-pointer transition-colors ${
      item.disabled 
        ? "text-gray-500 cursor-not-allowed" 
        : item.danger
        ? "text-red-400 hover:bg-red-900/20"
        : "text-white hover:bg-gray-700"
    }`;

    const leftContent = document.createElement("div");
    leftContent.className = "flex items-center gap-3";
    
    const icon = document.createElement("span");
    icon.textContent = item.icon || "•";
    icon.className = "w-4 text-center";
    
    const label = document.createElement("span");
    label.textContent = item.label;
    
    leftContent.appendChild(icon);
    leftContent.appendChild(label);
    menuItem.appendChild(leftContent);

    if (item.shortcut && !item.disabled) {
      const shortcut = document.createElement("span");
      shortcut.textContent = item.shortcut;
      shortcut.className = "text-xs text-gray-400 ml-4";
      menuItem.appendChild(shortcut);
    }

    if (!item.disabled && item.action) {
      menuItem.addEventListener("click", (e) => {
        e.stopPropagation();
        item.action();
        menu.remove();
      });
    }

    menu.appendChild(menuItem);
  });

  // Position adjustment to keep menu in viewport
  document.body.appendChild(menu);
  
  const rect = menu.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  if (rect.right > viewportWidth) {
    menu.style.left = `${x - rect.width}px`;
  }
  if (rect.bottom > viewportHeight) {
    menu.style.top = `${y - rect.height}px`;
  }

  // Cleanup function
  const cleanup = (e) => {
    if (!menu.contains(e.target)) {
      menu.remove();
      document.removeEventListener("click", cleanup);
      document.removeEventListener("contextmenu", cleanup);
    }
  };

  // Add cleanup listeners with a small delay to prevent immediate removal
  setTimeout(() => {
    document.addEventListener("click", cleanup);
    document.addEventListener("contextmenu", cleanup);
  }, 10);

  return menu;
};
