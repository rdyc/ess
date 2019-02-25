import AppEvent from '@constants/AppEvent';
import { IPageInfo, IRedirection } from '@generic/interfaces';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { Anchor } from '@layout/types';
import { WithStyles, withStyles } from '@material-ui/core';
import styles from '@styles';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  compose,
  HandleCreators,
  lifecycle,
  mapper,
  ReactLifeCycleFunctions,
  setDisplayName,
  StateHandler,
  StateHandlerMap,
  StateUpdaters,
  withHandlers,
  withStateHandlers,
} from 'recompose';

import { MasterPageView } from './MasterPageView';

const webName = process.env.REACT_APP_WEBSITE_NAME;

interface IOwnOption {
  
}

interface IOwnState {
  anchor: Anchor;
}

interface IOwnStateUpdater extends StateHandlerMap<IOwnState> {
  setAnchor: StateHandler<IOwnState>;
}

interface IOwnHandler {
  handleOnChangeRoute: (event: CustomEvent) => void;
  handleOnChangePage: (event: CustomEvent<IPageInfo>) => void;
  handleOnChangeAnchor: (event: CustomEvent) => void;
}

export type MasterPageProps
  = IOwnOption
  & IOwnState
  & IOwnStateUpdater
  & IOwnHandler
  & WithStyles<typeof styles>
  & WithUser
  & RouteComponentProps;

const createProps: mapper<IOwnOption, IOwnState> = (props: IOwnOption): IOwnState => ({
  anchor: 'left'
});

const stateUpdaters: StateUpdaters<MasterPageProps, IOwnState, IOwnStateUpdater> = {
  setAnchor: (state: IOwnState) => (): Partial<IOwnState> => ({
    anchor: state.anchor === 'left' ? 'right' : 'left'
  })
};

const handlerCreators: HandleCreators<MasterPageProps, IOwnHandler> = {
  handleOnChangeRoute: (props: MasterPageProps) => (event: CustomEvent<IRedirection>) => {
    props.history.push(event.detail.path, event.detail.state);
  },
  handleOnChangePage: (props: MasterPageProps) => (event: CustomEvent<IPageInfo>) => {
    const page = event.detail;

    const meta = document.getElementsByTagName('meta'); 	
    const desc = meta.namedItem('description');	

    if (desc && page.description) {	
      desc.content = page.description;	
    }	

    document.title = `${page.title} - ${webName}`;
  },
  handleOnChangeAnchor: (props: MasterPageProps) => (event: CustomEvent) => {
    props.setAnchor();
  }
};

const lifecycles: ReactLifeCycleFunctions<MasterPageProps, {}> = {
  componentWillMount() {
    addEventListener(AppEvent.onChangeAnchor, this.props.handleOnChangeAnchor);
    addEventListener(AppEvent.onChangeRoute, this.props.handleOnChangeRoute);
    addEventListener(AppEvent.onChangePage, this.props.handleOnChangePage);
  },
  componentWillUnmount() {
    removeEventListener(AppEvent.onChangeAnchor, this.props.handleOnChangeAnchor);
    removeEventListener(AppEvent.onChangeRoute, this.props.handleOnChangeRoute);
    removeEventListener(AppEvent.onChangePage, this.props.handleOnChangePage);
  }
};

export const MasterPage = compose<MasterPageProps, IOwnOption>(
  setDisplayName('MasterPage'),
  withRouter,
  withUser,
  withStateHandlers(createProps, stateUpdaters),
  withHandlers(handlerCreators),
  lifecycle(lifecycles),
  withStyles(styles)
)(MasterPageView);