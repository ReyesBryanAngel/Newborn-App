export const menuItems = [
    { 
        text: 'Dashboard', 
        path: '/dashboard' 
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
        text: 'Fill up form', 
        path: '/form' 
    },
  ];

  export const navigatorFunction = (route, navigate, toggleDrawer) => {
    navigate(route);
    toggleDrawer(false);
  }