"use strict";

const ExtensionFilters = {
  extensions: [],
  search: "",
  language: "all",

  init(extensions) {
    this.extensions = Array.isArray(extensions) ? extensions : [];

    const search = App.select("#extension-search");
    const filter = App.select("#extension-filter");

    if (!search || !filter) return;

    this.populateLanguages(filter);

    search.addEventListener("input", e => {
      this.search = e.target.value.trim().toLowerCase();
      this.update();
    });

    filter.addEventListener("change", e => {
      this.language = e.target.value;
      this.update();
    });

    this.update();
  },

  populateLanguages(filter) {
    const languages = [...new Set(
      this.extensions.flatMap(extension =>
        Array.isArray(extension.languages)
          ? extension.languages
          : []
      )
    )].filter(Boolean).sort((a, b) => a.localeCompare(b));

    languages.forEach(language => {
      const option = document.createElement("option");
      option.value = language;
      option.textContent = language;
      filter.appendChild(option);
    });
  },

  matches(extension) {
    const text = [
      extension.name,
      extension.description,
      extension.packageName,
      ...(extension.languages || [])
    ].join(" ").toLowerCase();

    const matchesSearch = !this.search || text.includes(this.search);
    const matchesLanguage =
      this.language === "all" ||
      (extension.languages || []).includes(this.language);

    return matchesSearch && matchesLanguage;
  },

  update() {
    const filtered = this.extensions.filter(extension => this.matches(extension));
    const list = App.select("#extension-list");
    const results = App.select("#filter-results");

    if (!list) return;

    ExtensionView.render(list, filtered);

    if (results) {
      results.textContent = `${filtered.length} of ${this.extensions.length} ${
        this.extensions.length === 1 ? "extension" : "extensions"
      }`;
    }
  }
};
