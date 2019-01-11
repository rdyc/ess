import { IAppState } from '@generic/interfaces';
import { IViewConfig } from '@layout/classes/config/IViewConfig';
import { IAlert, ILayoutState, IView } from '@layout/interfaces';
import {
  layoutAccountColapse,
  layoutAccountExpand,
  layoutAlertAdd,
  layoutAlertDialogHide,
  layoutAlertDialogShow,
  layoutAlertDismiss,
  layoutChangeAnchor,
  layoutChangeNotif,
  layoutChangeView,
  layoutModeListOff,
  layoutModeListOn,
  layoutModeSearchOff,
  layoutModeSearchOn,
  layoutMoreHide,
  layoutMoreShow,
  layoutNavBackHide,
  layoutNavBackShow,
  layoutSearchHide,
  layoutSearchShow,
  layoutSetupView,
  layoutThemeChange,
} from '@layout/store/actions';
import { Anchor } from '@layout/types';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

interface PropsFromState {
  layoutState: ILayoutState;
}

interface PropsFromDispatch {
  layoutDispatch: {
    themeChange: typeof layoutThemeChange;

    alertAdd: typeof layoutAlertAdd;
    alertDismiss: typeof layoutAlertDismiss;

    changeAnchor: typeof layoutChangeAnchor;
    changeNotif: typeof layoutChangeNotif;
    changeView: typeof layoutChangeView;
    
    setupView: typeof layoutSetupView;
    
    alertDialogShow: typeof layoutAlertDialogShow;
    alertDialogHide: typeof layoutAlertDialogHide;
    navBackShow: typeof layoutNavBackShow;
    navBackHide: typeof layoutNavBackHide;
    searchShow: typeof layoutSearchShow;
    searchHide: typeof layoutSearchHide;
    moreShow: typeof layoutMoreShow;
    moreHide: typeof layoutMoreHide;
    
    accountExpand: typeof layoutAccountExpand;
    accountColapse: typeof layoutAccountColapse;
    
    modeSearchOn: typeof layoutModeSearchOn;
    modeSearchOff: typeof layoutModeSearchOff;
    modeListOn: typeof layoutModeListOn;
    modeListOff: typeof layoutModeListOff;
  };
}

export interface WithLayout extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = ({ layout }: IAppState) => ({
  layoutState: layout
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  layoutDispatch: {
    themeChange: () => dispatch(layoutThemeChange()),

    alertAdd: (alert: IAlert) => dispatch(layoutAlertAdd(alert)),
    alertDismiss: () => dispatch(layoutAlertDismiss()),

    changeAnchor: (anchor: Anchor) => dispatch(layoutChangeAnchor(anchor)),
    changeNotif: (count: number) => dispatch(layoutChangeNotif(count)),
    changeView: (active: IView) => dispatch(layoutChangeView(active)),

    setupView: (config: IViewConfig) => dispatch(layoutSetupView(config)),
    
    accountExpand: () => dispatch(layoutAccountExpand()),
    accountColapse: () => dispatch(layoutAccountColapse()),
    
    alertDialogShow: () => dispatch(layoutAlertDialogShow()),
    alertDialogHide: () => dispatch(layoutAlertDialogHide()),
    navBackShow: () => dispatch(layoutNavBackShow()),
    navBackHide: () => dispatch(layoutNavBackHide()),
    searchShow: () => dispatch(layoutSearchShow()),
    searchHide: () => dispatch(layoutSearchHide()),
    moreShow: () => dispatch(layoutMoreShow()),
    moreHide: () => dispatch(layoutMoreHide()),
    
    modeSearchOn: () => dispatch(layoutModeSearchOn()),
    modeSearchOff: () => dispatch(layoutModeSearchOff()), 
    modeListOn: () => dispatch(layoutModeListOn()),
    modeListOff: () => dispatch(layoutModeListOff()),
  }
});

export const withLayout = (component: React.ComponentType) => 
  connect(mapStateToProps, mapDispatchToProps)(component);