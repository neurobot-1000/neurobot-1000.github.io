// biome-ignore assist/source/organizeImports: <Why do we need to organize our imports if they're all at top level lmfao>
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
}

interface SidebarConfig {
  [path: string]: SidebarItem[];
}

// Helper function for building docs structure from a docs folder
function buildDocsStructure(docsPath: string, basePath: string): SidebarItem[] {
  const items: SidebarItem[] = [];

  try {
    const entries = readdirSync(docsPath, { withFileTypes: true });

    // Sort entries: directories first, then files
    entries.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    for (const entry of entries) {
      const entryPath = join(docsPath, entry.name);

      if (entry.isDirectory()) {
        // Handle subdirectories
        const subItems = buildDirectoryStructure(entryPath, `${basePath}/${entry.name}`);
        if (subItems.length > 0) {
          items.push({
            text: formatTitle(entry.name),
            items: subItems
          });
        }
      } else if (entry.name.endsWith('.md')) {
        // Handle markdown files
        const fileName = entry.name.replace('.md', '');
        const link = fileName === 'index'
          ? `${basePath}/`
          : `${basePath}/${fileName}`;

        items.push({
          text: formatTitle(fileName),
          link
        });
      }
    }
  } catch (error) {
    console.warn(`Error reading docs directory at ${docsPath}:`, error);
  }

  return items;
}

function buildDirectoryStructure(dirPath: string, basePath: string): SidebarItem[] {
  const items: SidebarItem[] = [];

  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });

    entries.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subItems = buildDirectoryStructure(
          join(dirPath, entry.name),
          `${basePath}/${entry.name}`
        );
        if (subItems.length > 0) {
          items.push({
            text: formatTitle(entry.name),
            items: subItems
          });
        }
      } else if (entry.name.endsWith('.md')) {
        const fileName = entry.name.replace('.md', '');
        const link = fileName === 'index'
          ? `${basePath}/`
          : `${basePath}/${fileName}`;

        items.push({
          text: formatTitle(fileName),
          link
        });
      }
    }
  } catch (error) {
    console.warn(`Error reading directory ${dirPath}:`, error);
  }

  return items;
}

function formatTitle(name: string): string {
  // Convert kebab-case and snake_case to Title Case
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Helper function to extract title and category from frontmatter
function extractFrontmatter(filePath: string, fileName: string): { title: string; category?: string } {
  try {
    const content = readFileSync(filePath, 'utf8');

    // Parse frontmatter using gray-matter
    const parsed = matter(content);

    const title = parsed.data?.title || formatTitle(fileName);
    const category = parsed.data?.category || undefined;

    return { title, category };
  } catch (error) {
    console.warn(`Error reading frontmatter from ${filePath}:`, error);
    return { title: formatTitle(fileName) };
  }
}

// Wiki sidebar - organized by category frontmatter
export function buildWikiSidebar(): SidebarItem[] {
  const wikiDir = join(process.cwd(), 'packages', 'wiki');
  const items: SidebarItem[] = [];

  if (!existsSync(wikiDir)) {
    return items;
  }

  try {
    const entries = readdirSync(wikiDir, { withFileTypes: true });

    // Collect all pages with their frontmatter
    const pages: { fileName: string; title: string; category?: string }[] = [];

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        const fileName = entry.name.replace('.md', '');
        const filePath = join(wikiDir, entry.name);
        const { title, category } = extractFrontmatter(filePath, fileName);

        pages.push({ fileName, title, category });
      }
    }

    // Group pages by category
    const categoryGroups = new Map<string | undefined, typeof pages>();

    for (const page of pages) {
      const category = page.category;
      const group = categoryGroups.get(category) ?? [];
      if (group.length === 0) {
        categoryGroups.set(category, group);
      }
      group.push(page);
      categoryGroups.set(category, group);
    }

    // Add top-level pages first (category is undefined)
    const topLevelPages = categoryGroups.get(undefined) || [];
    for (const page of topLevelPages.sort((a, b) => a.title.localeCompare(b.title))) {
      items.push({
        text: page.title,
        link: `/wiki/${page.fileName}`
      });
    }

    // Add categorized pages
    const sortedCategories = Array.from(categoryGroups.keys())
      .filter((category): category is string => category !== undefined)
      .sort((a, b) => (a || '').localeCompare(b || ''));

    for (const category of sortedCategories) {
      const categoryPages = categoryGroups.get(category) ?? [];

      if (categoryPages.length > 0) {
        const categoryItems: SidebarItem[] = [];

        for (const page of categoryPages.sort((a, b) => a.title.localeCompare(b.title))) {
          categoryItems.push({
            text: page.title,
            link: `/wiki/${page.fileName}`
          });
        }

        items.push({
          text: category,
          items: categoryItems
        });
      }
    }

  } catch (error) {
    console.warn('Error reading wiki directory:', error);
  }

  return items;
}

