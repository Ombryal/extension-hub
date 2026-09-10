"use strict";

const repositories = [
  {
    id: "cloudstream",
    name: "Cloudstream",
    description: "Extensions for Cloudstream and compatible streaming sources.",
    type: "Streaming",
    icon: "CS",
    accent: "neutral",
    source: { owner: "", name: "", branch: "main" },
    url: "",
    homepage: "",
    extensions: extensionData.cloudstream
  },
  {
    id: "mihon",
    name: "Mihon",
    description: "Extensions for Mihon and compatible manga sources.",
    type: "Manga",
    icon: "MI",
    accent: "neutral",
    source: { owner: "", name: "", branch: "main" },
    url: "",
    homepage: "",
    extensions: extensionData.mihon
  },
  {
    id: "aniyomi",
    name: "Aniyomi",
    description: "Extensions for Aniyomi and compatible anime sources.",
    type: "Anime",
    icon: "AN",
    accent: "neutral",
    source: { owner: "", name: "", branch: "main" },
    url: "",
    homepage: "",
    extensions: extensionData.aniyomi
  }
];

const repositoryConfig = { version: 1, repositories };
