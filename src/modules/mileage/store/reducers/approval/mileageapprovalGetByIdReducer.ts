import { IQuerySingleState } from '@generic/interfaces';
import { IMileageApprovalGetByIdRequest } from '@mileage/classes/queries';
import { IMileageRequestDetail } from '@mileage/classes/response';
import { MileageApprovalAction as Action } from '@mileage/store/actions';
import { Reducer } from 'redux';

const initialState: IQuerySingleState<IMileageApprovalGetByIdRequest, IMileageRequestDetail> = {
  request: undefined,
  response: undefined,
  isError: false,
  isLoading: false,
  errors: undefined,
};

const reducer: Reducer<IQuerySingleState<IMileageApprovalGetByIdRequest, IMileageRequestDetail>> = (state = initialState, action) => {
  switch (action.type) {
    case Action.GET_BY_ID_REQUEST: return { ...state, isLoading: true, isError: false, request: action.payload };
    case Action.GET_BY_ID_SUCCESS: return { ...state, isLoading: false, isError: false, response: action.payload };
    case Action.GET_BY_ID_ERROR: return { ...state, isLoading: false, isError: true, errors: action.payload };
    case Action.GET_BY_ID_DISPOSE: return initialState;
    
    default: return state;
  }
};

export { reducer as mileageApprovalGetByIdReducer };