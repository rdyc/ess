import { FormMode } from '@generic/types';
import { InjectedIntlProps } from 'react-intl';
import { InjectedFormProps, reduxForm } from 'redux-form';
import { PositionFormView } from './PositionFormView';

const formName = 'lookupPosition';

export type PositionFormData = {
  uid: string | undefined,
  companyUid: string | undefined,
  information: {
    name: string | undefined,
    description: string | null | undefined,
    inactiveDate: number | undefined,
    isAllowMultiple: boolean  | undefined,
  }
};

interface OwnProps {
  formMode: FormMode;
}

// interface OwnHandlers {
//   generateFieldProps: (name: string) => any;
// }

export type PositionFormProps
  = InjectedFormProps<PositionFormData, OwnProps>
  & InjectedIntlProps
  // & OwnHandlers
  & OwnProps;

export const PositionForm = reduxForm<PositionFormData, OwnProps>({
  form: formName,
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true,
  destroyOnUnmount: true
})(PositionFormView);