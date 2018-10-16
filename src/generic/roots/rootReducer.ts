<<<<<<< HEAD
import { employeeMyReducer } from '@account/store/reducers';
import accountReducers from '@account/store/reducers/accountReducers';
import commonReducers from '@common/store/reducers/commonReducers';
import { IAppState } from '@generic/interfaces';
import { appBarReducer, layoutReducer, listBarReducer, notificationReducer } from '@layout/store/reducers';
import { userReducer } from '@layout/store/reducers/userReducer';
import lookupReducers from '@lookup/store/reducers/lookupReducers';
import projectReducers from '@project/store/reducers/projectReducers';
import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { reducer as oidcReducer } from 'redux-oidc';

export const rootReducer = combineReducers<IAppState>({
  user: userReducer,
  layout: layoutReducer,
  oidc: oidcReducer,
  account: employeeMyReducer,
  notification: notificationReducer,
  form: reduxFormReducer,
  appBar: appBarReducer,
  navBottom: listBarReducer,

  /* modules */
  ...commonReducers,
  ...lookupReducers,
  ...accountReducers,
  ...projectReducers
=======
import { employeeMyReducer } from '@account/store/reducers';
import accountReducers from '@account/store/reducers/accountReducers';
import commonReducers from '@common/store/reducers/commonReducers';
import expenseReducers from '@expense/store/reducers/expenseReducers';
import financeReducers from '@finance/store/reducers/financeReducers';
import { IAppState } from '@generic/interfaces';
import { appBarReducer, layoutReducer, listBarReducer, notificationReducer } from '@layout/store/reducers';
import leaveRequestReducers from '@leave/store/reducers/leaveRequestReducers';
import lookupReducers from '@lookup/store/reducers/lookupReducers';
import mileageReducers from '@mileage/store/reducers/mileageReducers';
import projectReducers from '@project/store/reducers/projectReducers';
import purchaseReducers from '@purchase/store/reducers/purchaseReducers';
import timesheetReducers from '@timesheet/store/reducers/timesheetReducers';
import travelReducers from '@travel/store/reducers/travelReducer';
import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import { reducer as oidcReducer } from 'redux-oidc';

export const rootReducer = combineReducers<IAppState>({
  layout: layoutReducer,
  oidc: oidcReducer,
  account: employeeMyReducer,
  notification: notificationReducer,
  form: reduxFormReducer,
  appBar: appBarReducer,
  listBar: listBarReducer,

  /* modules */
  ...commonReducers,
  ...lookupReducers,
  ...accountReducers,
  ...projectReducers,
  ...timesheetReducers
  ...financeReducers,
  ...expenseReducers
  ...mileageReducers,
  ...leaveRequestReducers,
  ...travelReducers,
  ...purchaseReducers,
>>>>>>> develop
});