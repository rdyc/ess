import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { WithStyles, Hidden, Drawer } from '@material-ui/core';
import * as classNames from 'classnames';
import { ConnectedReduxProps } from '../store';
import { Anchor, setMenuDrawer, setActive, Active, AppUser } from '../store/@layout';
import styles from '../styles';
import { menuItemDrawer as MenuItemDrawer } from './menuItemDrawer';
import { LookupRoleMenuListType } from '../store/lookup/types/LookupRoleMenuListType';

interface PropsFromState extends RouteComponentProps<void>, WithStyles<typeof styles> {
  anchor: Anchor;
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

export const menuDrawer: React.StatelessComponent<AllProps> = props => (
  <div>
    <Hidden mdUp>
      <Drawer
        variant="temporary"
        anchor={props.anchor}
        open={props.menuDrawer}
        classes={{
          paper: props.classes.drawerPaper,
        }}
        onClose={() => props.setMenuDrawer(!props.menuDrawer)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        <MenuItemDrawer {...props}/>
      </Drawer>
    </Hidden>
    <Hidden mdDown implementation="css">
      <Drawer
        variant="permanent"
        anchor={props.anchor}
        open={props.menuDrawer}
        classes={{
          paper: classNames(props.classes.drawerPaper, 
                            props.menuDrawer && props.classes.drawerPaperClose),
        }}
      >
        <MenuItemDrawer {...props}/>
      </Drawer>
    </Hidden>
  </div>
);