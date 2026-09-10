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
    ExtensionView.render(list, repository.extensions);

    const count = repository.extensions.length;
    summary.textContent = `${count} ${count === 1 ? "extension" : "extensions"}`;
    list.setAttribute("aria-busy", "false");
  },

  renderHeader(container, repo) {
    const count = repo.extensions.length;

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
          <span>${count} ${count === 1 ? "extension" : "extensions"}</span>
        </div>
      </div>
    `;
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
      <div class="not-found-state">
        <div>
          <div class="state-icon" aria-hidden="true">?</div>
          <h3>Nothing to show here</h3>
          <p>Return to the repository directory and choose a valid repository.</p>
          <a class="state-action" href="./">Back to repositories</a>
        </div>
      </div>
    `;

    list.setAttribute("aria-busy", "false");
  }
};

document.addEventListener("DOMContentLoaded", () => RepositoryPage.init());
