import React, { useEffect, useState, useLocation } from 'react';
import { useCookies } from 'react-cookie';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import { checkIsAdmin } from './account-api';

export default function ButtonAppBar() {
    const [ cookies, setCookie ] = useCookies();
    const [ isAdmin, setIsAdmin ] = useState(false);

    useEffect(() => {
        checkIsAdmin(cookies.session, alert).then(body => {
            // console.log(typeof(body.is_admin));
            setIsAdmin(body.is_admin); // ensure body.isAdmin is a boolean
        })
    
        }, []); // needed to include dependency array otherwise would cause infinity loop

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: "#212121" }}>
          <font face="Arial">
          <div align="center">
            <p></p>
            <b>Bookhub</b>
            <br />
            <br />
            <small>
            <span>Sitemap</span> | <span>Jobs</span> | <span>Help Center</span>
                {isAdmin && <span><span> | </span> <span><a href="/admin">Admin</a></span></span>}
            </small>
          </div>
          <div align="right">
          <small>
          <i>
            @ Jack-J 2022
          </i>
          </small>
          </div>
          </font>
          
      </AppBar>
    </Box>
  );
}