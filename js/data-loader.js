"use strict";

const DataLoader = {
  toURL(source) {
    return source.startsWith("cloudstreamrepo://")
      ? source.replace("cloudstreamrepo://", "https://")
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

    if (fallback) {
      try { return await this.fetchURL(fallback); }
      catch { return await this.fetchURL(url); }
    }

    return this.fetchURL(url);
  },

  parse(text) {
    try { return JSON.parse(text.trim()); }
    catch { return null; }
  },

  normalize(item = {}, source = "") {
    const languages = item.languages || item.lang || [];
    const nested = Array.isArray(item.sources) ? item.sources : [];

    return {
      id: item.id || item.pkg || item.packageName || item.internalName || item.name || crypto.randomUUID(),
      name: item.name || item.title || item.pkg || "Unnamed extension",
      version: item.version || item.versionName || "",
      description: item.description || item.desc || item.about || "",
      icon: item.icon || item.logo || item.iconUrl || "EX",
      languages: Array.isArray(languages) ? languages : [languages],
      url: item.url || item.website || item.repo || nested[0]?.baseUrl || "",
      packageName: item.pkg || item.packageName || "",
      apk: item.apk || "",
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

    if (Array.isArray(data.plugins)) {
      results.push(
        ...data.plugins.map(item => this.normalize(item, source))
      );
    }

    return results;
  },

  async loadRepository(repository) {
    const results = await Promise.allSettled(
      repository.sources.map(source => this.fetchSource(source))
    );

    const extensions = [];

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status !== "fulfilled") continue;

      const source = repository.sources[i];
      const data = this.parse(result.value.text);

      if (data) {
        extensions.push(
          ...await this.extract(data, source)
        );
      }
    }

    repository.extensions = this.unique(extensions);
    return repository.extensions;
  },

  unique(items) {
    const seen = new Set();

    return items.filter(item => {
      const key = item.packageName || item.id || `${item.name}:${item.url}`;
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
