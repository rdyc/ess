import { FormMode } from '@generic/types';
import { connect } from 'react-redux';
import {  InjectedFormProps, reduxForm } from 'redux-form';
import { CommonFormView } from './CommonFormView';

const formName = 'common';

export type CommonFormData = {
  information: {
    companyUid: string | null | undefined;
    parentCode: string | null | undefined;
    name: string | null | undefined;
    description: string | null | undefined;
    isActive: boolean | false ;
  },
};

interface OwnProps {
  formMode: FormMode;
  category: string;
  submitDialogTitle: string;
  submitDialogContentText: string;
  submitDialogCancelText: string;
  submitDialogConfirmedText: string;
}

interface FormValueProps {
  formName: string;
}

export type CommonFormProps 
  = InjectedFormProps<CommonFormData, OwnProps> 
  & FormValueProps
  & OwnProps;
  
const mapStateToProps = (): FormValueProps => {
  return {
    formName
  };
};

const connectedView = connect(mapStateToProps)(CommonFormView);

export const CommonForm = reduxForm<CommonFormData, OwnProps>({
  form: formName,
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true
})(connectedView);