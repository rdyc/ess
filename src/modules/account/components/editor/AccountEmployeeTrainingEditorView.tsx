import { accountMessage } from '@account/locales/messages/accountMessage';
import { layoutMessage } from '@layout/locales/messages';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@material-ui/core';
import { isWidthDown } from '@material-ui/core/withWidth';
import * as React from 'react';
import { FormInstance } from 'redux-form';
import { AccountEmployeeTrainingEditorProps } from './AccountEmployeeTrainingEditor';
import { AccountEmployeeTrainingContainerForm } from './form/training/AccountEmployeeTrainingContainerForm';

export const AccountEmployeeTrainingEditorView: React.SFC<AccountEmployeeTrainingEditorProps> = props => {
  const { handleValidate, handleSubmit, handleSubmitSuccess, handleSubmitFail,
    width, isOpenDialog, initialValues,
    editAction, handleDialogClose, formMode } = props;
  // const { isLoading, response } = props.accountEmployeeTrainingState.detail;

  const ref = React.createRef<FormInstance<any, any, any>>();
  const isMobile = isWidthDown('sm', width);

  const dialogTitle = () => {
    switch (editAction) {
      case 'update': return accountMessage.training.page.modifyTitle;
      case 'delete': return accountMessage.training.page.deleteTitle;

      default: return accountMessage.training.page.newTitle;
    }
  };

  const renderDialog = (
    <Dialog
      open={isOpenDialog}
      fullScreen={isMobile}
      scroll="paper"
    >
      <DialogTitle disableTypography>
        <Typography variant="title" color="primary">
          {props.intl.formatMessage(dialogTitle())}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <AccountEmployeeTrainingContainerForm
          formMode={formMode}
          ref={ref}
          formAction={editAction ? editAction : 'update'}
          initialValues={initialValues}
          validate={handleValidate}
          onSubmit={handleSubmit}
          onSubmitSuccess={handleSubmitSuccess}
          onSubmitFail={handleSubmitFail}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleDialogClose()} color="secondary">
          {props.intl.formatMessage(layoutMessage.action.discard)}
        </Button>

        {
          editAction !== 'delete' &&
          <Button type="button" color="secondary" onClick={() => ref.current && ref.current.reset()} >
            {props.intl.formatMessage(layoutMessage.action.reset)}
          </Button>
        }

        <Button type="submit" color="secondary" onClick={() => ref.current && ref.current.submit()}>
          {props.intl.formatMessage(props.submitting ? layoutMessage.text.processing : layoutMessage.action.submit)}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // const initialValues: AccountEmployeeTrainingFormData = {
  //   information: {
  //     uid: undefined,
  //     employeeUid: undefined,
  //     name: undefined,
  //     start: undefined,
  //     end: undefined,
  //     organizer: undefined,
  //     trainingType: undefined,
  //     certificationType: undefined
  //   }
  // };

  // New
  // if (formMode === FormMode.New) {
  //   return renderForm(initialValues);
  // }

  // Modify
  // if (formMode === FormMode.Edit) {
  //   if (isLoading && !response) {
  //     return (
  //       <Typography variant="body2">
  //         {props.intl.formatMessage(layoutMessage.text.loading)}
  //       </Typography>
  //     );
  //   }

  //   if (!isLoading && response && response.data) {
  //     // todo: replace values with response data
  //     const data = response.data;
  //     // basic
  //     initialValues.information.uid = data.uid;
  //     initialValues.information.name = data.name;
  //     initialValues.information.start = data.start;
  //     initialValues.information.end = data.end;
  //     initialValues.information.organizer = data.organizer;
  //     initialValues.information.trainingType = data.trainingType;
  //     initialValues.information.certificationType = data.certificationType;

  //     return renderForm(initialValues);
  //   }
  // }

  return renderDialog;
};