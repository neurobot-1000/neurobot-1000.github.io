import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

interface NavItem {
  text: string;
  link: string;
}

function formatTitle(name: string): string {
  // Convert kebab-case and snake_case to Title Case
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Tools navbar
export function buildToolsNavbar(): NavItem[] {
  const toolsDir = join(process.cwd(), 'packages', 'tools');
  const items: NavItem[] = [];

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
    console.warn('Error reading tools directory for navbar:', error);
  }

  return items;
}

// Packages navbar (returns array of nav items for dropdown)
export function buildPackagesNavbar(): NavItem[] {
  const items: NavItem[] = [];

  // Add individual packages
  items.push({
    text: 'FreeCAD Gearbox Generator',
    link: '/freecad-gearbox-generator/'
  });

  return items;
}

// PCB Design navbar (returns array of board nav items excluding library)
export function buildPcbDesignNavbar(): NavItem[] {
  const pcbDesignDir = join(process.cwd(), 'packages', 'pcb-design');
  const items: NavItem[] = [];

  if (!existsSync(pcbDesignDir)) {
    return items;
  }

  try {
    const entries = readdirSync(pcbDesignDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory() || entry.name === 'library') continue;

      const boardPath = join(pcbDesignDir, entry.name);
      const docsPath = join(boardPath, 'docs');

      if (existsSync(docsPath)) {
        items.push({
          text: formatTitle(entry.name),
          link: `/boards/${entry.name}/`
        });
      }
    }
  } catch (error) {
    console.warn('Error reading pcb-design directory for navbar:', error);
  }

  return items;
}
