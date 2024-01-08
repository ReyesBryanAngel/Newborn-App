import React from 'react';
import { 
    Drawer,
    List,
    ListItem,
    ListItemText,
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import  { menuItems, navigatorFunction } from "./SidebarLinks";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <div className='hidden lg:block'>
        <Drawer
        variant="permanent"
        sx={{
            '& .MuiDrawer-paper': {
            width: 200,
            marginTop: 8,
            bgcolor: "rgb(219 234 254)"
            },
        }}
        >
          <List 
            sx={{ 
              margin:"20px", 
              gap:"20px", 
              display:"flex", 
              flexDirection:"column"
            }}
          >
            {menuItems.map((item, index) => (
              <ListItem button key={index} onClick={() => navigatorFunction(item.path, navigate)}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
    </div>
  );
};

export default Sidebar;