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

// Helper function to read meta.json files
function readMetaJson(dirPath: string): { name?: string } | null {
  try {
    const metaPath = join(dirPath, 'meta.json');
    if (!existsSync(metaPath)) {
      return null;
    }
    const metaContent = readFileSync(metaPath, 'utf8');
    return JSON.parse(metaContent);
  } catch (error) {
    console.warn(`Error reading meta.json at ${dirPath}:`, error);
    return null;
  }
}

// Helper function to extract title from frontmatter or fallback to filename
function extractTitle(filePath: string, fileName: string): string {
  try {
    const content = readFileSync(filePath, 'utf8');

    // Parse frontmatter using gray-matter
    const parsed = matter(content);

    // Return title from frontmatter if it exists
    if (parsed.data?.title) {
      return parsed.data.title;
    }

    // Fallback to formatted filename
    return formatTitle(fileName);
  } catch (error) {
    console.warn(`Error reading frontmatter from ${filePath}:`, error);
    return formatTitle(fileName);
  }
}

// Wiki sidebar - organized by folders with meta.json
export function buildWikiSidebar(): SidebarItem[] {
  const wikiDir = join(process.cwd(), 'packages', 'wiki');
  const items: SidebarItem[] = [];

  if (!existsSync(wikiDir)) {
    return items;
  }

  try {
    const entries = readdirSync(wikiDir, { withFileTypes: true });

    // Sort directories first
    entries.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const categoryPath = join(wikiDir, entry.name);
        const meta = readMetaJson(categoryPath);
        const categoryName = meta?.name || formatTitle(entry.name);

        // Get all markdown files in this category
        const categoryItems: SidebarItem[] = [];

        try {
          const categoryEntries = readdirSync(categoryPath, { withFileTypes: true });

          for (const categoryEntry of categoryEntries) {
            if (categoryEntry.isFile() && categoryEntry.name.endsWith('.md')) {
              const fileName = categoryEntry.name.replace('.md', '');
              const filePath = join(categoryPath, categoryEntry.name);
              const title = extractTitle(filePath, fileName);

              categoryItems.push({
                text: title,
                link: `/wiki/${fileName}`
              });
            }
          }

          // Sort category items alphabetically
          categoryItems.sort((a, b) => a.text.localeCompare(b.text));

          if (categoryItems.length > 0) {
            items.push({
              text: categoryName,
              items: categoryItems
            });
          }

        } catch (error) {
          console.warn(`Error reading wiki category ${entry.name}:`, error);
        }
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
