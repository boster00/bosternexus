/**
 * Application Modules Configuration
 * 
 * This file manages all available modules/functions in the application.
 * Modules are displayed in the admin dashboard and can be bookmarked by users.
 */

export const modules = [
  {
    id: 'freezer',
    name: 'Freezer Rack Label Printer',
    path: '/freezer',
    description: 'Generate and print freezer storage labels with SKU information and space allocation',
    icon: '🧊', // Optional icon
  },
  {
    id: 'zoho-test',
    name: 'API Playground',
    path: '/zoho-test',
    description: 'Test and manage Zoho API connections, sync historical data, and calculate inventory reorder levels',
    icon: '🔧',
  },
  {
    id: 'webpage-editor',
    name: 'Webpage Editor',
    path: '/webpage-editor',
    description: 'Edit and manage webpage content',
    icon: '📝',
  },
];

/**
 * Get module by ID
 */
export function getModuleById(id) {
  return modules.find(module => module.id === id);
}

/**
 * Get module by path
 */
export function getModuleByPath(path) {
  return modules.find(module => module.path === path);
}

/**
 * Get all module IDs
 */
export function getAllModuleIds() {
  return modules.map(module => module.id);
}
