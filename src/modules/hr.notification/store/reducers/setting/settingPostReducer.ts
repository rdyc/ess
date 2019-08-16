import { IQuerySingleState } from '@generic/interfaces';
import { ISettingPostRequest } from '@hr.notification/classes/queries/setting';
import { ISetting } from '@hr.notification/classes/response';
import { SettingAction as Action } from '@hr.notification/store/actions';
import { Reducer } from 'redux';

const initialState: IQuerySingleState<ISettingPostRequest, ISetting> = {
  isExpired: false,
  isError: false,
  isLoading: false,
  request: undefined,
  response: undefined,
  errors: undefined
};

const reducer: Reducer<IQuerySingleState<ISettingPostRequest, ISetting>> = (state = initialState, action) => {
  switch (action.type) {
    case Action.POST_REQUEST: return { ...state, isLoading: true, isError: false, request: action.payload };
    case Action.POST_SUCCESS: return { ...state, isLoading: false, isError: false, response: action.payload };
    case Action.POST_ERROR: return { ...state, isLoading: false, isError: true, errors: action.payload };
    case Action.POST_DISPOSE: return { ...state, ...initialState };
    
    default: return state;
  }
};

export { reducer as settingPostReducer };