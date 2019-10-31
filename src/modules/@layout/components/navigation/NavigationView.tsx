import AppMenu from '@constants/AppMenu';
import { Collapse, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core';
import { isWidthUp } from '@material-ui/core/withWidth';
import ExpandMore from '@material-ui/icons/ExpandMore';
import * as classNames from 'classnames';
import * as React from 'react';

import { ModuleIcon } from '../moduleIcon/ModuleIcon';
import { NavigationProps } from './Navigation';
import { NavigationHeader } from './NavigationHeader';

export const NavigationView: React.SFC<NavigationProps> = props => {

  const render = (
    <React.Fragment>
      <NavigationHeader
        headerUid={props.headerUid} 
        onClickHeader={() => props.handleOnClickMenuHeader(AppMenu.User)} 
      />

      <List 
        disablePadding 
        component="nav" 
        style={{overflowX: 'auto'}}
      >
        <ListItem 
          button
          selected={props.childUid === AppMenu.Dashboard}
          onClick={() => props.handleOnClickMenuItem(AppMenu.Home, AppMenu.Dashboard, !isWidthUp('md', props.width))}
        >
          <ListItemIcon className={props.classes.drawerPaperMenuItem}>
            <ModuleIcon module={AppMenu.Home} innerProps={{ color: 'action' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Dashboard" 
            primaryTypographyProps={{
              // variant: 'body2'
            }}
          />
        </ListItem>

        {
          props.userState.user &&
          props.userState.user.menus &&
          props.userState.user.menus.map(header => (
            <React.Fragment key={header.uid}>
              {
                header.uid === AppMenu.WebJob ?
                // Web Job
                <ListItem
                  button
                  selected={props.childUid === AppMenu.WebJob}
                  onClick={() => props.handleOnClickMenuItem(AppMenu.Home, AppMenu.WebJob, !isWidthUp('md', props.width))}
                >
                  <ListItemIcon className={props.classes.drawerPaperMenuItem}>
                    <ModuleIcon module={header.uid} innerProps={{ color: 'action' }} />
                  </ListItemIcon>
                  <ListItemText 
                      className={props.classes.movingText}
                      style={{margin: '0 16px'}}
                      primary={header.name}
                      primaryTypographyProps={{
                      // noWrap: true,
                      // variant: 'body2'
                    }}
                  />
                </ListItem>
                :
                <React.Fragment>
                  <ListItem
                    button
                    onClick={() => props.handleOnClickMenuHeader(header.uid)}
                  >
                    <ListItemIcon className={props.classes.drawerPaperMenuItem}>
                      <ModuleIcon module={header.uid} innerProps={{ color: 'action' }} />
                    </ListItemIcon>
                    <ListItemText 
                      className={props.classes.movingText}
                      style={{margin: '0 16px'}}
                      primary={header.name}
                      primaryTypographyProps={{
                        noWrap: true,
                        // variant: 'body2'
                      }}
                    />
                    <ListItemSecondaryAction>
                      <ExpandMore 
                        color="action" 
                        className={classNames(
                          props.classes.expand,
                          props.classes.marginThinRight, 
                          props.headerUid === header.uid ? props.classes.expandOpen : ''
                        )} 
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                  <Collapse in={props.headerUid === header.uid}>
                    {
                      header.childs &&
                      header.childs.map(child =>
                        <ListItem 
                          key={child.uid}
                          button
                          selected={props.childUid === child.uid}
                          onClick={() => props.handleOnClickMenuItem(header.uid, child.uid, !isWidthUp('md', props.width))}
                        >
                          <ListItemText
                            className={classNames(props.classes.drawerPaperMenuItemSub, props.classes.movingText)}
                            primary={child.name}
                            primaryTypographyProps={{
                              noWrap: true,
                              // variant: 'body2'
                            }}
                          />
                        </ListItem>
                      )
                    }
                  </Collapse>
                </React.Fragment>
              }
            </React.Fragment>
          ))
        }
      </List>
    </React.Fragment>
  );

  return render;
};