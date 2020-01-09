import { IEmployeeEducationPostPayload, IEmployeeEducationPutPayload } from '@account/classes/request/employeeEducation';
import { IEmployeeEducation } from '@account/classes/response/employeeEducation';
import { WithAccountEmployeeEducation, withAccountEmployeeEducation } from '@account/hoc/withAccountEmployeeEducation';
import { accountMessage } from '@account/locales/messages/accountMessage';
import AppMenu from '@constants/AppMenu';
import { FormMode } from '@generic/types';
import { WithLayout, withLayout } from '@layout/hoc/withLayout';
import { WithMasterPage, withMasterPage } from '@layout/hoc/withMasterPage';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { layoutMessage } from '@layout/locales/messages';
import { WithStyles, withStyles } from '@material-ui/core';
import withWidth, { WithWidth } from '@material-ui/core/withWidth';
import styles from '@styles';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  compose,
  HandleCreators,
  lifecycle,
  mapper,
  ReactLifeCycleFunctions,
  StateHandler,
  StateHandlerMap,
  StateUpdaters,
  withHandlers,
  withStateHandlers,
} from 'recompose';
import { Dispatch } from 'redux';
import { FormErrors } from 'redux-form';
import { AccountEmployeeEducationEditorView } from './AccountEmployeeEducationEditorView';
import { AccountEmployeeEducationFormData } from './form/AccountEmployeeEducationContainer';

interface OwnHandlers {
  handleValidate: (payload: AccountEmployeeEducationFormData) => FormErrors;
  handleSubmit: (payload: AccountEmployeeEducationFormData) => void;
  handleSubmitSuccess: (result: any, dispatch: Dispatch<any>) => void;
  handleSubmitFail: (errors: FormErrors | undefined, dispatch: Dispatch<any>, submitError: any) => void;
}

interface OwnOption {

}

interface OwnRouteParams {
  employeeUid: string;
  educationUid: string;  
}

interface OwnState {
  formMode: FormMode;
  employeeUid: string;
  educationUid?: string | undefined;  
  submitDialogTitle: string;
  submitDialogContentText: string;
  submitDialogCancelText: string;
  submitDialogConfirmedText: string;
}

interface OwnStateUpdaters extends StateHandlerMap<OwnState> {
  stateUpdate: StateHandler<OwnState>;
}

export type AccountEmployeeEducationEditorProps
  = WithAccountEmployeeEducation
  & WithUser
  & WithMasterPage
  & WithLayout
  & WithWidth
  & RouteComponentProps<OwnRouteParams>
  & InjectedIntlProps
  & WithStyles<typeof styles>
  & OwnOption
  & OwnHandlers
  & OwnState
  & OwnStateUpdaters;

const handlerCreators: HandleCreators<AccountEmployeeEducationEditorProps, OwnHandlers> = {
  handleValidate: (props: AccountEmployeeEducationEditorProps) => (formData: AccountEmployeeEducationFormData) => { 
    const errors = {
      education: {}
    };
  
    const requiredFields = [
      'degreeType', 'institution', 'major', 'start'
    ];
  
    requiredFields.forEach(field => {
      if (!formData.education[field] || (formData.education[field] === undefined || formData.education[field] === null)) {
        errors.education[field] = props.intl.formatMessage(accountMessage.education.fieldFor(field, 'fieldRequired'));
      }
    });
    
    return errors;
  },
  handleSubmit: (props: AccountEmployeeEducationEditorProps) => (formData: AccountEmployeeEducationFormData) => { 
    const { formMode, educationUid, employeeUid, intl } = props;
    const { user } = props.userState;
    const { createRequest, updateRequest } = props.accountEmployeeEducationDispatch;

    if (!user) {
      return Promise.reject('user was not found');
    }

    const payload = {
      ...formData.education
    };

    // creating
    if (formMode === FormMode.New) {
      return new Promise((resolve, reject) => {
        createRequest({
          resolve, 
          reject,
          employeeUid,
          data: payload as IEmployeeEducationPostPayload
        });
      });
    }

    // update checking
    if (!educationUid) {
      const message = intl.formatMessage(accountMessage.shared.message.emptyProps);

      return Promise.reject(message);
    }

    if (formMode === FormMode.Edit) {
      return new Promise((resolve, reject) => {
        updateRequest({
          employeeUid,
          resolve, 
          reject,
          data: payload as IEmployeeEducationPutPayload, 
        });
      });
    }

    return null;
  },
  handleSubmitSuccess: (props: AccountEmployeeEducationEditorProps) => (response: IEmployeeEducation) => {
    const { formMode, intl, history, employeeUid, } = props;
    const { alertAdd } = props.layoutDispatch;

    let message: string = '';

    if (formMode === FormMode.New) {
      message = intl.formatMessage(accountMessage.shared.message.createSuccess, { state: 'Employee Education' });
    }

    if (formMode === FormMode.Edit) {
      message = intl.formatMessage(accountMessage.shared.message.updateSuccess, { state: 'Employee Education', uid: response.uid });
    }

    alertAdd({
      message,
      time: new Date()
    });

    history.push(`/account/employee/${employeeUid}/education/${response.uid}`);
  },
  handleSubmitFail: (props: AccountEmployeeEducationEditorProps) => (errors: FormErrors | undefined, dispatch: Dispatch<any>, submitError: any) => {
    const { formMode, intl } = props;
    const { alertAdd } = props.layoutDispatch;
    
    if (errors) {
      // validation errors from server (400: Bad Request)
      alertAdd({
        time: new Date(),
        message: (submitError !== null && typeof submitError === 'object') ? submitError.message : submitError
      });
      console.log(submitError);
    } else {
      // another errors from server
      let message: string = '';

      if (formMode === FormMode.New) {
        message = intl.formatMessage(accountMessage.shared.message.createFailure);
      }

      if (formMode === FormMode.Edit) {
        message = intl.formatMessage(accountMessage.shared.message.updateFailure);
      }

      alertAdd({
        message,
        time: new Date(),
        details: (submitError !== null && typeof submitError === 'object') ? submitError.message : submitError
      });
    }
  }
};

