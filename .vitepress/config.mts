import { defineConfig } from "vitepress";
import { buildBldcModelingSidebar, buildFreecadGearboxGeneratorSidebar, buildPcbDesignSidebar, buildToolsSidebar } from "../scripts/buildSidebars.mts";
import { buildPackagesNavbar, buildPcbDesignNavbar, buildToolsNavbar } from "../scripts/buildNavbars.mts";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Neurobot-1000",
  description: "Our cute AI overlord, given physical form",
  srcDir: "packages",
  rewrites: {
    "pcb-design/:board/docs/:slug": "boards/:board/:slug",
    "tools/:slug": "tools/:slug",
    "bldc-modeling/docs/:slug": "bldc/:slug",
    ":pkg/docs/:slug": ":pkg/:slug",
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Wiki", link: "/wiki" },
      { text: "Tools", items: buildToolsNavbar() },
      { text: "Packages", items: buildPackagesNavbar() },
      { text: "Boards", items: buildPcbDesignNavbar() },
      { text: "BLDC", link: "/bldc" },
      { text: "Contributing", link: "/contributing" },
    ],

    sidebar: {
      "/tools": buildToolsSidebar(),
      "/wiki": [
        {
          text: "General",
          items: [
            { text: "Overview", link: "/wiki" },
            { text: "Safety Training", link: "/wiki/safety-training" },
          ],
        },
        {
          text: "Electro-Mechanical System",
          items: [
            { text: "Artificial Muscles", link: "/wiki/artificial-muscles" },
            { text: "Hands", link: "/wiki/hands" },
            { text: "Brushless Motors", link: "/wiki/brushless-motors" },
            { text: "Energy Storage", link: "/wiki/energy-storage" },
          ],
        },
        {
          text: "Sensory Input",
          items: [
            { text: "Eyes", link: "/wiki/eyes" },
            { text: "Touch", link: "/wiki/touch-sensors" },
          ],
        },
        {
          text: "Manufacturing",
          items: [
            {
              text: "Multi-material 3D printing",
              link: "/wiki/multi-material-3d-printing",
            },
          ],
        },
      ],
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
