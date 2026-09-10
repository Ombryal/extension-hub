"use strict";

/*
 * Extension Hub
 * Application entry point
 *
 * Repository data and UI rendering will be added in later commits.
 * This file currently provides the application foundation and
 * shared utility functions that will be reused by the directory.
 */

const App = {
    /**
     * Escape user or repository-provided text before inserting it
     * into HTML.
     *
     * @param {string} value
     * @returns {string}
     */
    escapeHTML(value) {
        const element = document.createElement("div");

        element.textContent = String(value ?? "");

        return element.innerHTML;
    },

    /**
     * Return a DOM element by selector.
     *
     * @param {string} selector
     * @param {ParentNode} root
     * @returns {Element|null}
     */
    select(selector, root = document) {
        return root.querySelector(selector);
    },

    /**
     * Create a DOM element with optional class names.
     *
     * @param {string} tag
     * @param {string|string[]} classes
     * @returns {HTMLElement}
     */
    createElement(tag, classes = []) {
        const element = document.createElement(tag);

        const classList = Array.isArray(classes)
            ? classes
            : [classes];

        classList
            .filter(Boolean)
            .forEach((className) => {
                element.classList.add(className);
            });

        return element;
    },

    /**
     * Initialize the application.
     */
    init() {
        const repositoryList = this.select("#repository-list");

        if (!repositoryList) {
            return;
        }

        repositoryList.dataset.initialized = "true";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    App.init();
});
