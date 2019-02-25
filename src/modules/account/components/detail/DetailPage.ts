import { AccountEmployeeTabs } from '@account/classes/types/AccountEmployeeTabs';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  compose,
  HandleCreators,
  lifecycle,
  ReactLifeCycleFunctions,
  setDisplayName,
  StateHandler,
  StateHandlerMap,
  StateUpdaters,
  withHandlers,
  withStateHandlers,
} from 'recompose';
import { DetailPageView } from './DetailPageView';

interface OwnRouteParams {
  employeeUid: string;
}

interface OwnState {
  tabValue?: number;
}

interface OwnHandlers {
  handleChangeTab: (tabValue: number) => void;
}

interface OwnStateUpdaters extends StateHandlerMap<OwnState> {
  stateUpdate: StateHandler<OwnState>;
}

interface OwnOption {
  tab: AccountEmployeeTabs;
  employeeName?: string;
}

export type DetailPageProps
  = OwnOption
  & InjectedIntlProps
  & OwnState
  & OwnStateUpdaters
  & OwnHandlers
  & RouteComponentProps<OwnRouteParams>;

const stateUpdaters: StateUpdaters<{}, OwnState, OwnStateUpdaters> = {
  stateUpdate: (prevState: OwnState) => (newState: any) => ({
    ...prevState,
    ...newState
  })
};

const handlerCreators: HandleCreators<DetailPageProps, OwnHandlers> = {
  handleChangeTab: (props: DetailPageProps) => (tabValue: number) => {
    props.stateUpdate({
      tabValue
    });
  }
};

const lifecycles: ReactLifeCycleFunctions<DetailPageProps, OwnState> = {
  componentDidMount() {
    const tabs = Object.keys(AccountEmployeeTabs).map(key => ({
      id: key,
      name: AccountEmployeeTabs[key]
    }));

    tabs.map((item, index) => item.name === this.props.tab ? this.props.handleChangeTab(index) : null);

    if (this.props.location.state) {
      if (this.props.location.state.employeeName) {
        this.props.stateUpdate({
          employeeName: this.props.location.state.employeeName
        });
      }
    }
  },
};

export const DetailPage = compose<DetailPageProps, OwnOption>(
  withRouter,
  injectIntl,
  setDisplayName('DetailPage'),
  withStateHandlers<OwnState, OwnStateUpdaters, {}>({}, stateUpdaters),
  withHandlers<DetailPageProps, OwnHandlers>(handlerCreators),
  lifecycle<DetailPageProps, OwnState>(lifecycles)
)(DetailPageView);