"use strict";

const DataLoader = {
  toURL(source) {
    return source.startsWith("cloudstreamrepo://")
      ? source.slice("cloudstreamrepo://".length)
      : source;
  },

  getJSONFallback(source) {
    return source.endsWith("index.pb")
      ? source.replace(/index\.pb$/, "index.min.json")
      : null;
  },

  async fetchURL(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { url, text: await response.text() };
  },

  async fetchSource(source) {
    const url = this.toURL(source);
    const fallback = this.getJSONFallback(url);

    if (!fallback) return this.fetchURL(url);

    try {
      return await this.fetchURL(fallback);
    } catch {
      return this.fetchURL(url);
    }
  },

  parse(text) {
    try {
      return JSON.parse(text.trim());
    } catch {
      return null;
    }
  },

  normalize(item = {}, source = "") {
    const languages = item.languages || item.language || item.lang || [];
    const authors = item.authors || item.author || [];
    const sources = Array.isArray(item.sources) ? item.sources : [];

    return {
      id: item.id || item.pkg || item.packageName || item.internalName || item.name || crypto.randomUUID(),
      name: item.name || item.title || item.pkg || "Unnamed extension",
      version: item.version || item.versionName || "",
      description: item.description || item.desc || item.about || "",
      icon: item.icon || item.iconUrl || item.logo || "EX",
      languages: Array.isArray(languages) ? languages : [languages],
      authors: Array.isArray(authors) ? authors : [authors],
      url: item.url || item.website || item.repositoryUrl || sources[0]?.baseUrl || "",
      packageName: item.pkg || item.packageName || "",
      internalName: item.internalName || "",
      apk: item.apk || "",
      tvTypes: Array.isArray(item.tvTypes) ? item.tvTypes : [],
      status: Number.isFinite(item.status) ? item.status : null,
      nsfw: Boolean(item.nsfw),
      source
    };
  },

  async extract(data, source) {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data.map(item => this.normalize(item, source));
    }

    const results = [];
    const items = data.extensions || data.sources || data.providers || data.entries;

    if (Array.isArray(items)) {
      results.push(...items.map(item => this.normalize(item, source)));
    }

    if (Array.isArray(data.plugins)) {
      results.push(...data.plugins.map(item => this.normalize(item, source)));
    }

    if (Array.isArray(data.pluginLists)) {
      const nested = await Promise.allSettled(
        data.pluginLists.map(url => this.fetchSource(url))
      );

      for (const result of nested) {
        if (result.status !== "fulfilled") continue;

        const parsed = this.parse(result.value.text);
        results.push(...await this.extract(parsed, result.value.url));
      }
    }

    return results;
  },

  async loadRepository(repository) {
    repository.sourceStatus = [];

    const results = await Promise.allSettled(
      repository.sources.map(source => this.fetchSource(source))
    );

    const extensions = [];

    for (let i = 0; i < results.length; i++) {
      const source = repository.sources[i];
      const result = results[i];

      if (result.status !== "fulfilled") {
        repository.sourceStatus.push({
          source,
          status: "error",
          error: result.reason?.message || "Failed to load source"
        });
        continue;
      }

      repository.sourceStatus.push({
        source,
        status: "online",
        url: result.value.url
      });

      const data = this.parse(result.value.text);
      if (data) extensions.push(...await this.extract(data, source));
    }

    repository.extensions = this.unique(extensions);
    return repository.extensions;
  },

  unique(items) {
    const seen = new Set();

    return items.filter(item => {
      const key = item.packageName || item.internalName || item.id || `${item.name}:${item.url}`;
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
