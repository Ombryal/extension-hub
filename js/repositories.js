"use strict";

const RepositoryPage = {
  getId() {
    return new URLSearchParams(location.search).get("id");
  },

  getRepository(id) {
    return repositories.find(repo => repo.id === id);
  },

  async init() {
    const header = App.select("#repository-header");
    const list = App.select("#extension-list");
    const summary = App.select("#extension-summary");

    if (!header || !list || !summary) return;

    const repository = this.getRepository(this.getId());

    if (!repository) {
      this.notFound(header, list, summary);
      return;
    }

    document.title = `${repository.name} | Extension Hub`;

    try {
      await DataLoader.loadRepository(repository);
    } catch (error) {
      console.error(`Failed to load ${repository.name}:`, error);
    }

    this.renderHeader(header, repository);
    this.renderExtensions(list, repository.extensions);
    summary.textContent = `${repository.extensions.length} ${
      repository.extensions.length === 1 ? "extension" : "extensions"
    }`;

    list.setAttribute("aria-busy", "false");
  },

  renderHeader(container, repo) {
    container.innerHTML = `
      <div class="repository-header-icon" aria-hidden="true">
        ${App.escapeHTML(repo.icon || "EH")}
      </div>
      <div class="repository-header-content">
        <h1>${App.escapeHTML(repo.name)}</h1>
        <p>${App.escapeHTML(repo.description || "")}</p>
        <div class="repository-header-meta">
          <span>${App.escapeHTML(repo.type || "Repository")}</span>
          <span>${repo.sources.length} sources</span>
        </div>
      </div>
    `;
  },

  renderExtensions(container, extensions = []) {
    if (!extensions.length) {
      container.innerHTML = `
        <div class="extension-empty">
          <h3>No extensions available</h3>
          <p>No compatible extension data was found in the configured sources.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = extensions.map(extension => `
      <article class="extension-card">
        <div class="extension-icon" aria-hidden="true">
          ${App.escapeHTML(extension.icon || "EX")}
        </div>
        <div class="extension-content">
          <div class="extension-heading">
            <h3 class="extension-name">${App.escapeHTML(extension.name)}</h3>
            ${extension.version ? `<span class="extension-version">v${App.escapeHTML(extension.version)}</span>` : ""}
          </div>
          <p class="extension-description">
            ${App.escapeHTML(extension.description || "No description available.")}
          </p>
          ${extension.languages.length ? `
            <div class="extension-meta">
              <span>${App.escapeHTML(extension.languages.join(" · "))}</span>
            </div>
          ` : ""}
        </div>
        <a
          class="extension-action"
          href="${App.escapeHTML(extension.url || "#")}"
          ${extension.url ? 'target="_blank" rel="noopener noreferrer"' : ""}
          aria-label="Open ${App.escapeHTML(extension.name)}"
        >→</a>
      </article>
    `).join("");
  },

  notFound(header, list, summary) {
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
  }
};

document.addEventListener("DOMContentLoaded", () => RepositoryPage.init());
