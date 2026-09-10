"use strict";

const RepositoryView = {
  render(container, data) {
    if (!container) return;
    container.innerHTML = "";

    if (!Array.isArray(data) || !data.length) {
      this.renderEmptyState(container);
      return;
    }

    const fragment = document.createDocumentFragment();
    data.forEach(repository => fragment.appendChild(this.createCard(repository)));
    container.appendChild(fragment);
  },

  createCard(repository) {
    const card = App.createElement("a", "repository-card");
    card.href = this.getRepositoryURL(repository);
    card.setAttribute("aria-label", `Open ${repository.name} repository`);

    const icon = App.createElement("div", "repository-card-icon");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = repository.icon || "EH";

    const content = App.createElement("div", "repository-card-content");

    const heading = App.createElement("div", "repository-card-heading");

    const name = App.createElement("h3", "repository-card-name");
    name.textContent = repository.name;

    const type = App.createElement("span", "repository-card-type");
    type.textContent = repository.type || "Repository";

    const sourceCount = App.createElement("span", "repository-card-source-count");
    const sources = Array.isArray(repository.sources) ? repository.sources.length : 0;
    sourceCount.textContent = `${sources} ${sources === 1 ? "source" : "sources"}`;

    heading.append(name, type, sourceCount);

    const description = App.createElement("p", "repository-card-description");
    description.textContent = repository.description || "";

    const meta = App.createElement("div", "repository-card-meta");

    const extensionCount = App.createElement("span", "repository-card-count");
    const extensions = Array.isArray(repository.extensions) ? repository.extensions.length : 0;
    extensionCount.textContent = `${extensions} ${extensions === 1 ? "extension" : "extensions"}`;

    meta.appendChild(extensionCount);
    content.append(heading, description, meta);

    const arrow = App.createElement("span", "repository-card-arrow");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";

    card.append(icon, content, arrow);
    return card;
  },

  getRepositoryURL(repository) {
    return `repository.html?id=${encodeURIComponent(repository.id)}`;
  },

  renderEmptyState(container) {
    container.innerHTML = `
      <div class="repository-empty">
        <div>
          <h3>No repositories available</h3>
          <p>There are currently no repositories configured.</p>
        </div>
      </div>
    `;
  }
};
