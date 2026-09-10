"use strict";

const DataLoader = {
  toURL(source) {
    return source.startsWith("cloudstreamrepo://")
      ? source.replace("cloudstreamrepo://", "https://")
      : source;
  },

  async fetchSource(source) {
    const url = this.toURL(source);
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return {
      url,
      text: await response.text()
    };
  },

  parse(text, source) {
    const trimmed = text.trim();
    const isPB = source.endsWith(".pb");

    if (isPB) {
      return {
        format: "protobuf",
        raw: trimmed
      };
    }

    try {
      return {
        format: "json",
        data: JSON.parse(trimmed)
      };
    } catch {
      return {
        format: "text",
        raw: trimmed
      };
    }
  },

  normalize(item = {}, source = "") {
    return {
      id: item.id || item.pkg || item.packageName || item.name || crypto.randomUUID(),
      name: item.name || item.title || item.pkg || "Unnamed extension",
      version: item.version || item.versionName || "",
      description: item.description || item.desc || "",
      icon: item.icon || item.logo || "EX",
      languages: Array.isArray(item.languages) ? item.languages : [],
      url: item.url || item.website || "",
      source
    };
  },

  extractJSON(data, source) {
    if (!data) return [];

    const items =
      Array.isArray(data) ? data :
      Array.isArray(data.extensions) ? data.extensions :
      Array.isArray(data.sources) ? data.sources :
      Array.isArray(data.providers) ? data.providers :
      Array.isArray(data.entries) ? data.entries :
      [];

    return items.map(item => this.normalize(item, source));
  },

  async loadRepository(repository) {
    const results = await Promise.allSettled(
      repository.sources.map(source => this.fetchSource(source))
    );

    const extensions = [];

    results.forEach((result, index) => {
      if (result.status !== "fulfilled") return;

      const source = repository.sources[index];
      const parsed = this.parse(result.value.text, source);

      if (parsed.format === "json") {
        extensions.push(...this.extractJSON(parsed.data, source));
      }
    });

    return this.unique(extensions);
  },

  unique(items) {
    const seen = new Set();

    return items.filter(item => {
      const key = item.id || `${item.name}:${item.url}`;

      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    });
  },

  async loadAll() {
    const results = await Promise.all(
      repositories.map(async repository => ({
        id: repository.id,
        extensions: await this.loadRepository(repository)
      }))
    );

    results.forEach(result => {
      const repository = repositories.find(item => item.id === result.id);

      if (repository) {
        repository.extensions = result.extensions;
      }
    });

    return repositories;
  }
};
