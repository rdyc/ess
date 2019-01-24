import { IEmployeeFamilyDeletePayload, IEmployeeFamilyPostPayload, IEmployeeFamilyPutPayload } from '@account/classes/request/employeeFamily';
import { IEmployee } from '@account/classes/response';
import { WithAccountEmployeeFamily, withAccountEmployeeFamily } from '@account/hoc/withAccountEmployeeFamily';
import { accountMessage } from '@account/locales/messages/accountMessage';
import { FormMode } from '@generic/types';
import { WithLayout, withLayout } from '@layout/hoc/withLayout';
import { WithUser, withUser } from '@layout/hoc/withUser';
import withWidth, { WithWidth } from '@material-ui/core/withWidth';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  compose,
  HandleCreators,
  lifecycle,
  ReactLifeCycleFunctions,
  StateHandler,
  StateHandlerMap,
  StateUpdaters,
  withHandlers,
  withStateHandlers,
} from 'recompose';
import { Dispatch } from 'redux';
import { FormErrors } from 'redux-form';
import { isNullOrUndefined, isObject } from 'util';
import { AccountEmployeeFamilyEditorView } from './AccountEmployeeFamilyEditorView';
import { AccountEmployeeFamilyFormData } from './form/family/AccountEmployeeFamilyContainerForm';

type EditAction = 'update' | 'delete';

interface OwnHandlers {
  handleValidate: (payload: AccountEmployeeFamilyFormData) => FormErrors;
  handleSubmit: (payload: AccountEmployeeFamilyFormData) => void;
  handleSubmitSuccess: (result: any, dispatch: Dispatch<any>) => void;
  handleSubmitFail: (errors: FormErrors | undefined, dispatch: Dispatch<any>, submitError: any) => void;
}

interface OwnOption {
  formMode: FormMode | undefined;
  familyUid?: string;
  employeeUid: string;
  isOpenDialog: boolean;
  editAction?: EditAction | undefined;
  initialValues?: AccountEmployeeFamilyFormData;
  handleDialogClose: () => void;
}

interface OwnRouteParams {
  employeeUid: string;
  familyUid: string;  
}

interface OwnStateUpdaters extends StateHandlerMap<{}> {
  stateUpdate: StateHandler<{}>;
}

export type AccountEmployeeFamilyEditorProps
  = WithAccountEmployeeFamily
  & WithUser
  & WithLayout
  & WithWidth
  & RouteComponentProps<OwnRouteParams>
  & InjectedIntlProps
  & OwnOption
  & OwnHandlers
  & OwnStateUpdaters;

const handlerCreators: HandleCreators<AccountEmployeeFamilyEditorProps, OwnHandlers> = {
  handleValidate: (props: AccountEmployeeFamilyEditorProps) => (formData: AccountEmployeeFamilyFormData) => {
    const errors = {
      family: {}
    };

    const requiredFields = [
      'familyType', 'fullName', 'genderType', 'birthPlace'
    ];

    requiredFields.forEach(field => {
      if (!formData.family[field] || isNullOrUndefined(formData.family[field])) {
        errors.family[field] = props.intl.formatMessage(accountMessage.family.fieldFor(field, 'fieldRequired'));
      }
    });

    return errors;
  },
  handleSubmit: (props: AccountEmployeeFamilyEditorProps) => (formData: AccountEmployeeFamilyFormData) => {
    const { formMode, employeeUid, intl, editAction, familyUid } = props;
    const { user } = props.userState;
    const { createRequest, updateRequest, deleteRequest } = props.accountEmployeeFamilyDispatch;

    if (!user) {
      return Promise.reject('user was not found');
    }

    const payload = {
      ...formData.family,
    };

    // creating
    if (formMode === FormMode.New) {
      return new Promise((resolve, reject) => {
        createRequest({
          resolve,
          reject,
          employeeUid,
          data: payload as IEmployeeFamilyPostPayload
        });
      });
    }

    // update checking
    if (!employeeUid) {
      const message = intl.formatMessage(accountMessage.shared.message.emptyProps);

      return Promise.reject(message);
    }

    if (formMode === FormMode.Edit) {
      if (familyUid) {
        if (editAction === 'update') {
          return new Promise((resolve, reject) => {
            updateRequest({
              resolve,
              reject,
              employeeUid,
              data: payload as IEmployeeFamilyPutPayload,
            });
          });
        }

        if (editAction === 'delete') {
          return new Promise((resolve, reject) => {
            deleteRequest({
              resolve,
              reject,
              employeeUid,
              data: payload as IEmployeeFamilyDeletePayload,
            });
          });
        }
      }
    }

    return null;
  },
  handleSubmitSuccess: (props: AccountEmployeeFamilyEditorProps) => (response: IEmployee) => {
    const { formMode, intl, history, editAction, stateUpdate, employeeUid } = props;
    const { alertAdd } = props.layoutDispatch;
    const { loadAllRequest } = props.accountEmployeeFamilyDispatch; 

    let message: string = '';

    if (formMode === FormMode.New) {
      message = intl.formatMessage(accountMessage.shared.message.createSuccess, { state: 'Employee Family' });
    }

    if (formMode === FormMode.Edit) {
      if (editAction && editAction === 'update') {
        message = intl.formatMessage(accountMessage.shared.message.updateSuccess, { state: 'Employee Family', uid: response.uid });
      } else {
        message = intl.formatMessage(accountMessage.shared.message.deleteSuccess, { state: 'Employee Family', uid: response.uid });
      }
    }

    stateUpdate({
      isOpenDialog: false,
      formMode: undefined,
      editAction: undefined
    });

    alertAdd({
      message,
      time: new Date()
    });

    loadAllRequest({
      employeeUid: props.employeeUid,
      filter: {
        direction: 'ascending'
      }
    });

    history.push(`/account/employee/${employeeUid}/family`);
  },
  handleSubmitFail: (props: AccountEmployeeFamilyEditorProps) => (errors: FormErrors | undefined, dispatch: Dispatch<any>, submitError: any) => {
    const { formMode, intl } = props;
    const { alertAdd } = props.layoutDispatch;

    if (errors) {
      // validation errors from server (400: Bad Request)
      alertAdd({
        time: new Date(),
        message: isObject(submitError) ? submitError.message : submitError
      });
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
        details: isObject(submitError) ? submitError.message : submitError
      });
    }
  }
};

const stateUpdaters: StateUpdaters<{}, {}, OwnStateUpdaters> = {
  stateUpdate: (prevState: {}) => (newState: any) => ({
    ...prevState,
    ...newState
  })
};

const lifecycles: ReactLifeCycleFunctions<AccountEmployeeFamilyEditorProps, {}> = {
  componentWillUnmount() {
    const { createDispose, updateDispose, deleteDispose } = this.props.accountEmployeeFamilyDispatch;

    createDispose();
    updateDispose();
    deleteDispose();
  }
};

export const AccountEmployeeFamilyEditor = compose<AccountEmployeeFamilyEditorProps, OwnOption>(
  withUser,
  withLayout,
  withRouter,
  withWidth(),
  withAccountEmployeeFamily,
  injectIntl,
  withStateHandlers<{}, OwnStateUpdaters, {}>({}, stateUpdaters),
  withHandlers<AccountEmployeeFamilyEditorProps, OwnHandlers>(handlerCreators),
  lifecycle<AccountEmployeeFamilyEditorProps, {}>(lifecycles),
)(AccountEmployeeFamilyEditorView);