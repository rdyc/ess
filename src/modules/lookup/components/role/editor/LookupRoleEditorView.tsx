import { FormMode } from '@generic/types';
import { layoutMessage } from '@layout/locales/messages';
import { CircularProgress, Typography } from '@material-ui/core';
import * as React from 'react';
import { LookupRoleForm, LookupRoleFormData } from './forms/LookupRoleForm';
import { RoleEditorProps } from './LookupRoleEditor';

export const LookupRoleEditorView: React.SFC<RoleEditorProps> = props => {
  const { 
    formMode, 
    handleValidate, 
    handleSubmit, 
    handleSubmitSuccess, 
    handleSubmitFail,
    submitDialogTitle, 
    submitDialogContentText, 
    submitDialogConfirmedText, 
    submitDialogCancelText,
    isCheckedMenus 
  } = props;
  const { isLoading, response } = props.lookupRoleState.detail;

  const renderForm = (formData: LookupRoleFormData) => (
    <LookupRoleForm
      formMode={formMode}
      initialValues={formData}
      validate={handleValidate}
      onSubmit={handleSubmit}
      onSubmitSuccess={handleSubmitSuccess}
      onSubmitFail={handleSubmitFail}
      submitDialogTitle={submitDialogTitle}
      submitDialogContentText={submitDialogContentText}
      submitDialogCancelText={submitDialogCancelText}
      submitDialogConfirmedText={submitDialogConfirmedText}
      isCheckedMenus={isCheckedMenus}
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
    },
    menu: {
      menus: []
    }
  };

  // New
  if (formMode === FormMode.New) {
    return renderForm(initialValues);
  }

  // Modify
  if (formMode === FormMode.Edit) {
    if (isLoading) {
      return (
        <div className={props.classes.preloader}>
          <div className={props.classes.preloaderContent}>
            <CircularProgress 
              style={{margin: 'auto'}} 
              color="secondary"
            />

            <Typography
              className={props.classes.marginFarTop}
            >
              {props.intl.formatMessage(layoutMessage.text.waiting)}
            </Typography>
          </div>    
        </div>
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

      if (data.menus) {
        data.menus.forEach(item => {
          initialValues.menu.menus.push({
            [`${item.menuUid}`]: item.isAccess
          });
          // if (item.isAccess) {
          //   isCheckedMenus.push({uid: item.menuUid, parentUid: item.menu && item.menu.parentUid});
          // }
          }
        );
      }

      return renderForm(initialValues);
    }
  }

  return null;
};