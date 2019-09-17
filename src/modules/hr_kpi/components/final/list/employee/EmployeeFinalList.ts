import { IBasePagingFilter } from '@generic/interfaces';
import { ICollectionValue } from '@layout/classes/core';
import { IDataBindResult } from '@layout/components/pages';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { GlobalFormat } from '@layout/types';
import * as moment from 'moment';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  compose,
  HandleCreators,
  lifecycle,
  mapper,
  ReactLifeCycleFunctions,
  setDisplayName,
  shallowEqual,
  StateHandler,
  StateHandlerMap,
  StateUpdaters,
  withHandlers,
  withStateHandlers,
} from 'recompose';

import { IEmployeeAllFilter } from '@account/classes/filters';
import { IEmployee } from '@account/classes/response';
import { AccountEmployeeField } from '@account/classes/types';
import { WithAccountEmployee, withAccountEmployee } from '@account/hoc/withAccountEmployee';
import { IAccountEmployeeFilterResult } from './EmployeeFinalFilter';
import { EmployeeFinalListView } from './EmployeeFinalListView';

interface IOwnOption {
  
}

interface IOwnState extends IAccountEmployeeFilterResult {
  fields: ICollectionValue[];
  isFilterOpen: boolean;
}

interface IOwnStateUpdater extends StateHandlerMap<IOwnState> {
  setFilterVisibility: StateHandler<IOwnState>;
  setFilterApplied: StateHandler<IOwnState>;
}

interface IOwnHandler {
  handleOnLoadApi: (filter?: IBasePagingFilter, resetPage?: boolean, isRetry?: boolean) => void;
  handleOnLoadApiSearch: (find?: string, findBy?: string) => void;
  handleOnBind: (item: IEmployee, index: number) => IDataBindResult;
  handleFilterVisibility: (event: React.MouseEvent<HTMLElement>) => void;
  handleFilterApplied: (filter: IAccountEmployeeFilterResult) => void;
  handleFilterBadge: () => boolean;
}

export type AccountEmployeeFinalListProps 
  = IOwnOption
  & IOwnState
  & IOwnStateUpdater
  & IOwnHandler
  & WithUser
  & WithAccountEmployee
  & InjectedIntlProps
  & RouteComponentProps;

const createProps: mapper<AccountEmployeeFinalListProps, IOwnState> = (props: AccountEmployeeFinalListProps): IOwnState => {
  const { request } = props.accountEmployeeState.all;
  
  // default state
  const state: IOwnState = {
    isFilterOpen: false,
    fields: Object.keys(AccountEmployeeField).map(key => ({ 
      value: key, 
      name: AccountEmployeeField[key] 
    }))
  };

  // fill from previous request if any
  if (request && request.filter) {
    state.companyUids = request.filter.companyUids,
    state.positionUids = request.filter.positionUids,
    state.useAccess = request.filter.useAccess,
    state.useSuperOrdinate = false,
    state.isActive = request.filter.isActive;
  } else {
    state.useAccess = true,
    state.isActive = true,
    state.useSuperOrdinate = false;
  }

  return state;
};

const stateUpdaters: StateUpdaters<AccountEmployeeFinalListProps, IOwnState, IOwnStateUpdater> = {
  setFilterVisibility: (state: IOwnState) => (): Partial<IOwnState> => ({
    isFilterOpen: !state.isFilterOpen
  }),
  setFilterApplied: (state: IOwnState) => (filter: IAccountEmployeeFilterResult): Partial<IOwnState> => ({
    ...filter,
    isFilterOpen: false
  })
};

