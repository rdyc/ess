import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { WithStyles, Divider, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core';
import { ConnectedReduxProps } from '../store';
import styles from '../styles';
import { LookupRoleMenuListType } from '../store/lookup/types/LookupRoleMenuListType';
import { setActive, setMenuDrawer, Active, AppUser } from '../store/@layout';
import menuLinkMapper from '../utils/menuLinkMapper';

interface PropsFromState extends RouteComponentProps<void>, WithStyles<typeof styles> {
  menuDrawer: boolean;
  menuItems: LookupRoleMenuListType[];
  user: AppUser;
  active: Active;
}

interface PropsFromDispatch {
  setMenuDrawer: typeof setMenuDrawer;
  setActive: typeof setActive;
}

type AllProps = PropsFromState & PropsFromDispatch & ConnectedReduxProps;

export const menuItemDrawer: React.StatelessComponent<AllProps> = props => (
  <div>
    {props.user && (
      <div className={props.classes.drawerHeader}>
        <List dense disablePadding>
          <ListItem>
            <ListItemText
              primary={props.user.company.name} 
              secondary={props.user.position.name} />
          </ListItem>
        </List>
      </div>
    )}
    <Divider />
    <List dense disablePadding
      component="nav" 
      subheader={
        <ListSubheader 
          component="div" 
          color="inherit">
          Home
        </ListSubheader>
      }>
      <ListItem button onClick={() => props.history.push('/home')}>
        <ListItemText primary="Dashboard" />
      </ListItem>
    </List>
    {props.menuItems.map(header => (
      <div key={header.uid}>
        <List dense disablePadding 
          component="nav" 
          key={header.uid} 
          subheader={
            <ListSubheader 
              component="div"
              color="inherit"
              key={header.uid}
            >
              {header.name}
            </ListSubheader>
          }>
          {header.childs && header.childs.map(item => (
            <ListItem 
              key={item.uid} 
              button 
              onClick={() => 
                props.setActive({
                  menuUid: item.uid,
                  title: item.name,
                  subTitle: item.uid
                }) && 
                props.setMenuDrawer(!props.menuDrawer) &&
                props.history.push(menuLinkMapper(item.uid))}>
              <ListItemText 
                key={item.uid} 
                primary={item.name} 
                color={props.active.menuUid === item.uid ? 'primary' : 'inherit'} />
            </ListItem>
          ))}
        </List>
      </div>
    ))}
    <Divider />
    <List dense disablePadding
      component="nav">
      <ListItem button onClick={() => props.history.push('/help')}>
        <ListItemText primary="Help" />
      </ListItem>
    </List>
  </div>
);