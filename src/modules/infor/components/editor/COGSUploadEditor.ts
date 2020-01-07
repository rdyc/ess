import AppMenu from '@constants/AppMenu';
import { IInforPostPayload } from '@infor/classes/request';
import { IInforResult } from '@infor/classes/response';
import { WithInfor, withInfor } from '@infor/hoc/withInfor';
import { WithLayout, withLayout } from '@layout/hoc/withLayout';
import { WithMasterPage, withMasterPage } from '@layout/hoc/withMasterPage';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { lookupMessage } from '@lookup/locales/messages/lookupMessage';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  compose,
  HandleCreators,
  lifecycle,
  ReactLifeCycleFunctions,
  withHandlers,
} from 'recompose';
import { Dispatch } from 'redux';
import { FormErrors } from 'redux-form';
import { COGSUploadEditorView } from './COGSUploadEditorView';
import { COGSFormData } from './form/upload/COGSUploadForm';

interface OwnHandlers {
  handleValidate: (payload: COGSFormData) => FormErrors;
  handleSubmit: (payload: COGSFormData) => void;
  handleSubmitSuccess: (result: any, dispatch: Dispatch<any>) => void;
  handleSubmitFail: (errors: FormErrors | undefined, dispatch: Dispatch<any>, submitError: any) => void;
}

export type COGSUploadEditorProps
  = WithInfor
  & WithUser
  & WithLayout
  & WithMasterPage
  & InjectedIntlProps
  & RouteComponentProps
  & OwnHandlers;

const handlerCreators: HandleCreators<COGSUploadEditorProps, OwnHandlers> = {
  handleValidate: (props: COGSUploadEditorProps) => (formData: COGSFormData) => { 
    const errors = {};
  
    const requiredFields = ['file'];
  
    requiredFields.forEach(field => {
      if (!formData[field] || isNullOrUndefined(formData[field])) {
        errors[field] = props.intl.formatMessage(lookupMessage.cogsUpload.fieldFor(field, 'fieldRequired'));
      }
    });
    
    return errors;
  },
  handleSubmit: (props: COGSUploadEditorProps) => (formData: COGSFormData) => { 
    const { user } = props.userState;
    const { postRequest } = props.inforDispatch;

    if (!user) {
      return Promise.reject('user was not found');
    }

    if (!formData.file) {  
      return Promise.reject('empty file');
    } 

    const payload = {
      ...formData
    };

    // creating
    return new Promise((resolve, reject) => {
      postRequest({
        resolve, 
        reject,
        data: payload as IInforPostPayload
      });
    });
  },
  handleSubmitSuccess: (props: COGSUploadEditorProps) => (response: IInforResult) => {
    const { intl, history } = props;
    const { alertAdd } = props.layoutDispatch;

    const message = intl.formatMessage(lookupMessage.cogsUpload.message.uploadSuccess, { approved: response.rowApproved,  rejected: response.rowRejected});
    
    alertAdd({
      message,
      time: new Date()
    });

    history.push('/lookup/cogsupload');
  },
  handleSubmitFail: (props: COGSUploadEditorProps) => (errors: FormErrors | undefined, dispatch: Dispatch<any>, submitError: any) => {
    const { intl } = props;
    const { alertAdd } = props.layoutDispatch;
    
    if (errors) {
      // validation errors from server (400: Bad Request)
      alertAdd({
        time: new Date(),
        message: (submitError !== null && typeof submitError === 'object') ? submitError.message : submitError
      });
    } else {
      // another errors from server
      const message = intl.formatMessage(lookupMessage.cogsUpload.message.uploadFailure);

      alertAdd({
        message,
        time: new Date(),
        details: (submitError !== null && typeof submitError === 'object') ? submitError.message : submitError
      });
    }
  }
};

const lifecycles: ReactLifeCycleFunctions<COGSUploadEditorProps, {}> = {
  componentDidMount() {
    const { intl } = this.props;
    const { user } = this.props.userState;
    
    const view = {
      title: lookupMessage.cogsUpload.page.uploadTitle,
      subTitle: lookupMessage.cogsUpload.page.uploadSubHeader,
    };

    if (!user) {
      return;
    }

    this.props.masterPage.changePage({
      uid: AppMenu.COGSUpload,
      parentUid: AppMenu.Lookup,
      title: intl.formatMessage(view.title),
      description : intl.formatMessage(view.subTitle)
    });
  },
  componentWillUnmount() {
    const { masterPage, inforDispatch } = this.props;
    
    masterPage.resetPage();

    inforDispatch.postDispose();
  }
};

export default compose<COGSUploadEditorProps, {}>(
  withUser,
  withLayout,
  withMasterPage,
  withRouter,
  withInfor,
  injectIntl,
  withHandlers<COGSUploadEditorProps, OwnHandlers>(handlerCreators),
  lifecycle<COGSUploadEditorProps, {}>(lifecycles),
)(COGSUploadEditorView);