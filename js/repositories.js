"use strict";

/**
 * Repository rendering layer.
 *
 * This file turns the repository configuration into the horizontal
 * cards displayed on the homepage.
 */

const RepositoryView = {
    /**
     * Render all repositories into the repository list.
     *
     * @param {HTMLElement} container
     * @param {Array} repositoryData
     */
    render(container, repositoryData) {
        if (!container) {
            return;
        }

        container.innerHTML = "";

        if (!Array.isArray(repositoryData) || repositoryData.length === 0) {
            this.renderEmptyState(container);
            return;
        }

        const fragment = document.createDocumentFragment();

        repositoryData.forEach((repository) => {
            fragment.appendChild(
                this.createCard(repository)
            );
        });

        container.appendChild(fragment);
    },

    /**
     * Create a repository card.
     *
     * @param {Object} repository
     * @returns {HTMLElement}
     */
    createCard(repository) {
        const card = App.createElement("a", "repository-card");

        card.href = this.getRepositoryURL(repository);

        card.setAttribute(
            "aria-label",
            `Open ${repository.name} repository`
        );

        const icon = App.createElement(
            "div",
            "repository-card-icon"
        );

        icon.setAttribute("aria-hidden", "true");
        icon.textContent = repository.icon || "EH";

        const content = App.createElement(
            "div",
            "repository-card-content"
        );

        const heading = App.createElement(
            "div",
            "repository-card-heading"
        );

        const name = App.createElement(
            "h3",
            "repository-card-name"
        );

        name.textContent = repository.name;

        const type = App.createElement(
            "span",
            "repository-card-type"
        );

        type.textContent = repository.type || "Repository";

        heading.appendChild(name);
        heading.appendChild(type);

        const description = App.createElement(
            "p",
            "repository-card-description"
        );

        description.textContent =
            repository.description || "";

        const meta = App.createElement(
            "div",
            "repository-card-meta"
        );

        const extensionCount = App.createElement(
            "span",
            "repository-card-count"
        );

        const count = Array.isArray(repository.extensions)
            ? repository.extensions.length
            : 0;

        extensionCount.textContent =
            `${count} ${count === 1 ? "extension" : "extensions"}`;

        const arrow = App.createElement(
            "span",
            "repository-card-arrow"
        );

        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "→";

        meta.appendChild(extensionCount);

        content.appendChild(heading);
        content.appendChild(description);
        content.appendChild(meta);

        card.appendChild(icon);
        card.appendChild(content);
        card.appendChild(arrow);

        return card;
    },

    /**
     * Build the internal repository page URL.
     *
     * @param {Object} repository
     * @returns {string}
     */
    getRepositoryURL(repository) {
        return `repository.html?id=${encodeURIComponent(repository.id)}`;
    },

    /**
     * Render a fallback when no repositories are available.
     *
     * @param {HTMLElement} container
     */
    renderEmptyState(container) {
        const state = App.createElement(
            "div",
            "repository-empty"
        );

        const title = App.createElement(
            "h3"
        );

        title.textContent = "No repositories available";

        const description = App.createElement(
            "p"
        );

        description.textContent =
            "There are currently no repositories configured.";

        state.appendChild(title);
        state.appendChild(description);

        container.appendChild(state);
    }
};
