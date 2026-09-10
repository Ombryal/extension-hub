"use strict";

const DataLoader = {
  toURL(source) {
    return source.startsWith("cloudstreamrepo://")
      ? source.replace("cloudstreamrepo://", "https://")
      : source;
  },

  getJSONFallback(source) {
    if (!source.endsWith("index.pb")) return null;
    return source.replace(/index\.pb$/, "index.min.json");
  },

  async fetchURL(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { url, text: await response.text() };
  },

  async fetchSource(source) {
    const url = this.toURL(source);
    const fallback = this.getJSONFallback(url);

    if (fallback) {
      try {
        return await this.fetchURL(fallback);
      } catch {
        return await this.fetchURL(url);
      }
    }

    return await this.fetchURL(url);
  },

  parse(text) {
    const value = text.trim();

    try {
      return { format: "json", data: JSON.parse(value) };
    } catch {
      return { format: "text", raw: value };
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

    const items = Array.isArray(data)
      ? data
      : data.extensions || data.sources || data.providers || data.entries || [];

    return Array.isArray(items)
      ? items.map(item => this.normalize(item, source))
      : [];
  },

  async loadRepository(repository) {
    const results = await Promise.allSettled(
      repository.sources.map(source => this.fetchSource(source))
    );

    const extensions = [];

    results.forEach((result, index) => {
      if (result.status !== "fulfilled") return;

      const source = repository.sources[index];
      const parsed = this.parse(result.value.text);

      if (parsed.format === "json") {
        extensions.push(...this.extractJSON(parsed.data, source));
      }
    });

    repository.extensions = this.unique(extensions);
    return repository.extensions;
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
    await Promise.allSettled(
      repositories.map(repository => this.loadRepository(repository))
    );

    return repositories;
  }
};
