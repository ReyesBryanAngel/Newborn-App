import React, { useState, useEffect, useRef } from 'react';
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
    ListItemIcon,
    Badge,
    Popper,
    Grow,
    ClickAwayListener,
    Paper,
    MenuList,
    Dialog,
    DialogContentText,
    TextField,
    DialogContent,
} from "@mui/material"
// import { makeStyles } from "@mui/styles";
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import MenuIcon from '@mui/icons-material/Menu';
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import  { menuItems, navigatorFunction } from "./SidebarLinks";
import { useNavigate } from 'react-router-dom';
import MyLogo from "../assets/my-logo.png"
import LogoutIcon from "@mui/icons-material/Logout";
import ApiCall from '../auth/ApiCall';
import { useQuery } from "@tanstack/react-query";
import { useData } from '../context/DataProvider';
import dayjs from 'dayjs';
import 'dayjs/locale/en';

// const useStyles = makeStyles((theme) => ({
//     div: {
//       display: 'flex',
//       flexDirection: 'column',
//       gap: theme.spacing(2),
//       minWidth: 300,
//       position: "relative"
//     },
//   }));

const Header = () => {
    // const classes = useStyles();
    const [avatar, setAvatar] = useState(null);
    const [profileInfo, setProfileInfo] = useState({firstName:"", lastName:"", email:""})
    const [profile, setProfile] = useState(false);
    const {token, logout, http, user} = ApiCall();
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(false);
    const [specimenLoad, setSpecimenLoad] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [results, setResults] = useState([]);
    const [badgeOpener, setBadgeOpener] = useState(false);
    const { setSpecimenFiltered, setGoToClicked } = useData();
    const anchorRef = useRef(null);

    useQuery({
        queryKey: ["specimen"],
        enabled: !specimenLoad,
        retryDelay: 500,
        refetchOnWindowFocus: false,
        queryFn: () =>
            http
              .get(`v1/specimens/all-samples`)
              .then((res) => {
                  setSpecimenLoad(true);
                  const specimenWithResult = res?.data?.filter(r => r.result !== null && !r.viewed);
                  setResults(specimenWithResult);
                  setNotificationCount(specimenWithResult?.length);
                  return res?.data;
            })
    })

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
            const { name, last_name, email } = user;
            const nameInitial = name.charAt(0);
            const lasNameInitial = last_name.charAt(0);
            const avatarInitial = `${nameInitial}${lasNameInitial}`
            setAvatar(avatarInitial);
            setProfileInfo({firstName:name, lastName:last_name, email:email})
        }
    }, [user])

    const open = Boolean(anchorEl);
    
    const openAvatar = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const isAvatarOpen = () => {
        setAnchorEl(null);
    }
    const openBadge = () => {
        setBadgeOpener((prevOpen) => !prevOpen);
    };
    const closeDialog = () => {
        setProfile(false);
    }

    const viewInResult = async(e, index) => {
        const specimenToUpdate = results[index];
        const encapsulateToArray = [specimenToUpdate];
        encapsulateToArray?.map(async (item) => {
            if (item.result !== null && !item.viewed) {
                const updatedSpecimen = {
                    ...item,
                    viewed: 1,
                };
                await http.put(`v1/specimens/${item.id}`, updatedSpecimen)
                .then((res) => {
                    if (res?.status) {
                        setSpecimenFiltered(encapsulateToArray);
                        navigate("/results");
                        setGoToClicked(true);
                        setBadgeOpener(false);
                        notificationCount !== 0 && setNotificationCount(notificationCount-1);
                    }
                }).catch((e) => {
                    console.error(e);
                });
            }
        })
        
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
          return;
        }
    
        setBadgeOpener(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
          event.preventDefault();
          setBadgeOpener(false);
        } else if (event.key === 'Escape') {
            setBadgeOpener(false);
        }
      }

      const prevOpen = React.useRef(badgeOpener);
    React.useEffect(() => {
        if (prevOpen.current === true && badgeOpener === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = badgeOpener;
    }, [badgeOpener]);

    return (
        <div className={`fixed w-full top-0 bg-blue-100 left-1/2 transform -translate-x-1/2 z-10 pr-5 h-16`}>
            <Dialog 
                onClose={closeDialog} 
                open={profile}
            >
                <DialogContent>
                    <div className='absolute right-0 top-0'>
                        <IconButton onClick={closeDialog}>
                            <HighlightOffRoundedIcon/>
                        </IconButton>
                    </div>
                    <div className="flex flex-col min-w-300 py-20 relative">
                        <div className='px-3 whitespace-nowrap'>
                            <div>
                                <div className='flex justify-between gap-5'>
                                    <Typography sx={{ display:"flex", alignItems:"center", gap:"10px" }}>
                                        First Name:
                                        <TextField
                                            disabled={true}
                                            variant='standard'
                                            className='w-full'
                                            value={profileInfo.firstName}
                                        />
                                    </Typography>
                                    <Typography sx={{ display:"flex", alignItems:"center", gap:"10px" }}>
                                        Last Name:
                                        <TextField
                                            disabled={true}
                                            variant='standard'
                                            className='w-full'
                                            value={profileInfo.lastName}
                                        />
                                    </Typography>
                                </div>
                                <Typography sx={{ display:"flex", alignItems:"center", gap:"10px", marginTop:"30px"}}>
                                    Email Address:
                                    <TextField
                                        disabled={true}
                                        variant='standard'
                                        className='w-full'
                                        value={profileInfo.email}
                                    />
                                </Typography>
                            </div>
                            
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
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
                        <IconButton 
                            onClick={openBadge} 
                            ref={anchorRef}
                            aria-controls={badgeOpener ? 'composition-menu' : undefined}
                            aria-expanded={badgeOpener ? 'true' : undefined}
                            aria-haspopup="true"
                        >
                            <Badge badgeContent={notificationCount} color="error">
                                <NotificationsNoneIcon fontSize='medium' color='primary' />
                            </Badge>
                        </IconButton>
                        <Popper
                            open={badgeOpener}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            placement="bottom-start"
                            transition
                            disablePortal
                        >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                    {...TransitionProps}
                                    style={{
                                        transformOrigin:
                                        placement === 'bottom-start' ? 'left top' : 'left bottom',
                                    }}
                                >
                                    <Paper sx={{ width:"100%" }}>
                                        <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList
                                            autoFocusItem={badgeOpener} 
                                            onKeyDown={handleListKeyDown}
                                        >
                                            <div className='text-start m-2'>
                                                <Typography>Notifications</Typography>
                                            </div>
                                            {results?.map((r, index) => {
                                                const mother = `${r?.baby_last_name}, ${r?.mothers_first_name}`;
                                                const resultColorMap = {
                                                    'Elevated': 'bg-red-500',
                                                    'Normal': 'bg-green-500',
                                                    'Inadequate': 'bg-yellow-500',
                                                };
                                                const border = "1px solid #e2e8f0";
                                                const bgColorClass = resultColorMap[r?.result] || 'bg-gray-500';
                                                const timeElapsed = dayjs().diff(dayjs(r?.updated_at), 'minute');
                                                let timeAgoText = '';
                                                if (timeElapsed < 60) {
                                                    timeAgoText = `${timeElapsed} min ago`;
                                                } else if (timeElapsed < 1440) {
                                                    const hoursElapsed = Math.floor(timeElapsed / 60);
                                                    timeAgoText = `${hoursElapsed} ${hoursElapsed === 1 ? 'hour' : 'hours'} ago`;
                                                } else {
                                                    const daysElapsed = Math.floor(timeElapsed / 1440);
                                                    timeAgoText = `${daysElapsed} ${daysElapsed === 1 ? 'day' : 'days'} ago`;
                                                }
                                                return (
                                                    <MenuItem 
                                                        onClick={(e) => {
                                                            viewInResult(e, index)
                                                        }} 
                                                        key={index} 
                                                        sx={{ borderTop: {border}, borderBottom: {border} }}
                                                    >
                                                        <div className='flex justify-center gap-10'>
                                                            <div className={`w-4 h-4 rounded-full ${bgColorClass}`}></div>
                                                            <div className='flex flex-col gap-5 text-start'>
                                                                <Typography>{r?.result.split(" ")[0]} Findings</Typography>
                                                                <Typography>{mother}</Typography>
                                                            </div>
                                                            <div>{timeAgoText}</div>
                                                        </div>
                                                    </MenuItem>
                                                )
                                            })}
                                        </MenuList>
                                        </ClickAwayListener>
                                    </Paper>
                                </Grow>
                            )}
                        </Popper>
                            
                        <Tooltip onClick={openAvatar} sx={{ position:"relative" }}>
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
                            <MenuItem onClick={() => {setProfile(true)}}>
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