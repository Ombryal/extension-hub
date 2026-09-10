"use strict";

const App = {
  escapeHTML(value) {
    const element = document.createElement("div");
    element.textContent = String(value ?? "");
    return element.innerHTML;
  },

  select(selector, root = document) {
    return root.querySelector(selector);
  },

  createElement(tag, classes = []) {
    const element = document.createElement(tag);
    (Array.isArray(classes) ? classes : [classes])
      .filter(Boolean)
      .forEach(name => element.classList.add(name));
    return element;
  },

  async init() {
    const list = this.select("#repository-list");
    if (!list) return;

    try {
      await DataLoader.loadAll();
      RepositoryView.render(list, repositories);
    } catch (error) {
      console.error("Failed to load repository data:", error);
      RepositoryView.render(list, repositories);
    }

    list.setAttribute("aria-busy", "false");
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());