const createProps: mapper<AccountEmployeeEducationEditorProps, OwnState> = (props: AccountEmployeeEducationEditorProps): OwnState => ({ 
  employeeUid: props.match.params.employeeUid,
  formMode: FormMode.New,
  submitDialogTitle: props.intl.formatMessage(accountMessage.shared.confirm.createTitle, {state: 'Education'}),
  submitDialogContentText: props.intl.formatMessage(accountMessage.shared.confirm.createDescription, {state: 'education'}),
  submitDialogCancelText: props.intl.formatMessage(layoutMessage.action.cancel),
  submitDialogConfirmedText: props.intl.formatMessage(layoutMessage.action.ok),
});

const stateUpdaters: StateUpdaters<{}, OwnState, OwnStateUpdaters> = {
  stateUpdate: (prevState: OwnState) => (newState: any) => ({
    ...prevState,
    ...newState
  })
};

const lifecycles: ReactLifeCycleFunctions<AccountEmployeeEducationEditorProps, {}> = {
  componentDidMount() {
    const { intl, history, stateUpdate, match } = this.props;
    const { loadDetailRequest } = this.props.accountEmployeeEducationDispatch;
    const { user } = this.props.userState;

    const view = {
      title: accountMessage.shared.page.newTitle,
      subTitle: accountMessage.shared.page.newSubHeader
    };

    if (!user) {
      return;
    }

    if (!(history.location.state === undefined || history.location.state === null)) {
      view.title = accountMessage.shared.page.modifyTitle;
      view.subTitle = accountMessage.shared.page.modifySubHeader;

      stateUpdate({
        formMode: FormMode.Edit,
        employeeUid: match.params.employeeUid,
        educationUid: history.location.state.educationUid,
        submitDialogTitle: this.props.intl.formatMessage(accountMessage.shared.confirm.modifyTitle, { state: 'Education'}),
        submitDialogContentText : this.props.intl.formatMessage(accountMessage.shared.confirm.modifyDescription, { state: 'education'})
      });

      loadDetailRequest({
        employeeUid: match.params.employeeUid,
        educationUid: history.location.state.educationUid
      });
    }

    this.props.masterPage.changePage({
      uid: AppMenu.LookupEmployee,
      parentUid: AppMenu.Lookup,
      parentUrl: `/account/employee/${match.params.employeeUid}/education`,
      title: intl.formatMessage(view.title, {state: 'Education'}),
      description : intl.formatMessage(view.subTitle)
    });
  },
  componentWillUnmount() {
    const { masterPage, accountEmployeeEducationDispatch } = this.props;

    masterPage.resetPage();

    accountEmployeeEducationDispatch.createDispose();
    accountEmployeeEducationDispatch.updateDispose();
  }
};

export const AccountEmployeeEducationEditor = compose<AccountEmployeeEducationEditorProps, {}>(
  withUser,
  withLayout,
  withMasterPage,
  withRouter,
  withWidth(),
  withAccountEmployeeEducation,
  injectIntl,
  withStyles(styles),
  withStateHandlers<OwnState, OwnStateUpdaters, {}>(createProps, stateUpdaters),
  withHandlers<AccountEmployeeEducationEditorProps, OwnHandlers>(handlerCreators),
  lifecycle<AccountEmployeeEducationEditorProps, {}>(lifecycles),
)(AccountEmployeeEducationEditorView);