const handlerCreators: HandleCreators<AccountEmployeeFinalListProps, IOwnHandler> = {
  handleOnLoadApi: (props: AccountEmployeeFinalListProps) => (params?: IBasePagingFilter, resetPage?: boolean, isRetry?: boolean) => {
    const { isExpired, isLoading, request } = props.accountEmployeeState.all;
    const { loadAllRequest } = props.accountEmployeeDispatch;

    if (props.userState.user && !isLoading) {
      // predefined filter
      const filter: IEmployeeAllFilter = {
        companyUids: props.companyUids,
        positionUids: props.positionUids,
        useAccess: props.useAccess,
        isActive: props.isActive,
        find: request && request.filter && request.filter.find,
        findBy: request && request.filter && request.filter.findBy,
        orderBy: params && params.orderBy || request && request.filter && request.filter.orderBy,
        direction: params && params.direction || request && request.filter && request.filter.direction,
        page: resetPage ? undefined : params && params.page || request && request.filter && request.filter.page,
        size: params && params.size || request && request.filter && request.filter.size
      };

      // when request is defined, then compare the filter props
      const shouldLoad = !shallowEqual(filter, request && request.filter || {});
      
      // only load when request parameter are differents
      if (isExpired || shouldLoad || isRetry) {
        loadAllRequest({
          filter
        });
      }
    }
  },
  handleOnLoadApiSearch: (props: AccountEmployeeFinalListProps) => (find?: string, findBy?: string) => {
    const { isLoading, request } = props.accountEmployeeState.all;
    const { loadAllRequest } = props.accountEmployeeDispatch;

    if (props.userState.user && !isLoading) {
      // predefined filter
      const filter = {
        ...request && request.filter,
        find,
        findBy,
        page: undefined
      };
      
      // compare request
      const shouldLoad = !shallowEqual(filter, request && request.filter || {});
      
      // only load when request parameter are differents
      if (shouldLoad) {
        loadAllRequest({
          filter
        });
      }
    }
  },
  handleOnBind: (props: AccountEmployeeFinalListProps) => (item: IEmployee, index: number) => ({
    key: index,
    primary: item.uid,
    secondary: item.company ? item.company.name : 'N/A',
    tertiary: item.fullName,
    quaternary: props.intl.formatDate(item.joinDate, GlobalFormat.Date),
    quinary: item.changes && item.changes.updated && item.changes.updated.fullName || item.changes && item.changes.created && item.changes.created.fullName || 'N/A',
    senary: item.changes && moment(item.changes.updatedAt ? item.changes.updatedAt : item.changes.createdAt).fromNow() || '?'
  }),
  handleFilterVisibility: (props: AccountEmployeeFinalListProps) => (event: React.MouseEvent<HTMLElement>) => {
    props.setFilterVisibility();
  },
  handleFilterApplied: (props: AccountEmployeeFinalListProps) => (filter: IAccountEmployeeFilterResult) => {
    props.setFilterApplied(filter);
  },
  handleFilterBadge: (props: AccountEmployeeFinalListProps) => () => {
    return props.companyUids !== undefined || 
      props.positionUids !== undefined || 
      props.useAccess === true || 
      props.isActive === true;
  },
};

const lifecycles: ReactLifeCycleFunctions<AccountEmployeeFinalListProps, IOwnState> = {
  componentDidUpdate(prevProps: AccountEmployeeFinalListProps) {
    // track any changes in filter props
    const isFilterChanged = !shallowEqual(
      {
        companyUids: this.props.companyUids,
        positionUids: this.props.positionUids,
        isActive: this.props.isActive,
        useAccess: this.props.useAccess,
      },
      {
        companyUids: prevProps.companyUids,
        positionUids: prevProps.positionUids,
        isActive: prevProps.isActive,
        useAccess: prevProps.useAccess,
      }
    );

    if (isFilterChanged) {
      this.props.handleOnLoadApi(undefined, true);
    }
  }
};

export const EmployeeFinalList = compose(
  setDisplayName('EmployeeFinalList'),
  withUser,
  withAccountEmployee,
  withRouter,
  injectIntl,
  withStateHandlers(createProps, stateUpdaters),
  withHandlers(handlerCreators),
  lifecycle(lifecycles)
)(EmployeeFinalListView);