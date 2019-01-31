import { IQuerySingleState } from '@generic/interfaces';
import { ILookupVersionPatchRequest } from '@lookup/classes/queries';
import { ILookupVersion } from '@lookup/classes/response';
import { LookupVersionAction as Action } from '@lookup/store/actions';
import { Reducer } from 'redux';

const initialState: IQuerySingleState<ILookupVersionPatchRequest, ILookupVersion> = {
  request: undefined,
  response: undefined,
  isError: false,
  isLoading: false,
  errors: undefined,
};

const reducer: Reducer<IQuerySingleState<ILookupVersionPatchRequest, ILookupVersion>> = (state = initialState, action) => {
  switch (action.type) {
    case Action.PATCH_REQUEST: return { ...state, isLoading: true, request: action.payload };
    case Action.PATCH_SUCCESS: return { ...state, isLoading: false, response: action.payload };
    case Action.PATCH_ERROR: return { ...state, isLoading: false, isError: true, errors: action.payload };
    case Action.PATCH_DISPOSE: return { ...state, isLoading: false, isError: false, request: undefined, response: undefined };
    
    default: return state;
  }
};

export { reducer as lookupVersionPatchReducer };