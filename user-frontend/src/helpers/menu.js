export const getMenuItems = () => {
  return [
        {
      key: 'menu-title',
      label: 'DRIVER PANEL',
      isTitle: true,
    },
    {
      key: 'dashboard',
      label: 'Dashboard',
      url: '/dashboard',
      icon: 'mdi:view-dashboard-outline',
    },
    {
      key: 'profile',
      label: 'My Profile',
      url: '/profile',
      icon: 'mdi:account-circle-outline',
    },
    {
  key: 'assigned-car',
  label: 'Assigned Car',
  url: '/assigned-car',
  icon: 'mdi:car-outline',
},
{
  key: 'share-location',
  label: 'Share Location',
  url: '/share-location',
  icon: 'mdi:map-marker-outline',
},
{
  key: 'payment-history',
  label: 'Payment History',
  url: '/payment-history',
  icon: 'mdi:cash-multiple',
},
    {
      key: 'pending-dues',
      label: 'Pending Dues',
      url: '/pending-dues',
      icon: 'mdi:alert-circle-outline',
    },
    {
      key: 'alerts',
      label: 'Alerts',
      url: '/alerts',
      icon: 'mdi:bell-outline',
    },
    {
      key: 'support',
      label: 'Support',
      url: '/support',
      icon: 'mdi:lifebuoy',
    },
    {
      key: 'repair-status',
      label: 'Repair Status',
      url: '/repair-status',
      icon: 'mdi:wrench-outline',
    },
  ];
};

export const findAllParent = (menuItems, menuItem) => {
  const parents = [];

  const findParent = (items, child) => {
    for (const item of items) {
      if (item.children?.some((subItem) => subItem.key === child.key)) {
        parents.push(item.key);
        findParent(menuItems, item);
      } else if (item.children) {
        findParent(item.children, child);
      }
    }
  };

  findParent(menuItems, menuItem);
  return parents;
};

export const findMenuItem = (menuItems, menuItemKey) => {
  for (const item of menuItems) {
    if (item.key === menuItemKey) return item;
    if (item.children) {
      const found = findMenuItem(item.children, menuItemKey);
      if (found) return found;
    }
  }
  return null;
};

export const getMenuItemFromURL = (menuItems, url) => {
  for (const item of menuItems) {
    if (item.url === url) return item;
    if (item.children) {
      const found = getMenuItemFromURL(item.children, url);
      if (found) return found;
    }
  }
  return null;
};