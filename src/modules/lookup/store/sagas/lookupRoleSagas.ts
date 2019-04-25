import { handleResponse } from '@layout/helper/handleResponse';
import { layoutAlertAdd } from '@layout/store/actions';
import {
  LookupRoleAction as Action,
  lookupRoleDeleteError,
  lookupRoleDeleteRequest,
  lookupRoleDeleteSuccess,
  lookupRoleGetAllDispose,
  lookupRoleGetAllError,
  lookupRoleGetAllRequest,
  lookupRoleGetAllSuccess,
  // lookupRoleGetByIdDispose,
  lookupRoleGetByIdDispose,
  lookupRoleGetByIdError,
  lookupRoleGetByIdRequest,
  lookupRoleGetByIdSuccess,
  lookupRoleGetListError,
  lookupRoleGetListRequest,
  lookupRoleGetListSuccess,
  lookupRolePostError,
  lookupRolePostRequest,
  lookupRolePostSuccess,
  lookupRolePutError,
  lookupRolePutRequest,
} from '@lookup/store/actions';
import saiyanSaga from '@utils/saiyanSaga';
import * as qs from 'qs';
import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { IApiResponse } from 'utils';

function* watchFetchAllRequest() {
  const worker = (action: ReturnType<typeof lookupRoleGetAllRequest>) => {
    const params = qs.stringify(action.payload.filter, { 
      allowDots: true, 
      skipNulls: true
    });
    
    return saiyanSaga.fetch({
      method: 'get',
      path: `/v1/lookup/roles?${params}`, 
      successEffects: (response: IApiResponse) => ([
        put(lookupRoleGetAllSuccess(response.body))
      ]), 
      failureEffects: (response: IApiResponse) => ([
        put(lookupRoleGetAllError(response)),
      ]), 
      errorEffects: (error: TypeError) => ([
        put(lookupRoleGetAllError(error.message)),
      ])
    });
  };

  yield takeEvery(Action.GET_ALL_REQUEST, worker);
}

function* watchFetchListRequest() {
  const worker = (action: ReturnType<typeof lookupRoleGetListRequest>) => {
    const params = qs.stringify(action.payload.filter, { 
      allowDots: true, 
      skipNulls: true
    });

    return saiyanSaga.fetch({
      method: 'get',
      path: `/v1/lookup/roles/list?${params}`,
      successEffects: (response: IApiResponse) => ([
        put(lookupRoleGetListSuccess(response.body)),
      ]), 
      failureEffects: (response: IApiResponse) => ([
        put(lookupRoleGetListError(response)),
      ]), 
      errorEffects: (error: TypeError) => ([
        put(lookupRoleGetListError(error.message)),
      ])
    });
  };

  yield takeEvery(Action.GET_LIST_REQUEST, worker);
}

function* watchFetchByIdRequest() {
  const worker = (action: ReturnType<typeof lookupRoleGetByIdRequest>) => {
    return saiyanSaga.fetch({
      method: 'get',
      path: `/v1/lookup/roles/${action.payload.companyUid}/${action.payload.roleUid}`,
      successEffects: (response: IApiResponse) => ([
        put(lookupRoleGetByIdSuccess(response.body)),
      ]), 
      failureEffects: (response: IApiResponse) => ([
        put(lookupRoleGetByIdError(response)),
      ]), 
      errorEffects: (error: TypeError) => ([
        put(lookupRoleGetByIdError(error.message)),
      ])
    });
  };
  
  yield takeEvery(Action.GET_BY_ID_REQUEST, worker);
}

function* watchPostRequest() {
  const worker = (action: ReturnType<typeof lookupRolePostRequest>) => {
    return saiyanSaga.fetch({
      method: 'post',
      path: `/v1/lookup/roles/${action.payload.companyUid}`,
      payload: action.payload.data,
      successEffects: (response: IApiResponse) => [
        put(lookupRoleGetAllDispose()),
        put(lookupRoleGetByIdDispose()),
        put(lookupRolePostSuccess(response.body))
      ],
      successCallback: (response: IApiResponse) => {
        action.payload.resolve(response.body.data);
      },
      failureEffects: (response: IApiResponse) => [
        put(lookupRolePostError(response.statusText))
      ],
      failureCallback: (response: IApiResponse) => {
        const result = handleResponse(response);
        
        action.payload.reject(result);
      },
      errorEffects: (error: TypeError) => [
        put(lookupRolePostError(error.message)),
        put(
          layoutAlertAdd({
            time: new Date(),
            message: error.message
          })
        )
      ],
      errorCallback: (error: any) => {
        action.payload.reject(error);
      }
    });
  };

  yield takeEvery(Action.POST_REQUEST, worker);
}

function* watchPutRequest() {
  const worker = (action: ReturnType<typeof lookupRolePutRequest>) => {
    return saiyanSaga.fetch({
      method: 'put',
      path: `/v1/lookup/roles/${action.payload.companyUid}/${action.payload.roleUid}`,
      payload: action.payload.data,
      successEffects: (response: IApiResponse) => [
        put(lookupRoleGetByIdDispose()),
        put(lookupRoleGetAllDispose()),
        put(lookupRoleGetByIdSuccess(response.body))
      ],
      successCallback: (response: IApiResponse) => {
        action.payload.resolve(response.body.data);
      },
      failureEffects: (response: IApiResponse) => [
        put(lookupRolePutError(response.statusText))
      ],
      failureCallback: (response: IApiResponse) => {
        const result = handleResponse(response);
        
        action.payload.reject(result);
      },
      errorEffects: (error: TypeError) => [
        put(lookupRolePutError(error.message)),
        put(
          layoutAlertAdd({
            time: new Date(),
            message: error.message
          })
        )
      ],
      errorCallback: (error: any) => {
        action.payload.reject(error);
      }
    });
  };

  yield takeEvery(Action.PUT_REQUEST, worker);
}

function* watchDeleteRequest() {
  const worker = (action: ReturnType<typeof lookupRoleDeleteRequest>) => {
    return saiyanSaga.fetch({
      method: 'delete',
      path: `/v1/lookup/roles`,
      payload: action.payload.data,
      successEffects: (response: IApiResponse) => [
        put(lookupRoleGetAllDispose()),
        put(lookupRoleDeleteSuccess(response.body)),
      ],
      successCallback: (response: IApiResponse) => {
        action.payload.resolve(response.body.data);
      },
      failureEffects: (response: IApiResponse) => [
        put(lookupRoleDeleteError(response.statusText))
      ],
      failureCallback: (response: IApiResponse) => {
        const result = handleResponse(response);
        
        action.payload.reject(result);
      },
      errorEffects: (error: TypeError) => [
        put(lookupRoleDeleteError(error.message)),
        put(
          layoutAlertAdd({
            time: new Date(),
            message: error.message
          })
        )
      ],
      errorCallback: (error: any) => {
        action.payload.reject(error);
      }
    });
  };

  yield takeEvery(Action.DELETE_REQUEST, worker);
}

function* lookupRoleSagas() {
  yield all([
    fork(watchFetchAllRequest),
    fork(watchFetchListRequest),
    fork(watchFetchByIdRequest),
    fork(watchPostRequest),
    fork(watchPutRequest),
    fork(watchDeleteRequest),
  ]);
}

export default lookupRoleSagas;