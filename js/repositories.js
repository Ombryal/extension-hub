"use strict";

const RepositoryPage = {
  getRepositoryId() {
    return new URLSearchParams(window.location.search).get("id");
  },

  findRepository(id) {
    return repositories.find(repository => repository.id === id);
  },

  render(repository) {
    const header = App.select("#repository-header");
    const list = App.select("#extension-list");
    const summary = App.select("#extension-summary");

    if (!header || !list || !summary) return;

    if (!repository) {
      this.renderNotFound(header, list, summary);
      return;
    }

    document.title = `${repository.name} | Extension Hub`;

    header.innerHTML = `
      <div class="repository-header-icon" aria-hidden="true">
        ${App.escapeHTML(repository.icon || "EH")}
      </div>
      <div class="repository-header-content">
        <h1>${App.escapeHTML(repository.name)}</h1>
        <p>${App.escapeHTML(repository.description || "")}</p>
        <div class="repository-header-meta">
          <span>${App.escapeHTML(repository.type || "Repository")}</span>
          <span>${repository.extensions.length} extensions</span>
        </div>
      </div>
    `;

    summary.textContent =
      `${repository.extensions.length} ${repository.extensions.length === 1 ? "extension" : "extensions"}`;

    this.renderExtensions(list, repository.extensions);
    list.setAttribute("aria-busy", "false");
  },

  renderExtensions(container, extensions) {
    container.innerHTML = "";

    if (!extensions.length) {
      container.innerHTML = `
        <div class="extension-empty">
          <h3>No extensions available</h3>
          <p>This repository does not have extension data yet.</p>
        </div>
      `;
      return;
    }

    const fragment = document.createDocumentFragment();

    extensions.forEach(extension => {
      fragment.appendChild(this.createExtensionCard(extension));
    });

    container.appendChild(fragment);
  },

  createExtensionCard(extension) {
    const card = document.createElement("article");
    card.className = "extension-card";

    const languages = Array.isArray(extension.languages)
      ? extension.languages.join(" · ")
      : "";

    card.innerHTML = `
      <div class="extension-icon" aria-hidden="true">
        ${App.escapeHTML(extension.icon || "EX")}
      </div>

      <div class="extension-content">
        <div class="extension-heading">
          <h3 class="extension-name">
            ${App.escapeHTML(extension.name || "Unnamed extension")}
          </h3>

          ${
            extension.version
              ? `<span class="extension-version">v${App.escapeHTML(extension.version)}</span>`
              : ""
          }
        </div>

        <p class="extension-description">
          ${App.escapeHTML(extension.description || "No description available.")}
        </p>

        ${
          languages
            ? `
              <div class="extension-meta">
                <span>${App.escapeHTML(languages)}</span>
              </div>
            `
            : ""
        }
      </div>

      <a
        class="extension-action"
        href="${App.escapeHTML(extension.url || "#")}"
        ${extension.url ? 'target="_blank" rel="noopener noreferrer"' : ""}
        aria-label="Open ${App.escapeHTML(extension.name || "extension")}"
      >
        →
      </a>
    `;

    return card;
  },

  renderNotFound(header, list, summary) {
    document.title = "Repository Not Found | Extension Hub";

    header.innerHTML = `
      <div class="repository-header-icon" aria-hidden="true">?</div>
      <div class="repository-header-content">
        <h1>Repository not found</h1>
        <p>The requested repository does not exist in this directory.</p>
      </div>
    `;

    summary.textContent = "No repository";

    list.innerHTML = `
      <div class="extension-empty">
        <h3>Nothing to show here</h3>
        <p>Return to the repository directory and choose a valid repository.</p>
      </div>
    `;

    list.setAttribute("aria-busy", "false");
  },

  init() {
    const id = this.getRepositoryId();
    const repository = this.findRepository(id);

    this.render(repository);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  RepositoryPage.init();
});
