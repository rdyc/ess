import { IBasePagingFilter } from '@generic/interfaces';
import { IDataBindResult } from '@layout/components/pages';
import { WithUser, withUser } from '@layout/hoc/withUser';
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
  StateHandlerMap,
  StateUpdaters,
  withHandlers,
  withStateHandlers,
} from 'recompose';

import { IKPIEmployeeGetAllFilter } from '@kpi/classes/filter';
import { IKPIEmployee } from '@kpi/classes/response';
import { KPIEmployeeField } from '@kpi/classes/types';
import { withKPIEmployee, WithKPIEmployee } from '@kpi/hoc/withKPIEmployee';
import { kpiMessage } from '@kpi/locales/messages/kpiMessage';
import { ICollectionValue } from '@layout/classes/core';
import { KPIHRInputListView } from './KPIHRInputListView';

interface IOwnRouteParams {
  employeeUid: string;
}

interface IOwnOption {
}

interface IOwnState {
  fields: ICollectionValue[];
}

interface IOwnStateUpdater extends StateHandlerMap<IOwnState> {
}

interface IOwnHandler {
  handleOnLoadApi: (filter?: IBasePagingFilter, resetPage?: boolean, isRetry?: boolean) => void;
  handleOnLoadApiSearch: (find?: string, findBy?: string) => void;
  handleOnBind: (item: IKPIEmployee, index: number) => IDataBindResult;
}

export type KPIHRInputListProps 
  = IOwnOption
  & RouteComponentProps<IOwnRouteParams>
  & IOwnState
  & IOwnStateUpdater
  & IOwnHandler
  & WithUser
  & WithKPIEmployee
  & InjectedIntlProps
  & RouteComponentProps;

const createProps: mapper<KPIHRInputListProps, IOwnState> = (): IOwnState => {
  const state: IOwnState = {
    fields: Object.keys(KPIEmployeeField).map(key => ({
      value: key,
      name: KPIEmployeeField[key]
    }))
  };

  return state;
};

const stateUpdaters: StateUpdaters<KPIHRInputListProps, IOwnState, IOwnStateUpdater> = {
  
};

const handlerCreators: HandleCreators<KPIHRInputListProps, IOwnHandler> = {
  handleOnLoadApi: (props: KPIHRInputListProps) => (params?: IBasePagingFilter, resetPage?: boolean, isRetry?: boolean) => {
    const { isExpired, isLoading, request } = props.kpiEmployeeState.all;
    const { loadAllRequest } = props.kpiEmployeeDispatch;
    const { user } = props.userState;

    if (user && !isLoading && props.match.params.employeeUid) {
      // predefined filter
      const filter: IKPIEmployeeGetAllFilter = {
        find: request && request.filter && request.filter.find,
        findBy: request && request.filter && request.filter.findBy,
        orderBy: params && params.orderBy || request && request.filter && request.filter.orderBy,
        direction: params && params.direction || request && request.filter && request.filter.direction,
        page: resetPage ? undefined : params && params.page || request && request.filter && request.filter.page,
        size: params && params.size || request && request.filter && request.filter.size
      };

      // when request is defined, then compare the filter props
      const shouldLoad = !shallowEqual(filter, request && request.filter || {});
      const isEmployeeChanged = !shallowEqual(props.match.params.employeeUid, request && request.employeeUid || '');
      
      // only load when request parameter are differents
      if (isExpired || shouldLoad || isRetry || isEmployeeChanged) {
        loadAllRequest({
          filter,
          employeeUid: props.match.params.employeeUid
        });
      }
    }
  },
  handleOnLoadApiSearch: (props: KPIHRInputListProps) => (find?: string, findBy?: string) => {
    const { isLoading, request } = props.kpiEmployeeState.all;
    const { loadAllRequest } = props.kpiEmployeeDispatch;
    const { user } = props.userState;

    if (user && !isLoading) {
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
          filter,
          employeeUid : props.match.params.employeeUid
        });
      }
    }
  },
  handleOnBind: (props: KPIHRInputListProps) => (item: IKPIEmployee, index: number) => ({
    key: index,
    primary: item.year.toString(),
    secondary: `Semester ${props.intl.formatNumber(item.period)}`,
    tertiary: `${props.intl.formatNumber(item.totalScore)} %`,
    quaternary: item.isFinal && props.intl.formatMessage(kpiMessage.employee.field.isFinalTrue) || props.intl.formatMessage(kpiMessage.employee.field.isFinalFalse),
    quinary: item.changes && item.changes.updated && item.changes.updated.fullName || item.changes && item.changes.created && item.changes.created.fullName || 'N/A',
    senary: item.changes && moment(item.changes.updatedAt ? item.changes.updatedAt : item.changes.createdAt).fromNow() || '?'    
  }),
};

const lifecycles: ReactLifeCycleFunctions<KPIHRInputListProps, IOwnState> = {
  componentDidUpdate(prevProps: KPIHRInputListProps) {
    // 
  }
};

export const KPIHRInputList = compose(
  setDisplayName('KPIHRInputList'),
  withUser,
  withKPIEmployee,
  withRouter,
  injectIntl,
  withStateHandlers(createProps, stateUpdaters),
  withHandlers(handlerCreators),
  lifecycle(lifecycles),
)(KPIHRInputListView);