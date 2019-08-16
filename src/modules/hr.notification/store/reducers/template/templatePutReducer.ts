import { IQuerySingleState } from '@generic/interfaces';
import { ITemplatePutRequest } from '@hr.notification/classes/queries/template';
import { ITemplate } from '@hr.notification/classes/response';
import { TemplateAction as Action } from '@hr.notification/store/actions';
import { Reducer } from 'redux';

const initialState: IQuerySingleState<ITemplatePutRequest, ITemplate> = {
  isExpired: false,
  isError: false,
  isLoading: false,
  request: undefined,
  response: undefined,
  errors: undefined
};

const reducer: Reducer<IQuerySingleState<ITemplatePutRequest, ITemplate>> = (state = initialState, action) => {
  switch (action.type) {
    case Action.PUT_REQUEST: return { ...state, isLoading: true, isError: false, request: action.payload };
    case Action.PUT_SUCCESS: return { ...state, isLoading: false, isError: false, response: action.payload };
    case Action.PUT_ERROR: return { ...state, isLoading: false, isError: true, errors: action.payload };
    case Action.PUT_DISPOSE: return { ...state, ...initialState };
    
    default: return state;
  }
};

export { reducer as templatePutReducer };