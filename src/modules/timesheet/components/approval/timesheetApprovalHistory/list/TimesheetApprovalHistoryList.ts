import AppMenu from '@constants/AppMenu';
import { SortDirection } from '@generic/types';
import { WithLayout, withLayout } from '@layout/hoc/withLayout';
import { WithNavBottom, withNavBottom } from '@layout/hoc/withNavBottom';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { IListBarField } from '@layout/interfaces';
import { TimesheetField } from '@timesheet/classes/types';
import { TimesheetApprovalHistoryListView } from '@timesheet/components/approval/timesheetApprovalHistory/list/TimesheetApprovalHistoryListView';
import { WithTimesheetApproval, withTimesheetApproval } from '@timesheet/hoc/withTimesheetApproval';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  compose,
  HandleCreators,
  lifecycle,
  mapper,
  ReactLifeCycleFunctions,
  StateHandler,
  StateHandlerMap,
  StateUpdaters,
  withHandlers,
  withStateHandlers,
} from 'recompose';

interface OwnHandlers {
  handleGoToDetail: (timesheetUid: string) => void;
  handleGoToNext: () => void;
  handleGoToPrevious: () => void;
  handleReloading: () => void;
  handleChangeSize: (value: number) => void;
  handleChangeOrder: (field: IListBarField) => void;
  handleChangeSort: (direction: SortDirection) => void;
}

interface OwnOptions {
  orderBy?: string | undefined;
  direction?: string | undefined;
  page?: number | undefined;
  size?: number | undefined;
}

interface OwnState {
  orderBy: string | undefined;
  direction: string | undefined;
  page: number;
  size: number;
}

interface OwnStateUpdaters extends StateHandlerMap<OwnState> {
  stateNext: StateHandler<OwnState>;
  statePrevious: StateHandler<OwnState>;
  stateReloading: StateHandler<OwnState>;
  stateOrdering: StateHandler<OwnState>;
  stateSorting: StateHandler<OwnState>;
  stateSizing: StateHandler<OwnState>;
}

export type ApprovalHistoryListProps
  = WithTimesheetApproval
  & WithUser
  & WithLayout
  & WithNavBottom
  & RouteComponentProps
  & InjectedIntlProps
  & OwnOptions
  & OwnHandlers
  & OwnState
  & OwnStateUpdaters;

const createProps: mapper<ApprovalHistoryListProps, OwnState> = (props: ApprovalHistoryListProps): OwnState => {
  const { orderBy, direction, page, size } = props;
  const { request } = props.timesheetApprovalState.all;

  return {
    orderBy: request && request.filter && request.filter.query && request.filter.query.orderBy || orderBy || 'uid',
    direction: request && request.filter && request.filter.query && request.filter.query.direction || direction || 'descending',
    page: request && request.filter && request.filter.query && request.filter.query.page || page || 1,
    size: request && request.filter && request.filter.query && request.filter.query.size || size || 10,
  };
};

const stateUpdaters: StateUpdaters<OwnOptions, OwnState, OwnStateUpdaters> = {
  stateNext: (prevState: OwnState) => () => ({
    page: prevState.page + 1,
  }),
  statePrevious: (prevState: OwnState) => () => ({
    page: prevState.page - 1,
  }),
  stateReloading: (prevState: OwnState) => () => ({
    page: 1,
  }),
  stateOrdering: (prevState: OwnState) => (field: IListBarField) => ({
    orderBy: field.id,
    page: 1,
  }),
  stateSorting: (prevState: OwnState) => (direction: SortDirection) => ({
    direction,
    page: 1,
  }),
  stateSizing: (prevState: OwnState) => (size: number) => ({
    size,
    page: 1,
  }),
};

const handlerCreators: HandleCreators<ApprovalHistoryListProps, OwnHandlers> = {
  handleGoToDetail: (props: ApprovalHistoryListProps) => (timesheetUid) => {
    const { history } = props;
    const { isLoading } = props.timesheetApprovalState.all;

    if (!isLoading) {
      history.push(`/timesheet/approval/${timesheetUid}`);
    }
  },
  handleGoToNext: (props: ApprovalHistoryListProps) => () => {
    props.stateNext();
  },
  handleGoToPrevious: (props: ApprovalHistoryListProps) => () => {
    props.statePrevious();
  },
  handleReloading: (props: ApprovalHistoryListProps) => () => {
    props.stateReloading();

    // force re-load from api
    loadData(props);
  },
  handleChangeOrder: (props: ApprovalHistoryListProps) => (field: IListBarField) => {
    props.stateOrdering(field);
  },
  handleChangeSize: (props: ApprovalHistoryListProps) => (value: number) => {
    props.stateSizing(value);
  },
  handleChangeSort: (props: ApprovalHistoryListProps) => (direction: SortDirection) => {
    props.stateSorting(direction);
  }
};

