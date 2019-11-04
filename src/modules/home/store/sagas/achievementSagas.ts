import saiyanSaga from '@utils/saiyanSaga';
import { all, fork, put, takeEvery } from 'redux-saga/effects';
import { IApiResponse } from 'utils';

import {
  AchievementAction as Action,
  achievementGetError,
  achievementGetRequest,
  achievementGetSuccess,
} from '../actions/achievementActions';

function* watchAllFetchRequest() {
  const worker = (action: ReturnType<typeof achievementGetRequest>) => {
    return saiyanSaga.fetch({
      method: 'GET',
      path: `/v1/achievements/list`,
      successEffects: (response: IApiResponse) => [
        put(achievementGetSuccess(response.body)),
      ],
      failureEffects: (response: IApiResponse) => [
        put(achievementGetError(response))
      ],
      errorEffects: (error: TypeError) => [
        put(achievementGetError(error.message))
      ],
      finallyEffects: [
        // nothing
      ]
    });
  };

  yield takeEvery(Action.GET_REQUEST, worker);
}

function* achievementSagas() {
  yield all([
    fork(watchAllFetchRequest)
  ]);
}

export default achievementSagas;