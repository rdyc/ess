import { IQuerySingleState } from '@generic/interfaces';
import { INotifPeriodDeleteRequest } from '@hr.notification/classes/queries/period';
import { NotifPeriodAction as Action } from '@hr.notification/store/actions';
import { Reducer } from 'redux';

const initialState: IQuerySingleState<INotifPeriodDeleteRequest, undefined> = {
  isExpired: false,
  isError: false,
  isLoading: false,
  request: undefined,
  response: undefined,
  errors: undefined
};

const reducer: Reducer<IQuerySingleState<INotifPeriodDeleteRequest, undefined>> = (state = initialState, action) => {
  switch (action.type) {
    case Action.DELETE_REQUEST: return { ...state, isLoading: true, isError: false, request: action.payload };
    case Action.DELETE_SUCCESS: return { ...state, isLoading: false, isError: false, response: action.payload };
    case Action.DELETE_ERROR: return { ...state, isLoading: false, isError: true, errors: action.payload };
    case Action.DELETE_DISPOSE: return { ...state, ...initialState };
    
    default: return state;
  }
};

export { reducer as notifPeriodDeleteReducer };