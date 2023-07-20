import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
    Box,
    Drawer,
    CssBaseline,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { useState } from "react";
import Match from "./game_match/match";
import Home from "./home";
import TeamRegistrationForm from "./forms/team_registration";
import ErrorPage from "./errors/error_page";
import MirrorMatch from "./game_match/mirror/mirrorMatch";

const drawerWidth = 240;

const Main = ({ open }) => {
    return (
        <main
            style={{
                flexGrow: 1,
                padding: '20px',
                transition: 'margin 0.2s ease-out',
                marginLeft: open ? drawerWidth : 0,
            }}
        >
            <div style={{ marginTop: '70px' }}>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/team-form" element={<TeamRegistrationForm />} />
                    <Route path="/match" element={<Match />} />
                    <Route path="/mirror_match" element={<MirrorMatch />} />
                    <Route path="/error" element={<ErrorPage />} />
                </Routes>
            </div>
        </main>
    );
};

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const DrawerItems = () => {
    return (
        <List>
            <ListItem key={"register"} disablePadding>
                <ListItemButton component={Link} to={"/team-form"}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Register"} />
                </ListItemButton>
            </ListItem>

            <ListItem key={"home"} disablePadding>
                <ListItemButton component={Link} to={"/home"}>
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Home"} />
                </ListItemButton>
            </ListItem>
        </List>
    );
}

function App() {
    const theme = useTheme();
    const [open, setOpen] = useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

  return (
      <BrowserRouter>
          <Box sx={{ display: 'flex' }}>
              <CssBaseline />
              <AppBar position="fixed" open={open}>
                  <Toolbar>
                      <IconButton
                          color="inherit"
                          aria-label="open drawer"
                          onClick={handleDrawerOpen}
                          edge="start"
                          sx={{ mr: 2, ...(open && { display: 'none' }) }}
                      >
                          <MenuIcon />
                      </IconButton>
                      <Typography variant="h6" noWrap component="div">
                          Home
                      </Typography>
                  </Toolbar>
              </AppBar>
              <Drawer
                  sx={{
                      width: drawerWidth,
                      flexShrink: 0,
                      '& .MuiDrawer-paper': {
                          width: drawerWidth,
                          boxSizing: 'border-box',
                      },
                  }}
                  variant="persistent"
                  anchor="left"
                  open={open}
              >
                  <DrawerHeader>
                      <IconButton onClick={handleDrawerClose}>
                          {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                      </IconButton>
                  </DrawerHeader>
                  <Divider />
                  <DrawerItems/>
              </Drawer>
              <Main open={open} />
          </Box>
      </BrowserRouter>
  );
}

export default App;
