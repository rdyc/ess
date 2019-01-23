import {
  accountAccessDialog,
  accountAccessField,
  accountAccessFieldHelperFor,
  accountAccessMessage
} from './accountAccessMessage';
import {
  accountEducationField,
  accountEducationFieldHelperFor
} from './accountEducationMessage';
import {
  accountEmployeeConfirm,
  accountEmployeeField,
  accountEmployeeFieldHelperFor,
  accountEmployeeFilter,
  accountEmployeeSection
} from './accountEmployeeMessage';
import {
  accountEmployeeTrainingConfirm,
  accountEmployeeTrainingField,
  accountEmployeeTrainingFieldHelperFor,
  accountEmployeeTrainingMessage,
  accountEmployeeTrainingOption,
  accountEmployeeTrainingPage,
  accountEmployeeTrainingSection
} from './accountEmployeeTrainingMessage';
import {
  accountExperienceField,
  accountExperienceFieldHelperFor
} from './accountExperienceMessage';
import {
  accountRateDialog,
  accountRateField,
  accountRateFieldHelperFor,
  accountRateMessage
} from './accountRateMessage';
import {
  accountSharedField,
  accountSharedMessage,
  accountSharedOption,
  accountSharedPage
} from './accountShared';

export const accountMessage = {
  employee: {
    field: accountEmployeeField,
    confirm: accountEmployeeConfirm,
    fieldFor: accountEmployeeFieldHelperFor,
    section: accountEmployeeSection,
    filter: accountEmployeeFilter
  },
  education: {
    field: accountEducationField,
    fieldFor: accountEducationFieldHelperFor
  },
  experience: {
    field: accountExperienceField,
    fieldFor: accountExperienceFieldHelperFor
  },
  access: {
    message: accountAccessMessage,
    dialog: accountAccessDialog,
    field: accountAccessField,
    fieldFor: accountAccessFieldHelperFor
  },
  shared: {
    option: accountSharedOption,
    page: accountSharedPage,
    field: accountSharedField,
    message: accountSharedMessage
  },
  training: {
    field: accountEmployeeTrainingField,
    confirm: accountEmployeeTrainingConfirm,
    fieldFor: accountEmployeeTrainingFieldHelperFor,
    message: accountEmployeeTrainingMessage,
    section: accountEmployeeTrainingSection,
    option: accountEmployeeTrainingOption,
    page: accountEmployeeTrainingPage
  },
  rate: {
    message: accountRateMessage,
    dialog: accountRateDialog,
    field: accountRateField,
    fieldFor: accountRateFieldHelperFor
  }
};
