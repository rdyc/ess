import { WithLayout, withLayout } from '@layout/hoc/withLayout';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { ILookupRoleMenuChildList } from '@lookup/classes';
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import withWidth, { isWidthUp, WithWidth } from '@material-ui/core/withWidth';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import styles from '@styles';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { compose, mapper, setDisplayName, StateHandler, StateHandlerMap, StateUpdaters, withStateHandlers } from 'recompose';
import { menuLinkMapper } from 'utils';

interface OutterProps {
  
}

interface State {
  active: string | undefined;
  isExpanded: boolean;
}

interface Updaters extends StateHandlerMap<State> {
  handleToggle: StateHandler<State>;
}

type InnerProps 
  = OutterProps
  & State 
  & Updaters
  & WithUser 
  & WithLayout 
  & WithWidth
  & WithStyles<typeof styles>
  & RouteComponentProps; 

const component: React.SFC<InnerProps> = props => {
  const { active, isExpanded, layoutState, layoutDispatch, classes } = props;
  const { user } = props.userState;
 
  const fnFindParent = () => {
    let uid: string | undefined;

    if (layoutState.view) {
      uid = layoutState.view.parentUid;
    }
    
    return uid;
  };

  const parentUid = fnFindParent();

  const viewMenuUid = () => {
    if (layoutState.view) {
      return layoutState.view.uid;
    }

    return undefined;
  };

  const handleClick = (item: ILookupRoleMenuChildList) => {
    props.handleToggle(item.uid);

    if (layoutState.isDrawerMenuVisible && !isWidthUp('md', props.width)) {
      layoutDispatch.drawerMenuHide();
    }

    // history.push(menuLinkMapper(item.uid));
  };

  return (
    <div>
      {user && (
        <div>
          <List disablePadding>
            <ListItem>
              <ListItemText
                primary={user.company.name}
                secondary={user.position.name}
                primaryTypographyProps={{
                  variant: 'body1'
                }}
              />
            </ListItem>
          </List>
        </div>
      )}

      <Divider />

      <List
        disablePadding
        component="nav"
        subheader={
          <ListSubheader component="div" color="inherit">
            Home
          </ListSubheader>
        }
      >
        <ListItem button>
          <ListItemText 
            primary="Dashboard" 
            primaryTypographyProps={{
              variant: 'body1'
            }}
          />
        </ListItem>
      </List>

      {
        user &&
        user.menus &&
        user.menus.map(header => (
          <div key={header.uid}>
            <List 
              disablePadding 
              component="nav"
              key={header.uid}
            >
              <ListItem
                button
                onClick={() => props.handleToggle(header.uid)}
              >
                <ListItemText primary={header.name}
                  primaryTypographyProps={{
                    noWrap: true,
                    variant: 'body1',
                    color: header.uid === parentUid ? 'secondary' : 'textPrimary'
                  }}
                />
                <ListItemSecondaryAction>
                  {isExpanded && parentUid === header.uid || active === header.uid ? <ExpandLess color="action" /> : <ExpandMore color="action" />}
                </ListItemSecondaryAction>
              </ListItem>
              <Collapse in={isExpanded && parentUid === header.uid || active === header.uid }>
                <List component="div" disablePadding>
                  {
                    header.childs &&
                    header.childs.map(item =>
                      <Link 
                        key={item.uid} 
                        to={menuLinkMapper(item.uid)} 
                        onClick={() => handleClick(item)}
                      >
                        <ListItem button>
                          <ListItemText
                            className={classes.marginFarLeft}
                            primary={item.name}
                            primaryTypographyProps={{
                              noWrap: true,
                              variant: 'body1',
                              color: item.uid === viewMenuUid() ? 'primary' : 'textPrimary'
                            }}
                          />
                        </ListItem>
                      </Link>
                    )
                  }
                </List>
              </Collapse>
            </List>
          </div>
        ))
      }
      
      <Divider />

      <List disablePadding component="nav">
        <ListItem button>
          <ListItemText primary="Help" />
        </ListItem>
      </List>
    </div>
  );
};

const createProps: mapper<OutterProps, State> = (props: OutterProps) => ({ 
  active: undefined,
  isExpanded: false
});

const stateUpdaters: StateUpdaters<OutterProps, State, Updaters> = {
  handleToggle: (state: State) => (uid: string) => ({
    active: uid,
    isExpanded: state.active === uid ? !state.isExpanded : true
  })
};

const NavigationMenuSFC = compose<InnerProps, OutterProps>(
  setDisplayName('NavigationMenuSFC'),
  withStateHandlers<State, Updaters>(createProps, stateUpdaters),
  withUser,
  withLayout,
  withWidth(),
  withStyles(styles),
  withRouter
)(component);

export default NavigationMenuSFC;