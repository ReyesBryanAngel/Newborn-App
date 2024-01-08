import { useState, useEffect } from 'react';
import { 
    Typography, 
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Box,
    Tooltip,
    Menu,
    MenuItem,
    ListItemIcon
} from "@mui/material";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import  { menuItems, navigatorFunction } from "./SidebarLinks";
import { useNavigate } from 'react-router-dom';
import MyLogo from "../assets/my-logo.png"
import LogoutIcon from "@mui/icons-material/Logout";
import ApiCall from '../auth/ApiCall';

const Header = () => {
    const [avatar, setAvatar] = useState(null);
    const {token, logout, http, user} = ApiCall();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(false);

    const logoutUser = () => {
        if(token !== undefined){
            logout();
        }
    }

    const navigate = useNavigate();
    const toggleDrawer = (open) => () => {
        setDrawerOpen(open);
    };

    const isLG = () => {
        return window.innerWidth >= 1024;
    }
    const [lg, setLg] = useState(isLG());

    useEffect(() => {
        const handleResize = () => setLg(isLG());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    useEffect(() => {
        if (user) {
            const { name, last_name } = user;
            const nameInitial = name.charAt(0);
            const lasNameInitial = last_name.charAt(0);
            const avatarInitial = `${nameInitial}${lasNameInitial}`
            setAvatar(avatarInitial);
        }
    }, [user])

    const open = Boolean(anchorEl);
    const openAvatar = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const isAvatarOpen = () => {
        setAnchorEl(null);
    }


    return (
        <div className={`fixed w-full top-0 bg-blue-100 left-1/2 transform -translate-x-1/2 z-10 pr-5 h-16`}>
        <Toolbar className='flex justify-between items-center'>
            <div className='flex items-center'>
                <Box
                    component="img"
                    className='h-20 lg:h-24 hover:cursor-pointer'
                    alt="my logo."
                    src={MyLogo}
                    sx={{ marginTop: "-9px" }}
                    
                />
                <Typography sx={{ marginTop: "-9px", marginLeft:"-10px" }}>New Born</Typography>
            </div>
            <div className='flex gap-2 mb-2 lg:mb-5'>
                <div>
                    {!lg &&(
                        <IconButton edge="start" aria-label="menu" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <NotificationsNoneIcon fontSize='medium' color='primary' />
                    <Tooltip onClick={openAvatar}>
                        <IconButton>
                            <div className='flex justify-center items-center rounded-full w-9 h-9 p-3 border-2 text-white bg-blue-300'>
                                <div className='flex text-xs'>
                                    {avatar}
                                </div>
                            </div>
                        </IconButton>
                    </Tooltip>
                </div>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClick={isAvatarOpen}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                <MenuItem>
                    <ListItemIcon>
                    <PermIdentityIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={logoutUser}>
                    <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Logout</ListItemText>
                </MenuItem>
                </Menu>

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