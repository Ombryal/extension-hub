"use strict";

const ExtensionView = {
  render(container, extensions = []) {
    if (!container) return;

    if (!extensions.length) {
      container.innerHTML = `
        <div class="extension-empty">
          <h3>No extensions available</h3>
          <p>No compatible extension data was found in the configured sources.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = extensions
      .map(extension => this.card(extension))
      .join("");
  },

  card(extension) {
    const name = App.escapeHTML(extension.name || "Unnamed extension");
    const description = App.escapeHTML(
      extension.description || "No description available."
    );
    const version = extension.version
      ? `<span class="extension-version">v${App.escapeHTML(extension.version)}</span>`
      : "";
    const languages = Array.isArray(extension.languages)
      ? extension.languages.filter(Boolean).join(" · ")
      : "";
    const meta = languages
      ? `<div class="extension-meta"><span>${App.escapeHTML(languages)}</span></div>`
      : "";
    const url = extension.url || "#";
    const external = extension.url
      ? ' target="_blank" rel="noopener noreferrer"'
      : "";

    return `
      <article class="extension-card">
        <div class="extension-icon" aria-hidden="true">
          ${App.escapeHTML(extension.icon || "EX")}
        </div>

        <div class="extension-content">
          <div class="extension-heading">
            <h3 class="extension-name">${name}</h3>
            ${version}
          </div>

          <p class="extension-description">${description}</p>
          ${meta}
        </div>

        <a
          class="extension-action"
          href="${App.escapeHTML(url)}"
          ${external}
          aria-label="Open ${name}"
        >→</a>
      </article>
    `;
  }
};