// Tools sidebar
export function buildToolsSidebar(): SidebarItem[] {
  const toolsDir = join(process.cwd(), 'packages', 'tools');
  const items: SidebarItem[] = [];

  if (!existsSync(toolsDir)) {
    return items;
  }

  try {
    const entries = readdirSync(toolsDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        const fileName = entry.name.replace('.md', '');
        items.push({
          text: formatTitle(fileName),
          link: `/tools/${fileName}`
        });
      }
    }
  } catch (error) {
    console.warn('Error reading tools directory:', error);
  }

  return items;
}

// PCB Design sidebar (returns a single array with all boards except library)
export function buildPcbDesignSidebar(): SidebarItem[] {
  const pcbDesignDir = join(process.cwd(), 'packages', 'pcb-design');
  const items: SidebarItem[] = [];

  if (!existsSync(pcbDesignDir)) {
    return items;
  }

  try {
    const entries = readdirSync(pcbDesignDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const boardName = entry.name;

      // Skip the library folder as it doesn't have docs
      if (boardName === 'library') {
        continue;
      }

      const boardPath = join(pcbDesignDir, boardName);
      const docsPath = join(boardPath, 'docs');

      // Only process boards that have a docs folder
      if (!existsSync(docsPath)) {
        continue;
      }

      const boardDocs = buildDocsStructure(docsPath, `/boards/${boardName}`);
      if (boardDocs.length > 0) {
        items.push({
          text: formatTitle(boardName),
          items: boardDocs
        });
      }
    }
  } catch (error) {
    console.warn('Error reading pcb-design directory:', error);
  }

  return items;
}

// BLDC Modeling sidebar
export function buildBldcModelingSidebar(): SidebarItem[] {
  const packageDir = join(process.cwd(), 'packages', 'bldc-modeling');
  const docsPath = join(packageDir, 'docs');

  if (!existsSync(docsPath)) {
    return [];
  }

  return buildDocsStructure(docsPath, '/bldc-modeling');
}

// FreeCAD Gearbox Generator sidebar
export function buildFreecadGearboxGeneratorSidebar(): SidebarItem[] {
  const packageDir = join(process.cwd(), 'packages', 'freecad-gearbox-generator');
  const docsPath = join(packageDir, 'docs');

  if (!existsSync(docsPath)) {
    return [];
  }

  return buildDocsStructure(docsPath, '/freecad-gearbox-generator');
}

// Contributing sidebar - files are directly in the contributing folder
export function buildContributingSidebar(): SidebarItem[] {
  const contributingDir = join(process.cwd(), 'packages', 'contributing');
  const items: SidebarItem[] = [];

  if (!existsSync(contributingDir)) {
    return items;
  }

  try {
    const entries = readdirSync(contributingDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile() && entry.name.endsWith('.md')) {
        const fileName = entry.name.replace('.md', '');
        const link = fileName === 'index'
          ? '/contributing/'
          : `/contributing/${fileName}`;

        items.push({
          text: formatTitle(fileName),
          link
        });
      }
    }
  } catch (error) {
    console.warn('Error reading contributing directory:', error);
  }

  return items;
}

// Main function to build all package sidebars
export function buildPackagesSidebar(): SidebarConfig {
  const sidebar: SidebarConfig = {};

  // Add individual package sidebars
  const bldcModelingSidebar = buildBldcModelingSidebar();
  if (bldcModelingSidebar.length > 0) {
    sidebar['/bldc-modeling'] = bldcModelingSidebar;
  }

  const freecadGearboxSidebar = buildFreecadGearboxGeneratorSidebar();
  if (freecadGearboxSidebar.length > 0) {
    sidebar['/freecad-gearbox-generator'] = freecadGearboxSidebar;
  }

  // Add PCB design sidebars
  const pcbDesignSidebars = buildPcbDesignSidebar();
  Object.assign(sidebar, pcbDesignSidebars);

  // Tools sidebar
  const toolsSidebar = buildToolsSidebar();
  if (toolsSidebar.length > 0) {
    sidebar['/tools'] = toolsSidebar;
  }

  // Wiki sidebar
  const wikiSidebar = buildWikiSidebar();
  if (wikiSidebar.length > 0) {
    sidebar['/wiki'] = wikiSidebar;
  }

  // Contributing sidebar
  const contributingSidebar = buildContributingSidebar();
  if (contributingSidebar.length > 0) {
    sidebar['/contributing'] = contributingSidebar;
  }

  return sidebar;
}
