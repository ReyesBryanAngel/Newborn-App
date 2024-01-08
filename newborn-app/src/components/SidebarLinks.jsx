export const menuItems = [
    { 
        text: 'Dashboard', 
        path: '/' 
    },
    { 
        text: 'Records', 
        path: '/records' 
    },
    { 
        text: 'Results', 
        path: '/results' 
    },
    { 
        text: 'Courier', 
        path: '/courier' 
    },
    { 
        text: 'Specimen Form', 
        path: '/form' 
    },
  ];

  export const navigatorFunction = (route, navigate, toggleDrawer) => {
    navigate(route);
    toggleDrawer(false);
  }