// this file is to store the params required to define various components in top-bar
// (mainly the buttons which all have the same structure but different data)

import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import LogoutIcon from '@mui/icons-material/Logout';

// need to pass in handleCloseNavMenu function because it needs to be assigned to 'onClick' attribute
const pageObjects = {
    "Home": {
        'text': 'Home',
        'href': "/",
        'aria-label': 'go to home page',
        'aria-controls': null,
        'aria-haspopup': null,
        'onClick': 'handleCloseNavMenu',
    },
    "Browse": {
        'text': 'Browse',
        'href': '/browse',
        'aria-label': 'browse all books and collections',
        'aria-controls': null,
        'aria-haspopup': null,
        'onClick': 'handleCloseNavMenu',
    },
};

// need to pass in menuId variable and handleProfileMenuOpen function because it needs to be assigned  to onClick attribute
const buttonObjects = {
    "My Library": {
        'text': 'My Library',
        'buttonText': 'My Library',
        'icon': <CollectionsBookmarkIcon />,
        'badgeValue': null,
        'badgeColor': "error", // actually has no badge but badgecolor must have a value
        'href': '/library',
        'aria-label': 'my library',
        'aria-controls': null,
        'aria-haspopup': null,
        'onClick': null,
    },
    "Shopping cart": {
        'text': 'Shopping cart',
        'buttonText': null,
        'icon': <ShoppingCartOutlinedIcon />,
        'badgeValue': null,
        'badgeColor': "secondary",
        'href': '/cart',
        'aria-label': 'shopping cart',
        'aria-controls': null,
        'aria-haspopup': null,
        'onClick': null,
    },
    "Logout": {
        'text': 'Logout',
        'buttonText': null,
        'icon': <LogoutIcon />,
        'badgeValue': null,
        'badgeColor': "secondary",
        'href': '/home',
        'aria-label': 'logout',
        'aria-controls': undefined,
        'aria-haspopup': undefined,
        'onClick': 'setLogout',
    },
    "Profile": {
        'text': 'Profile',
        'buttonText': null,
        'icon': <AccountCircle />,
        'badgeValue': null,
        'badgeColor': "error",
        'href': '/profile',
        'aria-label': 'account of current user',
        'aria-controls': 'menuId',
        'aria-haspopup': "true",
        'onClick': 'handleProfileMenuOpen',
    },
    "Login": {
        'text': 'Log In',
        'buttonText': null,
        'icon': <AccountCircle />,
        'badgeValue': null,
        'badgeColor': "error",
        'href': '/login',
        'aria-label': 'log in',
        'aria-controls': 'menuId',
        'aria-haspopup': "true",
        'onClick': 'handleProfileMenuOpen',
    }
};



export {pageObjects, buttonObjects};
