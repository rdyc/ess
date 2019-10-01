import {
  achievementField,
  achievementMessage,
  achievementPage,
  achievementSection
} from './achievementMessage';
import {
  currencyConfirm,
  currencyDialog,
  currencyField,
  currencyFieldHelperFor,
  currencyForm,
  currencyMessage,
  currencyPage,
  currencySection
} from './currencyMessage';
import {
  employeeLevelConfirm,
  employeeLevelDialog,
  employeeLevelField,
  employeeLevelFieldHelperFor,
  employeeLevelMessage,
  employeeLevelPage,
  employeeLevelSection
} from './employeeLevel';
import {
  galleryAction,
  galleryField,
  galleryFieldHelperFor,
  galleryMessage,
  galleryPage,
  gallerySection
} from './galleryMessage';
import {
  holidayConfirm,
  holidayDialog,
  holidayField,
  holidayFieldHelperFor,
  holidayMessage,
  holidayPage,
  holidaySection
} from './holiday';
import {
  inforField,
  inforFieldHelperFor,
  inforMessage,
  inforPage,
  inforSection
} from './inforMessage';
import {
  leaveConfirm,
  leaveDialog,
  leaveField,
  leaveFieldHelperFor,
  leaveMessage,
  leavePage,
  leaveSection
} from './leave';
import {
  leaveCalculationField,
  leaveCalculationFilter,
  leaveCalculationPage
} from './leaveCalculation';
import {
  companyConfirm,
  companyDialog,
  companyField,
  companyFieldHelperFor,
  companyMessage,
  companyPage,
  companySection
} from './lookupCompanyMessage';
import {
  customerFieldHelperFor,
  lookupCustomerConfirm,
  lookupCustomerDialogMessage,
  lookupCustomerFields,
  lookupCustomerMessage,
  lookupCustomerPage,
  lookupCustomerSection
} from './lookupCustomerMessage';
import {
  diemFieldHelperFor,
  lookupDiemConfirm,
  lookupDiemDialog,
  lookupDiemField,
  lookupDiemMessage,
  lookupDiemPage,
  lookupDiemSection
} from './lookupDiemMessage';
import {
  roleConfirm,
  roleDialog,
  roleField,
  roleFieldHelperFor,
  roleMessage,
  rolePage,
  roleSection
} from './lookupRoleMessage';
import {
  mileageExceptionConfirm,
  mileageExceptionField,
  mileageExceptionFieldHelperFor,
  mileageExceptionMessage,
  mileageExceptionPage,
  mileageExceptionSection
} from './mileageException';
import {
  positionConfirm,
  positionDialog,
  positionField,
  positionFieldHelperFor,
  positionForm,
  positionMessage,
  positionPage,
  positionSection
} from './positionMessage';
import { lookupConfirm, lookupSubmission } from './shared';
import {
  systemLimitConfirm,
  systemLimitField,
  systemLimitFieldHelperFor,
  systemLimitMessage,
  systemLimitPage,
  systemLimitSection
} from './systemLimit';

export const lookupMessage = {
  shared: {
    confirm: lookupConfirm,
    submission: lookupSubmission
  },
  mileageException: {
    page: mileageExceptionPage,
    field: mileageExceptionField,
    fieldFor: mileageExceptionFieldHelperFor,
    section: mileageExceptionSection,
    message: mileageExceptionMessage,
    confirm: mileageExceptionConfirm
  },
  role: {
    page: rolePage,
    field: roleField,
    fieldFor: roleFieldHelperFor,
    section: roleSection,
    confirm: roleConfirm,
    message: roleMessage,
    dialog: roleDialog
  },
  systemLimit: {
    page: systemLimitPage,
    field: systemLimitField,
    fieldFor: systemLimitFieldHelperFor,
    section: systemLimitSection,
    message: systemLimitMessage,
    confirm: systemLimitConfirm
  },
  holiday: {
    page: holidayPage,
    field: holidayField,
    fieldFor: holidayFieldHelperFor,
    section: holidaySection,
    confirm: holidayConfirm,
    message: holidayMessage,
    dialog: holidayDialog
  },
  leave: {
    page: leavePage,
    field: leaveField,
    fieldFor: leaveFieldHelperFor,
    section: leaveSection,
    confirm: leaveConfirm,
    message: leaveMessage,
    dialog: leaveDialog
  },
  calculation: {
    page: leaveCalculationPage,
    field: leaveCalculationField,
    filter: leaveCalculationFilter
  },
  currency: {
    page: currencyPage,
    field: currencyField,
    fieldFor: currencyFieldHelperFor,
    confirm: currencyConfirm,
    section: currencySection,
    form: currencyForm,
    message: currencyMessage,
    dialog: currencyDialog
  },
  company: {
    page: companyPage,
    field: companyField,
    fieldFor: companyFieldHelperFor,
    section: companySection,
    confirm: companyConfirm,
    message: companyMessage,
    dialog: companyDialog
  },
  position: {
    page: positionPage,
    field: positionField,
    fieldFor: positionFieldHelperFor,
    section: positionSection,
    confirm: positionConfirm,
    form: positionForm,
    message: positionMessage,
    dialog: positionDialog
  },
  lookupDiem: {
    page: lookupDiemPage,
    section: lookupDiemSection,
    field: lookupDiemField,
    fieldFor: diemFieldHelperFor,
    confirm: lookupDiemConfirm,
    message: lookupDiemMessage,
    dialog: lookupDiemDialog
  },
  customer: {
    page: lookupCustomerPage,
    section: lookupCustomerSection,
    field: lookupCustomerFields,
    fieldFor: customerFieldHelperFor,
    confirm: lookupCustomerConfirm,
    message: lookupCustomerMessage,
    dialog: lookupCustomerDialogMessage
  },
  gallery: {
    page: galleryPage,
    section: gallerySection,
    field: galleryField,
    action: galleryAction,
    fieldFor: galleryFieldHelperFor,
    message: galleryMessage
  },
  cogsUpload: {
    page: inforPage,
    section: inforSection,
    field: inforField,
    fieldFor: inforFieldHelperFor,
    message: inforMessage
  },
  achievement: {
    page: achievementPage,
    field: achievementField,
    message: achievementMessage,
    section: achievementSection
  },
  employeeLevel: {
    page: employeeLevelPage,
    field: employeeLevelField,
    fieldFor: employeeLevelFieldHelperFor,
    section: employeeLevelSection,
    confirm: employeeLevelConfirm,
    message: employeeLevelMessage,
    dialog: employeeLevelDialog
  }
};
