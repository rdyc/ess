import {
  FinanceAction as Action,
  financeBulkPostError,
  financeBulkPostRequest,
  financeBulkPostSuccess,
  financeGetAllError,
  financeGetAllRequest,
  financeGetAllSuccess,
  financeGetByIdError,
  financeGetByIdRequest,
  financeGetByIdSuccess,
  financePostError,
  financePostRequest,
  financePostSuccess,
} from '@finance/store/actions';
import { layoutAlertAdd, listBarLoading, listBarMetadata } from '@layout/store/actions';
import saiyanSaga from '@utils/saiyanSaga';
import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { IApiResponse, objectToQuerystring } from 'utils';

function* watchAllFetchRequest() {
  const worker = (action: ReturnType<typeof financeGetAllRequest>) => { 
    return saiyanSaga.fetch({
      method: 'get',
      path: `/v1/approvals/finance/${action.payload.companyUid}/${action.payload.positionUid}${objectToQuerystring(action.payload.filter)}`, 
      successEffects: (response: IApiResponse) => ([
        put(financeGetAllSuccess(response.body)),
        put(listBarMetadata(response.body.metadata))
      ]), 
      failureEffects: (response: IApiResponse) => ([
        put(financeGetAllError(response.body)),
        put(layoutAlertAdd({
          time: new Date(),
          message: response.statusText,
          details: response
        })),
      ]), 
      errorEffects: (error: TypeError) => ([
        put(financeGetAllError(error.message)),
        put(layoutAlertAdd({
          time: new Date(),
          message: error.message
        }))
      ]),
      finallyEffects: [
        put(listBarLoading(false))
      ]
    });
  };
  
  yield takeEvery(Action.GET_ALL_REQUEST, worker);
}

function* watchByIdFetchRequest() {
  const worker = (action: ReturnType<typeof financeGetByIdRequest>) => {
    return saiyanSaga.fetch({
      method: 'get',
      path: `/v1/approvals/finance/${action.payload.companyUid}/${action.payload.positionUid}/${action.payload.financeUid}`, 
      successEffects: (response: IApiResponse) => ([
        put(financeGetByIdSuccess(response.body)),
      ]), 
      failureEffects: (response: IApiResponse) => ([
        put(financeGetByIdError(response.statusText)),
        put(layoutAlertAdd({
          time: new Date(),
          message: response.statusText,
          details: response
        })),
      ]), 
      errorEffects: (error: TypeError) => ([
        put(financeGetByIdError(error.message)),
        put(layoutAlertAdd({
          time: new Date(),
          message: error.message
        }))
      ])
    });
  };

  yield takeEvery(Action.GET_BY_ID_REQUEST, worker);
}

function* watchPostFetchRequest() {
  const worker = (action: ReturnType<typeof financePostRequest>) => {
    return saiyanSaga.fetch({
      method: 'post',
      path: `/v1/approvals/finance/${action.payload.companyUid}/${action.payload.positionUid}/${action.payload.financeUid}`, 
      payload: action.payload.data, 
      successEffects: (response: IApiResponse) => ([
        put(financePostSuccess(response.body)),
      ]), 
      failureEffects: (response: IApiResponse) => ([
        put(financePostError(response.statusText)),
        put(layoutAlertAdd({
          time: new Date(),
          message: response.statusText,
          details: response
        })),
      ]), 
      errorEffects: (error: TypeError) => ([
        put(financePostError(error.message)),
        put(layoutAlertAdd({
          time: new Date(),
          message: error.message
        }))
      ])
    });
  };

  yield takeEvery(Action.POST_REQUEST, worker);
}

function* watchBulkPostFetchRequest() {
  const worker = (action: ReturnType<typeof financeBulkPostRequest>) => {
    return saiyanSaga.fetch({
      method: 'put',
      path: `/v1/approvals/finance/${action.payload.companyUid}/${action.payload.positionUid}`,
      payload: action.payload.data, 
      successEffects: (response: IApiResponse) => ([
        put(financeBulkPostSuccess(response.body)),
      ]), 
      failureEffects: (response: IApiResponse) => ([
        put(financeBulkPostError(response.statusText)),
        put(layoutAlertAdd({
          time: new Date(),
          message: response.statusText,
          details: response
        })),
      ]), 
      errorEffects: (error: TypeError) => ([
        put(financeBulkPostError(error.message)),
        put(layoutAlertAdd({
          time: new Date(),
          message: error.message
        }))
      ])
    });
  };

  yield takeEvery(Action.BULK_POST_REQUEST, worker);
}

function* financeSagas() {
  yield all([
    fork(watchAllFetchRequest),
    fork(watchByIdFetchRequest),
    fork(watchPostFetchRequest),
    fork(watchBulkPostFetchRequest)
  ]);
}

export default financeSagas;