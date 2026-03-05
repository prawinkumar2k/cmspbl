// Migration helper script to extract menu items from your current sidebar
// Run this in browser console on a page with your current sidebar to extract menu structure

function extractSidebarStructure() {
  const menuItems = [];
  const sidebar = document.querySelector('.sidebar-menu');
  
  if (!sidebar) {
    console.log('Sidebar not found');
    return;
  }
  
  const items = sidebar.querySelectorAll('li');
  
  items.forEach((item, index) => {
    const link = item.querySelector('a');
    if (!link) return;
    
    // Check if it's a section title
    if (item.classList.contains('sidebar-menu-group-title')) {
      menuItems.push({
        id: `section-${index}`,
        type: 'section',
        label: item.textContent.trim()
      });
      return;
    }
    
    // Check if it's a dropdown
    if (item.classList.contains('dropdown')) {
      const icon = link.querySelector('.menu-icon');
      const label = link.querySelector('span:not(.submenu-icon-wrapper)');
      const submenu = item.querySelector('.sidebar-submenu');
      
      const menuItem = {
        id: `dropdown-${index}`,
        type: 'dropdown',
        icon: icon ? icon.getAttribute('icon') || 'solar:circle-outline' : 'solar:circle-outline',
        label: label ? label.textContent.trim() : 'Unknown',
        items: []
      };
      
      if (submenu) {
        const subItems = submenu.querySelectorAll('li a');
        subItems.forEach((subItem, subIndex) => {
          const subLabel = subItem.querySelector('span:last-child');
          const colorClass = subItem.querySelector('.submenu-icon');
          
          menuItem.items.push({
            label: subLabel ? subLabel.textContent.trim() : 'Unknown Sub Item',
            href: subItem.getAttribute('href') || '#',
            color: colorClass ? Array.from(colorClass.classList).find(cls => cls.startsWith('text-')) || 'text-primary-600' : 'text-primary-600'
          });
        });
      }
      
      menuItems.push(menuItem);
    } else {
      // Regular link
      const icon = link.querySelector('.menu-icon');
      const label = link.querySelector('span');
      
      menuItems.push({
        id: `link-${index}`,
        type: 'link',
        icon: icon ? icon.getAttribute('icon') || 'solar:circle-outline' : 'solar:circle-outline',
        label: label ? label.textContent.trim() : 'Unknown',
        href: link.getAttribute('href') || '#'
      });
    }
  });
  
  console.log('Extracted menu structure:');
  console.log(JSON.stringify(menuItems, null, 2));
  
  // Create the config file content
  const configContent = `// Auto-generated sidebar configuration
export const sidebarMenuConfig = ${JSON.stringify(menuItems, null, 2)};`;
  
  console.log('\\n\\nConfig file content:');
  console.log(configContent);
  
  return menuItems;
}

// Usage instructions:
console.log(`
To extract your current sidebar structure:
1. Open your ERP application in the browser
2. Open browser developer tools (F12)
3. Go to Console tab
4. Paste this entire script
5. Run: extractSidebarStructure()
6. Copy the output to replace sidebarConfig.js content
`);

// You can also manually run this:
// extractSidebarStructure();