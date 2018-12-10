import { FormMode } from '@generic/types';
import { Typography } from '@material-ui/core';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { LookupRoleForm, LookupRoleFormData } from './forms/LookupRoleForm';
import { RoleEditorProps } from './LookupRoleEditor';

export const LookupRoleEditorView: React.SFC<RoleEditorProps> = props => {
  const { formMode, handleValidate, handleSubmit, handleSubmitSuccess, handleSubmitFail } = props;
  const { isLoading, response } = props.lookupRoleState.detail;

  const renderForm = (formData: LookupRoleFormData) => (
    <LookupRoleForm 
      formMode={formMode}
      initialValues={formData}
      validate={handleValidate}
      onSubmit={handleSubmit} 
      onSubmitSuccess={handleSubmitSuccess}
      onSubmitFail={handleSubmitFail}
    />
  );

  // init form values
  const initialValues: LookupRoleFormData = {
    information: {
      uid: undefined,
      companyUid: undefined,
      name: undefined,
      gradeType: undefined,
      description: undefined,
      isActive: undefined,
    }
  };

  // New
  if (formMode === FormMode.New) {
    return renderForm(initialValues);
  }

  // Modify
  if (formMode === FormMode.Edit) {
    if (isLoading && !response) {
      return (
        <Typography variant="body2">
          <FormattedMessage id="global.loading"/>
        </Typography>
      );
    }
    
    if (!isLoading && response && response.data) {
      // todo: replace values with response data
      const data = response.data;
     
      initialValues.information.uid = data.uid;
      initialValues.information.companyUid = data.companyUid;
      initialValues.information.name = data.name;
      initialValues.information.gradeType = data.gradeType;
      initialValues.information.description = data.description;
      initialValues.information.isActive = data.isActive;
          
      return renderForm(initialValues);
    }
  }

  return null;
};