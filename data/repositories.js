"use strict";

/**
 * Extension Hub repository configuration.
 *
 * Each repository is represented by a single object so the UI can
 * remain completely data-driven as more repositories are added.
 *
 * The `extensions` value is populated by the repository-specific
 * data layer in later commits.
 */

const repositories = [
    {
        id: "cloudstream",
        name: "Cloudstream",
        description:
            "Extensions for Cloudstream and compatible streaming sources.",
        type: "Streaming",
        icon: "CS",
        accent: "neutral",
        source: {
            owner: "",
            name: "",
            branch: "main"
        },
        extensions: []
    },

    {
        id: "mihon",
        name: "Mihon",
        description:
            "Extensions for Mihon and compatible manga sources.",
        type: "Manga",
        icon: "MI",
        accent: "neutral",
        source: {
            owner: "",
            name: "",
            branch: "main"
        },
        extensions: []
    },

    {
        id: "aniyomi",
        name: "Aniyomi",
        description:
            "Extensions for Aniyomi and compatible anime sources.",
        type: "Anime",
        icon: "AN",
        accent: "neutral",
        source: {
            owner: "",
            name: "",
            branch: "main"
        },
        extensions: []
    }
];

const repositoryConfig = {
    version: 1,
    repositories
};
