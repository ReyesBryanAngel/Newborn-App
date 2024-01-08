import { useState } from 'react';
import { 
    Typography, 
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Avatar,
    Box
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import  { menuItems, navigatorFunction } from "./SidebarLinks";
import { useNavigate } from 'react-router-dom';
import MyLogo from "../assets/my-logo.png"

const Header = () => {
    
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };
    const stringAvatar = (name) => {
        return {
          sx: {
                fontSize: "16px",
                width: "30px",
                height:"30px",
            },
          children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        };
      }

    return (
        <div className={`fixed w-full top-0 bg-blue-100 left-1/2 transform -translate-x-1/2 z-10 pr-5 h-16`}>
        <Toolbar className='flex justify-between items-center'>
            <div className='flex items-center'>
                <Box
                    component="img"
                    className='h-24 hover:cursor-pointer'
                    alt="my logo."
                    src={MyLogo}
                    sx={{ marginTop: "-16px" }}
                    
                />
            </div>
            <div className='flex gap-2 mb-4'>
                <div className='lg:hidden'>
                    <IconButton edge="start" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                </div>
                <div className='mt-1'>
                    <NotificationsNoneIcon fontSize='medium' color='primary' />
                </div>
                <div className='pt-1'>
                    <Avatar {...stringAvatar('Princess Guerra')} />
                </div>
            </div>
        </Toolbar>
        <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer(false)}>
            <List>
                {menuItems.map((item, index) => (
                <ListItem button key={index} onClick={() => navigatorFunction(item.path, navigate, toggleDrawer(false))}>
                    <ListItemText primary={item.text} />
                </ListItem>
                ))}
            </List>
        </Drawer>
    </div>
    )
}

export default Header;