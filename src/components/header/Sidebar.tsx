import React, { useState } from 'react';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { List as ListIcon, Star, Feedback, Help } from '@material-ui/icons/';
import { AiFillHeart } from 'react-icons/ai';
import { ImSigma } from "react-icons/im";
import { Collapse } from '@material-ui/core';
import { ExpandLess, ExpandMore, Bookmark, Add } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { FaHammer } from 'react-icons/fa';
import VerticalSplitIcon from '@material-ui/icons/VerticalSplit';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

import Logo from "../Logo";

import { useUser, useUserUpdate } from '../../contexts/UserContext';

import { TextField, Button } from '@material-ui/core';

import { USER_ACTIONS } from '../../Constants';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function Sidebar({ displaySidebar, setDisplaySidebar }) {

  const classes = useStyles();

  const user = useUser();
  const userDispatch = useUserUpdate();

  const [collectionsOpen, setCollectionsOpen] = useState(false);

  const [creatingNewCollection, setCreatingNewCollection] = useState(false)
  const [newCollectionTitle, setNewCollectionTitle] = useState('')
  const saveNewCollection = async () => {
    //saving the new collection to the server
    const res1 = await fetch('http://localhost:5000/collections', {
      method: 'POST',
      headers: {
          'Content-type': 'application/json',
      },
      body: JSON.stringify({ id: `${Date.now().toString()}-${Math.random().toString().slice(2, 6)}`, title: newCollectionTitle})
    });
    const data1 = await res1.json()

    //saving the new collection id to the user
    //TODO

    userDispatch({type: USER_ACTIONS.NEW_COLLECTION, payload: { newCollection: data1 }})
    setNewCollectionTitle('')
    setCreatingNewCollection(false);
  }

  return (
    <div>
      <Drawer anchor="left" open={displaySidebar} onClose={() => setDisplaySidebar(prev => !prev)} >
        <List>

          <ListItem button key='back' onClick={() => setDisplaySidebar(prev => !prev)} style={{ paddingTop: '0', paddingBottom: '0', marginTop: '0', marginBottom: '7px' }} >

              <ArrowBack style={{marginRight: "2rem"}} />
              <Logo />

          </ListItem>

          <Divider />

          <ListItem button key='Collections' onClick={() => setCollectionsOpen(prev => !prev)}>
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary='Collections' />
            {collectionsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>

          <Collapse in={collectionsOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {user.collections.map((collection) => (
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <ImSigma />
                  </ListItemIcon>
                  <ListItemText primary={collection.title} />
                </ListItem>
              ))}

              {creatingNewCollection ?
              <ListItem style={{display: 'flex', justifyContent: 'center'}}>
                <TextField placeholder="Collection name" value={newCollectionTitle} onChange={(e) => setNewCollectionTitle(e.target.value)} />
                <Button onClick={saveNewCollection}>Save</Button>
                <Button onClick={() => setCreatingNewCollection(false)}>Cancel</Button>
              </ListItem>
              :
              <ListItem button className={classes.nested} style={{display: 'flex', justifyContent: 'center'}} onClick={() => setCreatingNewCollection(true)}>
                <ListItemIcon>
                  <Add />
                </ListItemIcon>
              </ListItem> 
            }

            </List>
          </Collapse>

          <Divider />

          <ListItem button key='Topics' >
            <ListItemIcon>
              <VerticalSplitIcon style={{ transform: 'rotate(180deg)' }} />
            </ListItemIcon>
            <ListItemText primary='Topics' />
          </ListItem>

          <ListItem button key='Bookmarks' >
            <ListItemIcon>
              <Bookmark />
            </ListItemIcon>
            <ListItemText primary='Bookmarks' />
          </ListItem>

          <ListItem button key='Created Cards' >
            <ListItemIcon>
              <FaHammer size={23} />
            </ListItemIcon>
            <ListItemText primary='Created Cards' />
          </ListItem>

          <ListItem button key='Liked' >
            <ListItemIcon>
              <AiFillHeart size={23} style={{ paddingLeft: '0.1rem' }} />
            </ListItemIcon>
            <ListItemText primary='Liked' />
          </ListItem>

          <ListItem button key='Starred' >
            <ListItemIcon>
              <Star />
            </ListItemIcon>
            <ListItemText primary='Starred' />
          </ListItem>

          <Divider />

          <ListItem button key='Following' >
            <ListItemIcon>
              <PeopleAltIcon />
            </ListItemIcon>
            <ListItemText primary='Following' />
          </ListItem>

          <ListItem button key='Followers' >
            <ListItemIcon>
              <PeopleAltIcon />
            </ListItemIcon>
            <ListItemText primary='Followers' />
          </ListItem>

          <Divider />

          <ListItem button key='Help' >
            <ListItemIcon>
              <Help />
            </ListItemIcon>
            <ListItemText primary="Help" />
          </ListItem>

          <ListItem button key="Feedback" >
            <ListItemIcon>
              <Feedback />
            </ListItemIcon>
            <ListItemText primary="Feedback" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}