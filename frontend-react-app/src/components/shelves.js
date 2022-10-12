import React, { useEffect, useState } from 'react';
import styles from "./shelves.module.css";
import { useCookies } from 'react-cookie';

import { Box, Tabs, Tab, Button, Divider, Paper, Typography } from '@mui/material';
import Bookcard from './book-card';
import ShelfComponent from './shelf-component';
import { apiCall } from './helper';
import AddIcon from '@mui/icons-material/Add';
import { deleteShelfApi } from './shelf-api';
import { getShelves } from './shelf-api';
import CreateShelfDialog from './shelf-create-dialog';

  
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

function Shelves() {
    const [ cookies, setCookie ] = useCookies();
    console.log(cookies.session);

    const [allShelves, setAllShelves] = useState(null);
    const [myShelvesList, setMyShelvesList] = useState(null);
    const [followShelvesList, setFollowShelvesList] = useState(null);

    // code for handling create-shelf dialog
    const [createShelfOpen, setCreateShelfOpen] = useState(false);
    const handleCreateShelfDialogOpen = () => {
        setCreateShelfOpen(true);
    }

    useEffect(() => {
        getShelves(cookies.session, alert).then(body => { //TODO - change userId to auth token
            console.log(body.result);
            setAllShelves(body.result);
            setMyShelvesList(body.result.my_collection);
            setFollowShelvesList(body.result.follow_collections);
            console.log(myShelvesList);
        });
    }, []); // needed to include dependency array otherwise would cause infinity loop

    console.log(allShelves);

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // delete shelf (removes from frontend & calls backend api)
    // need to pass this to shelf-component.js component to call in its "delete shelf" button
    const deleteShelf = (authToken, collectionId, setError) => {
        console.log("deleting shelf");
        setMyShelvesList(myShelvesList.filter(shelf => shelf.collection_id !== collectionId))
        deleteShelfApi(authToken, collectionId, setError ); //TODO: change user id to authtoken
    }

    return (
        <div className={styles.mainContainer}>
            <h1>My Shelves</h1>
            <div className={styles.createShelfBtnWrapper}>
                <Button
                    className={styles.createShelfBtn}
                    startIcon={<AddIcon />}
                    variant="contained"
                    onClick={handleCreateShelfDialogOpen}
                >
                    Create a Shelf
                </Button>
            </div>
            <div className={styles.tabsSection}>
                <div>
                    <Tabs className={styles.tabToggleBar} value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Created by Me" {...a11yProps(0)} />
                        <Tab label="Shelves I Follow" {...a11yProps(1)} />
                    </Tabs>
                    <Divider />
                </div>
                <TabPanel value={value} index={0}> {/* This is where shelves created by me goes */}
                    <div className={styles.shelvesSection}>
                        {myShelvesList && myShelvesList.map((shelf) => (
                            <ShelfComponent
                                collectionId={shelf.collection_id}
                                collectionTitle={shelf.title}
                                collectionDescription={shelf.description}
                                deleteShelf={() => deleteShelf(cookies.session, shelf.collection_id, alert)} // TODO: change user id here
                            />
                        ))}
                    </div>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {followShelvesList && followShelvesList.map((shelf) => (
                        <ShelfComponent
                            collectionId={shelf.collection_id}
                            collectionTitle={shelf.title}
                            collectionDescription={shelf.description}
                            deleteShelf={() => deleteShelf(cookies.session, shelf.collection_id, alert)} // TODO: change user id here
                        />
                    ))}
                </TabPanel>
                
            </div>
            <CreateShelfDialog
                open={createShelfOpen}
                setOpen={setCreateShelfOpen}
                shelvesList={myShelvesList}
                setShelvesList={setMyShelvesList}
            />
        </div>
    )
}

export default Shelves;