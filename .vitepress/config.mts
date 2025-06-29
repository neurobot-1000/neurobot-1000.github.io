import { defineConfig } from "vitepress";
import { buildBldcModelingSidebar, buildFreecadGearboxGeneratorSidebar, buildPcbDesignSidebar, buildToolsSidebar, buildWikiSidebar } from "../scripts/buildSidebars.mts";
import { buildPackagesNavbar, buildPcbDesignNavbar, buildToolsNavbar } from "../scripts/buildNavbars.mts";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Neurobot-1000",
  description: "Our cute AI overlord, given physical form",
  srcDir: "packages",
  rewrites: {
    "pcb-design/:board/docs/:slug": "boards/:board/:slug",
    "wiki/:category/:slug": "wiki/:slug",
    "wiki/": "wiki/",
    "tools/:slug": "tools/:slug",
    "bldc-modeling/docs/:slug": "bldc/:slug",
    ":pkg/docs/:slug": ":pkg/:slug",
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Wiki", link: "/wiki" },
      { text: "Tools", items: buildToolsNavbar() },
      { text: "Packages", items: buildPackagesNavbar() },
      { text: "Boards", items: buildPcbDesignNavbar() },
      { text: "BLDC", link: "/bldc" },
      { text: "Contributing", link: "/contributing" },
    ],

    sidebar: {
      "/tools": buildToolsSidebar(),
      "/wiki": buildWikiSidebar(),
      "/boards": buildPcbDesignSidebar(),
      "/freecad-gearbox-generator": buildFreecadGearboxGeneratorSidebar(),
      "/bldc": buildBldcModelingSidebar(),
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/neurobot-1000" },
      { icon: "discord", link: "https://discord.gg/MZPyedT" },
    ],
  },
  markdown: {
    math: true,
  },
});