const lifecycles: ReactLifeCycleFunctions<ApprovalHistoryListProps, OwnState> = {
  componentDidMount() {
    const {
      handleGoToNext, handleGoToPrevious, handleReloading,
      handleChangeOrder, handleChangeSize, handleChangeSort,
      layoutDispatch, navBottomDispatch,
      history, intl
    } = this.props;

    // const { isLoading, response } = this.props.timesheetApprovalState.all;

    layoutDispatch.changeView({
      uid: AppMenu.TimesheetApprovalHistory,
      parentUid: AppMenu.Timesheet,
      title: intl.formatMessage({ id: 'timesheet.approval.history.title' }),
      subTitle: intl.formatMessage({ id: 'timesheet.subTitle' })
    });

    layoutDispatch.modeListOn();
    layoutDispatch.searchShow();
    layoutDispatch.actionCentreShow();

    navBottomDispatch.assignCallbacks({
      onNextCallback: handleGoToNext,
      onPrevCallback: handleGoToPrevious,
      onSyncCallback: handleReloading,
      onOrderCallback: handleChangeOrder,
      onDirectionCallback: handleChangeSort,
      onAddCallback: () => history.push('/timesheet/entry'),
      onSizeCallback: handleChangeSize,
    });

    const items = Object.keys(TimesheetField)
      .map(key => ({ id: key, name: TimesheetField[key] }));

    navBottomDispatch.assignFields(items);

    // only load data when response are empty
    loadData(this.props);
    // if (!isLoading && !response) {
    // }
  },
  componentDidUpdate(props: ApprovalHistoryListProps, state: OwnState) {
    // only load when these props are different
    if (
      this.props.orderBy !== props.orderBy ||
      this.props.direction !== props.direction ||
      this.props.page !== props.page ||
      this.props.size !== props.size
    ) {
      loadData(this.props);
    }
  },
  componentWillUnmount() {
    const { layoutDispatch, navBottomDispatch } = this.props;
    // const { view } = this.props.layoutState;
    const { loadAllDispose } = this.props.timesheetApprovalDispatch;

    layoutDispatch.changeView(null);
    layoutDispatch.modeListOff();
    layoutDispatch.searchHide();
    layoutDispatch.modeSearchOff();
    layoutDispatch.actionCentreHide();
    layoutDispatch.moreHide();

    navBottomDispatch.dispose();

    // dispose 'get all' from 'redux store' when the page is 'out of project registration' context 
    loadAllDispose();
    // if (view && view.uid !== AppMenu.TimesheetApprovalHistory) {
    // }
  }
};

const loadData = (props: ApprovalHistoryListProps): void => {
  const { orderBy, direction, page, size } = props;
  const { user } = props.userState;
  const { loadAllRequest } = props.timesheetApprovalDispatch;
  const { alertAdd } = props.layoutDispatch;

  if (user) {
    loadAllRequest({
      filter: {
        companyUid: undefined,
        status: 'complete',
        query: {
          direction,
          orderBy,
          page,
          size,
          find: undefined,
          findBy: undefined,
        }
      }
    });
  } else {
    alertAdd({
      time: new Date(),
      message: 'Unable to find current user state'
    });
  }
};

export const TimesheetApprovalHistoryList = compose<ApprovalHistoryListProps, OwnOptions>(
  withTimesheetApproval,
  withUser,
  withLayout,
  withNavBottom,
  withRouter,
  injectIntl,
  withStateHandlers<OwnState, OwnStateUpdaters, OwnOptions>(createProps, stateUpdaters),
  withHandlers<ApprovalHistoryListProps, OwnHandlers>(handlerCreators),
  lifecycle<ApprovalHistoryListProps, OwnState>(lifecycles),
)(TimesheetApprovalHistoryListView);