import accountEmployeeLeaveSagas from '@account/store/sagas/accountEmployeeLeaveSagas';
import accountEmployeeMySagas from '@account/store/sagas/accountEmployeeMySagas';
import accountEmployeeSagas from '@account/store/sagas/accountEmployeeSagas';
import commonActivitySagas from '@common/store/sagas/activitySagas';
import commonCurrencySagas from '@common/store/sagas/currencySagas';
import commonDestinationSagas from '@common/store/sagas/destinationSagas';
import commonDocumentPresalesSagas from '@common/store/sagas/documentPresalesSagas';
import commonDocumentSagas from '@common/store/sagas/documentSagas';
import commonExpenseSagas from '@common/store/sagas/expenseSagas';
import commonLeaveSagas from '@common/store/sagas/leaveSagas';
import commonProjectSagas from '@common/store/sagas/projectSagas';
import commonPurposeSagas from '@common/store/sagas/purposeSagas';
import commonSiteSagas from '@common/store/sagas/siteSagas';
import commonStatusSagas from '@common/store/sagas/statusSagas';
import commonSystemSagas from '@common/store/sagas/systemSagas';
import commonTransportationSagas from '@common/store/sagas/transportationSagas';
import commonUnitSagas from '@common/store/sagas/unitSagas';
import expenseApprovalSagas from '@expense/store/sagas/expenseApprovalSagas';
import expenseSagas from '@expense/store/sagas/expenseRequestSagas';
import financeSagas from '@finance/store/sagas/financeApprovalSagas';
import commonNotificationSagas from '@layout/store/sagas/notificationSagas';
import leaveApprovalSagas from '@leave/store/sagas/leaveApprovalSagas';
import leaveCancellationSagas from '@leave/store/sagas/leaveCancellationSagas';
import leaveRequestSagas from '@leave/store/sagas/leaveRequestSagas';
import lookupCurrencySagas from '@lookup/store/sagas/currencySagas';
import lookupDiemSagas from '@lookup/store/sagas/diemSagas';
import lookupHolidaySagas from '@lookup/store/sagas/holidaySagas';
import lookupLeaveSagas from '@lookup/store/sagas/leaveSagas';
import lookupCompanySagas from '@lookup/store/sagas/lookupCompanySagas';
import lookupCustomerSagas from '@lookup/store/sagas/lookupCustomerSagas';
import lookupRoleSagas from '@lookup/store/sagas/lookupRoleSagas';
import lookupMenuSagas from '@lookup/store/sagas/menuSagas';
import lookupMileageExceptionSagas from '@lookup/store/sagas/mileageExceptionSagas';
import lookupPositionSagas from '@lookup/store/sagas/positionSagas';
import lookupSystemLimitSagas from '@lookup/store/sagas/systemLimitSagas';
import mileageApprovalSagas from '@mileage/store/sagas/approval/mileageApprovalSagas';
import mileageRequestSagas from '@mileage/store/sagas/request/mileageRequestSagas';
import projectAcceptanceSagas from '@project/store/sagas/projectAcceptanceSagas';
import projectApprovalSagas from '@project/store/sagas/projectApprovalSagas';
import projectAssignmentSagas from '@project/store/sagas/projectAssignmentSagas';
import projectOwnerSagas from '@project/store/sagas/projectOwnerSagas';
import projectRegistrationSagas from '@project/store/sagas/projectRegistrationSagas';
import projectSiteSagas from '@project/store/sagas/projectSiteSagas';
import projectStatusSagas from '@project/store/sagas/projectStatusSagas';
import purchaseSagas from '@purchase/store/sagas/purchaseSagas';
import summarySagas from '@summary/store/sagas/summarySagas';
import timesheetApprovalSagas from '@timesheet/store/sagas/timesheetApprovalSagas';
import timesheetEntrySagas from '@timesheet/store/sagas/timesheetEntrySagas';
import timesheetMileagesSagas from '@timesheet/store/sagas/timesheetMileagesSagas';
import travelApprovalSagas from '@travel/store/sagas/travelApprovalSagas';
import travelSagas from '@travel/store/sagas/travelSagas';
import travelSettlementApprovalSagas from '@travel/store/sagas/travelSettlementApprovalSagas';
import travelSettlementSagas from '@travel/store/sagas/travelSettlementSagas';
import { all, fork } from 'redux-saga/effects';

export function* rootSaga() {
  yield all([
    // common
    fork(commonStatusSagas),
    fork(commonActivitySagas),
    fork(commonCurrencySagas),
    fork(commonDocumentSagas),
    fork(commonDocumentPresalesSagas),
    fork(commonLeaveSagas),
    fork(commonProjectSagas),
    fork(commonSiteSagas),
    fork(commonExpenseSagas),
    fork(commonStatusSagas),
    fork(commonNotificationSagas),
    fork(commonDestinationSagas),
    fork(commonPurposeSagas),
    fork(commonTransportationSagas),
    fork(commonSystemSagas),
    fork(commonUnitSagas),

    // lookup
    fork(lookupCustomerSagas),
    fork(lookupMileageExceptionSagas),
    fork(lookupCompanySagas),
    fork(lookupRoleSagas),
    fork(lookupDiemSagas), 
    fork(lookupMenuSagas),
    fork(lookupPositionSagas), 
    fork(lookupCurrencySagas), 
    fork(lookupSystemLimitSagas),
    fork(lookupHolidaySagas),
    fork(lookupLeaveSagas),
    
    // account
    fork(accountEmployeeSagas),
    fork(accountEmployeeMySagas),
    fork(accountEmployeeLeaveSagas),

    // project
    fork(projectRegistrationSagas),
    fork(projectOwnerSagas),
    fork(projectStatusSagas),
    fork(projectSiteSagas),
    fork(projectApprovalSagas),
    fork(projectAssignmentSagas),
    fork(projectAcceptanceSagas),
    
    // timesheet
    fork(timesheetEntrySagas),
    fork(timesheetApprovalSagas),
    fork(timesheetMileagesSagas),
    
    // mileage
    fork(mileageApprovalSagas),
    fork(mileageRequestSagas),

    // expense
    fork(expenseSagas),
    fork(expenseApprovalSagas),
    
    // travel
    fork(travelSagas),
    fork(travelSettlementSagas),
    fork(travelApprovalSagas),
    fork(travelSettlementApprovalSagas),
    
    // purchase
    fork(purchaseSagas),
    
    // finance
    fork(financeSagas),
    
    // leave
    fork(leaveRequestSagas),
    fork(leaveApprovalSagas),
    fork(leaveCancellationSagas),

    // summary
    fork(summarySagas)
  ]);
}