import React from "react";
import logo from '../assets/logo.png';
import { useCookies } from 'react-cookie';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchBtn from './search-btn';

// setting params for components
import { pageObjects, buttonObjects } from './top-bar-params';
import { paramCase } from "param-case";
const pages = ['Home', 'Browse'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function PrimarySearchAppBar() {
  const [ cookies, setCookie, removeCookie ] = useCookies();
//   console.log(cookies.session); // auth token
  
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isProfileMenuOpen = Boolean(anchorElUser);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    //setAnchorElUser(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const setLogout = () => {
    removeCookie("session");
    alert("You are logged out.")
    window.location("/");
  }

  const handleProfileMenuClose = () => {
    setAnchorElUser(null);
    //handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
    sx={{ mt: '45px' }}
    id="menu-appbar"
    anchorEl={anchorElUser}
    anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
    }}
    keepMounted
    transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
    }}
    open={Boolean(anchorElUser)}
    onClose={handleProfileMenuClose}
    >
    {settings.map((setting) => (
        <MenuItem key={setting} onClick={handleProfileMenuClose}>
        <Typography textAlign="center">{setting}</Typography>
        </MenuItem>
    ))}
    </Menu>
  );

  const createNavBarButton = (buttonKey) => {
    return (
        <IconButton {...buttonKey}
            aria-controls={eval(buttonKey["menuId"])}
            onClick={eval(buttonKey["onClick"])}
            color="inherit"
        >
        <Badge badgeContent={buttonKey["badgeValue"]} color={buttonKey["badgeColor"]}>
            {buttonKey["icon"]}
        </Badge>
        <Typography
            noWrap
            component="div"
            sx={{ marginLeft: buttonKey["buttonText"] ? '10px' : '0px', display: { xs: 'none', sm: 'block' } }}
        >
            {buttonKey.buttonText}
        </Typography>

        </IconButton>
    );
  };

  const createMobileMenuItem = (buttonKey) => {
      return (
        <MenuItem {...buttonKey}
            component="a"
            aria-controls={eval(buttonKey["menuId"])}
            onClick={eval(buttonKey["onClick"])}
        >
            <IconButton
                key={buttonKey["text"]}
                size="large"
                aria-label={buttonKey["aria-label"]}
                color="inherit"
            >
                <Badge badgeContent={buttonKey["badgeValue"]} color={buttonKey["badgeColor"]}>
                    {buttonKey["icon"]}
                </Badge>
            </IconButton>
            <p>{buttonKey["text"]}</p>
        </MenuItem>
      );
  }

  // conditional rendering of log-in specific buttons
  let logInIcons;
  let logInMobileMenu;
  if (!cookies.session) { // if user not logged in
      logInIcons = (
          <span>
              {createNavBarButton(buttonObjects["Shopping cart"])}
            <Button
                variant="outlined"
                color="inherit"
                sx={{marginLeft: "10px"}}
                href="/login"
            >
                LOG IN
            </Button>
          </span>
      );

      logInMobileMenu = (
        <span>
            {createMobileMenuItem(buttonObjects["Shopping cart"])}
            {createMobileMenuItem(buttonObjects["Login"])}
        </span>
      );
  } else {
      logInIcons = (
          <span>
              {/* {createNavBarButton(buttonObjects["My Library"])} */}
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<CollectionsBookmarkIcon />}
                href="/library"
                sx={{margin: "0px 10px 0px 10px"}}
              >My Library </Button>
              {createNavBarButton(buttonObjects["Shopping cart"])}
              {createNavBarButton(buttonObjects["Profile"])}
              {createNavBarButton(buttonObjects["Logout"])}
          </span>
      );

      logInMobileMenu = (
          <span>
            {createMobileMenuItem(buttonObjects["My Library"])}
            {createMobileMenuItem(buttonObjects["Shopping cart"])}
            {createMobileMenuItem(buttonObjects["Profile"])}
            {createMobileMenuItem(buttonObjects["Logout"])}
          </span>
      );
  }

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {logInMobileMenu}
    </Menu>
  );

  const renderMobileLeftMenu = (
    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
        <IconButton
        size="large"
        aria-label="open menu"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleOpenNavMenu}
        color="inherit"
        >
        <MenuIcon />
        </IconButton>
        <Menu
        id="menu-appbar"
        anchorEl={anchorElNav}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
            display: { xs: 'block', md: 'none' },
        }}
        >
        {pages.map((page) => (
            <MenuItem
                component="a"
                href={pageObjects[page]["href"]}
                key={page}
                onClick={handleCloseNavMenu}
            >
            <Typography textAlign="center">{page}</Typography>
            </MenuItem>
        ))}
        </Menu>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: "#212121" }}>
        <Toolbar>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <img className="App-logo" src={logo} alt="logo"/>
          </Box>
          {renderMobileLeftMenu}            
            {/* Links to pages on nav bar */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                <Button
                    key={page}
                    href={pageObjects[page]["href"]}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                    {page}
                </Button>
                ))}
            </Box>
          <Box sx={{ flexGrow: 1 }} /> 

          <SearchBtn />
          <Box sx={{ display: { xs: 'none', md: 'flex' }, whiteSpace:"nowrap" }}>
            
            {/* notification icon and account settings icon only available when logged in */
            logInIcons}
            
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
