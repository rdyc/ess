import { AppRole } from '@constants/AppRole';
import { IHrCompetencyMappedUserAction } from '@hr/classes/types';
import { WithHrCompetencyMapped, withHrCompetencyMapped } from '@hr/hoc/withHrCompetencyMapped';
import { IPopupMenuOption } from '@layout/components/PopupMenu';
import { WithOidc, withOidc } from '@layout/hoc/withOidc';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { layoutMessage } from '@layout/locales/messages';
import { InjectedIntlProps, injectIntl } from 'react-intl';
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

import { HrCompetencyMappedDetailView } from './HrCompetencyMappedDetailView';

interface IOwnRouteParams {
  mappedUid: string;
}

interface IOwnHandler {
  handleOnLoadApi: () => void;
  handleOnSelectedMenu: (item: IPopupMenuOption) => void;
}

interface IOwnState {
  menuOptions?: IPopupMenuOption[];
  shouldLoad: boolean;
  isAdmin: boolean;
  action?: IHrCompetencyMappedUserAction;
}

interface IOwnStateUpdaters extends StateHandlerMap<IOwnState> {
  setOptions: StateHandler<IOwnState>;
  setShouldLoad: StateHandler<IOwnState>;
}

export type HrCompetencyMappedDetailProps
  = WithOidc
  & WithUser
  & WithHrCompetencyMapped
  & RouteComponentProps<IOwnRouteParams>
  & InjectedIntlProps
  & IOwnState
  & IOwnStateUpdaters
  & IOwnHandler;

const createProps: mapper<HrCompetencyMappedDetailProps, IOwnState> = (props: HrCompetencyMappedDetailProps): IOwnState => { 
    // checking admin status
    const { user } = props.oidcState;
    let isAdmin: boolean = false;
  
    if (user) {
      const role: string | string[] | undefined = user.profile.role;
  
      if (role) {
        if (Array.isArray(role)) {
          isAdmin = role.indexOf(AppRole.Admin) !== -1;
        } else {
          isAdmin = role === AppRole.Admin;
        }
      }
    }
    
    return { 
      isAdmin,
      shouldLoad: false
  };
};

const stateUpdaters: StateUpdaters<HrCompetencyMappedDetailProps, IOwnState, IOwnStateUpdaters> = {
  setShouldLoad: (state: IOwnState, props: HrCompetencyMappedDetailProps) => (): Partial<IOwnState> => ({
    shouldLoad: !state.shouldLoad
  }),
  setOptions: (prevState: IOwnState, props: HrCompetencyMappedDetailProps) => (options?: IPopupMenuOption[]): Partial<IOwnState> => ({
    menuOptions: options
  })
};

const handlerCreators: HandleCreators<HrCompetencyMappedDetailProps, IOwnHandler> = {
  handleOnLoadApi: (props: HrCompetencyMappedDetailProps) => () => { 
    const { user } = props.userState;
    const mappedUid = props.match.params.mappedUid;
    const { isLoading } = props.hrCompetencyMappedState.detail;

    if (user && mappedUid && !isLoading) {
      props.hrCompetencyMappedDispatch.loadDetailRequest({
        mappedUid
      });
    }
  },
  handleOnSelectedMenu: (props: HrCompetencyMappedDetailProps) => (item: IPopupMenuOption) => {
    switch (item.id) {
      case IHrCompetencyMappedUserAction.Refresh:
        props.setShouldLoad();
        break;

      default:
        break;
    }
  }
};

const lifecycles: ReactLifeCycleFunctions<HrCompetencyMappedDetailProps, IOwnState> = {
  componentDidUpdate(prevProps: HrCompetencyMappedDetailProps) {
    // handle updated reload state
    if (this.props.shouldLoad && this.props.shouldLoad !== prevProps.shouldLoad) {
      this.props.setShouldLoad();
      this.props.handleOnLoadApi();
    }
    
    // handle updated route params
    if (this.props.match.params.mappedUid !== prevProps.match.params.mappedUid) {
      this.props.handleOnLoadApi();
    }

      // handle updated response state
    if (this.props.hrCompetencyMappedState.detail.response !== prevProps.hrCompetencyMappedState.detail.response) {
      const { isLoading } = this.props.hrCompetencyMappedState.detail;

      const options: IPopupMenuOption[] = [
        {
          id: IHrCompetencyMappedUserAction.Refresh,
          name: this.props.intl.formatMessage(layoutMessage.action.refresh),
          enabled: !isLoading,
          visible: true,
        }
      ];

      this.props.setOptions(options);
    }
  }
}; 

export const HrCompetencyMappedDetail = compose(
  withRouter,
  withOidc,
  withUser,
  withHrCompetencyMapped,
  injectIntl,
  withStateHandlers(createProps, stateUpdaters),
  withHandlers(handlerCreators),
  lifecycle(lifecycles),
  setDisplayName('HrCompetencyMappedDetail')
)(HrCompetencyMappedDetailView);