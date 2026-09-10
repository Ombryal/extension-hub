"use strict";

const repositories = [
  {
    id: "cloudstream",
    name: "Cloudstream",
    description: "Extensions for Cloudstream and compatible streaming sources.",
    type: "Streaming",
    icon: "CS",
    accent: "neutral",
    sources: [
      "cloudstreamrepo://raw.githubusercontent.com/recloudstream/extensions/master/repo.json",
      "cloudstreamrepo://raw.githubusercontent.com/SaurabhKaperwan/CSX/builds/CS.json",
      "cloudstreamrepo://raw.githubusercontent.com/Abodabodd/re-3arabi/refs/heads/main/repo",
      "cloudstreamrepo://raw.githubusercontent.com/TeKuma25/IndoStream/builds/repo.json",
      "cloudstreamrepo://raw.githubusercontent.com/Asm0d3usX/CloudX/builds/repo.json",
      "cloudstreamrepo://raw.githubusercontent.com/doGior/doGiorsHadEnough/refs/heads/builds/repo.json",
      "cloudstreamrepo://pastebin.com/raw/qndZtL6D",
      "cloudstreamrepo://raw.githubusercontent.com/Kraptor123/cs-Karma/refs/heads/master/repo.json",
      "https://codeberg.org/CakesTwix/cloudstream-extensions-uk/raw/branch/master/repo.json",
      "cloudstreamrepo://raw.githubusercontent.com/Gian-Fr/ItalianProvider/builds/repo.json",
      "cloudstreamrepo://raw.githubusercontent.com/Reflex755/ReflexRepo/refs/heads/builds/repo.json",
      "cloudstreamrepo://raw.githubusercontent.com/redowan99/Redowan-CloudStream/master/repo.json",
      "cloudstreamrepo://raw.githubusercontent.com/Bnyro/GermanProviders/refs/heads/master/repo.json",
      "cloudstreamrepo://raw.githubusercontent.com/Luna712/Luna712-CloudStream-Extensions/28885d17ceb7f24782b732b6056085c14c1fd027/repo.json",
      "cloudstreamrepo://raw.githubusercontent.com/lawlietbr/lietrepo/refs/heads/main/builds/repo.json",
      "cloudstreamrepo://raw.githubusercontent.com/phisher98/cloudstream-extensions-phisher/refs/heads/builds/repo.json",
      "cloudstreamrepo://raw.githubusercontent.com/NivinCNC/CNCVerse-Cloud-Stream-Extension/refs/heads/builds/CNC.json",
      "cloudstreamrepo://raw.githubusercontent.com/saimuelbr/saimuelrepo/refs/heads/main/builds/repo.json",
      "cloudstreamrepo://gitlab.com/tearrs/cloudstream-vietnamese/-/raw/main/repo.json"
    ],
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
    sources: [
      "https://raw.githubusercontent.com/keiyoushi/extensions/repo/index.pb",
      "https://raw.githubusercontent.com/mojuru/cursed-manga-repo/repo/index.pb",
      "https://raw.githubusercontent.com/Kareadita/tach-extension/repo/index.min.json",
      "https://raw.githubusercontent.com/Suwayomi/tachiyomi-extension/repo/index.min.json",
      "https://raw.githubusercontent.com/FelipeGFA/extensoes/refs/heads/repo/index.pb",
      "https://raw.githubusercontent.com/LittleSurvival/copymanga-copy20/repo/index.min.json"
    ],
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
    sources: [
      "https://raw.githubusercontent.com/yuzono/anime-repo/repo/index.min.json",
      "https://raw.githubusercontent.com/Secozzi/aniyomi-extensions/refs/heads/repo/index.min.json",
      "https://raw.githubusercontent.com/Claudemirovsky/cursedyomi-extensions/repo/index.min.json",
      "https://codeberg.org/hollow/aniyomi-extensions-fr/media/branch/repo/index.min.json"
    ],
    url: "",
    homepage: "",
    extensions: extensionData.aniyomi
  }
];

const repositoryConfig = { version: 1, repositories };
