import {
  // currencyGetAllReducer,
  // currencyGetByIdReducer,
  // currencyGetListReducer,
  holidayGetAllReducer,
  holidayGetByIdReducer,
  holidayGetListReducer,
  leaveGetAllReducer,
  leaveGetByIdReducer,
  leaveGetListReducer,
  leavePutReducer,
  menuGetAllReducer,
  menuGetByIdReducer,
  // positionGetAllReducer,
  // positionGetByIdReducer,
  // positionGetListReducer,
  menuGetListReducer,
} from '@lookup/store/reducers';

import { lookupCompanyReducers } from './company';
import { lookupCurrencyReducers } from './currency';
import { lookupCustomerReducers } from './customer';
import { lookupDiemReducers } from './diem';
import { leaveReducers } from './leave';
import { mileageExceptionReducers } from './mileageException/mileageExceptionReducers';
import { lookupPositionReducers } from './position';
import { lookupRoleReducers } from './role';
import { systemLimitReducers } from './systemLimit';

const lookupReducers = {
  ...lookupCustomerReducers,
  ...lookupCompanyReducers,
  ...lookupRoleReducers,
  ...lookupPositionReducers,
  ...leaveReducers,
  ...mileageExceptionReducers,
  ...systemLimitReducers,
  ...lookupDiemReducers,
  
  ...lookupCurrencyReducers,

  menuGetAll: menuGetAllReducer,
  menuGetById: menuGetByIdReducer,
  menuGetList: menuGetListReducer,

  // positionGetAll: positionGetAllReducer,
  // positionGetById: positionGetByIdReducer,
  // positionGetList: positionGetListReducer,

  // currencyGetAll: currencyGetAllReducer,
  // currencyGetList: currencyGetListReducer,
  // currencyGetById: currencyGetByIdReducer,

  holidayGetAll: holidayGetAllReducer,
  holidayGetList: holidayGetListReducer,
  holidayGetById: holidayGetByIdReducer,

  leaveGetAll: leaveGetAllReducer,
  leaveGetList: leaveGetListReducer,
  leaveGetById: leaveGetByIdReducer,
  leavePut: leavePutReducer
};

export default lookupReducers;
