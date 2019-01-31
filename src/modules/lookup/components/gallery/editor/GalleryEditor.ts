import AppMenu from '@constants/AppMenu';
import { WithAppBar, withAppBar } from '@layout/hoc/withAppBar';
import { WithLayout, withLayout } from '@layout/hoc/withLayout';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { IGalleryPostPayload } from '@lookup/classes/request/gallery';
import { IGallery } from '@lookup/classes/response/gallery';
import { WithImageGallery, withImageGallery } from '@lookup/hoc/withImageGallery';
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
import { isNullOrUndefined, isObject } from 'util';
import { GalleryFormData } from './form/upload/GalleryForm';
import { GalleryEditorView } from './GalleryEditorView';

interface OwnHandlers {
  handleValidate: (payload: GalleryFormData) => FormErrors;
  handleSubmit: (payload: GalleryFormData) => void;
  handleSubmitSuccess: (result: any, dispatch: Dispatch<any>) => void;
  handleSubmitFail: (errors: FormErrors | undefined, dispatch: Dispatch<any>, submitError: any) => void;
}

export type GalleryEditorProps
  = WithImageGallery
  & WithUser
  & WithLayout
  & WithAppBar
  & InjectedIntlProps
  & RouteComponentProps
  & OwnHandlers;

const handlerCreators: HandleCreators<GalleryEditorProps, OwnHandlers> = {
  handleValidate: (props: GalleryEditorProps) => (formData: GalleryFormData) => { 
    const errors = {};
  
    const requiredFields = ['file'];
  
    requiredFields.forEach(field => {
      if (!formData[field] || isNullOrUndefined(formData[field])) {
        errors[field] = props.intl.formatMessage(lookupMessage.gallery.fieldFor(field, 'fieldRequired'));
      }
    });
    
    return errors;
  },
  handleSubmit: (props: GalleryEditorProps) => (formData: GalleryFormData) => { 
    const { user } = props.userState;
    const { createRequest } = props.imageGalleryDispatch;

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
      createRequest({
        resolve, 
        reject,
        data: payload as IGalleryPostPayload
      });
    });
  },
  handleSubmitSuccess: (props: GalleryEditorProps) => (response: IGallery) => {
    const { intl, history } = props;
    const { alertAdd } = props.layoutDispatch;

    const message = intl.formatMessage(lookupMessage.gallery.message.createSuccess, { uid: response.uid });
    
    alertAdd({
      message,
      time: new Date()
    });

    history.push('/lookup/gallery');
  },
  handleSubmitFail: (props: GalleryEditorProps) => (errors: FormErrors | undefined, dispatch: Dispatch<any>, submitError: any) => {
    const { intl } = props;
    const { alertAdd } = props.layoutDispatch;
    
    if (errors) {
      // validation errors from server (400: Bad Request)
      alertAdd({
        time: new Date(),
        message: isObject(submitError) ? submitError.message : submitError
      });
    } else {
      // another errors from server
      const message = intl.formatMessage(lookupMessage.gallery.message.createFailure);

      alertAdd({
        message,
        time: new Date(),
        details: isObject(submitError) ? submitError.message : submitError
      });
    }
  }
};

const lifecycles: ReactLifeCycleFunctions<GalleryEditorProps, {}> = {
  componentDidMount() {
    const { layoutDispatch, intl } = this.props;
    const { user } = this.props.userState;
    
    const view = {
      title: lookupMessage.gallery.page.newTitle,
      subTitle: lookupMessage.gallery.page.newSubHeader,
    };

    if (!user) {
      return;
    }

    layoutDispatch.setupView({
      view: {
        uid: AppMenu.LookupGallery,
        parentUid: AppMenu.Lookup,
        title: intl.formatMessage(view.title),
        subTitle : intl.formatMessage(view.subTitle)
      },
      parentUrl: `/lookup/gallery`,
      status: {
        isNavBackVisible: true,
        isSearchVisible: false,
        isActionCentreVisible: false,
        isMoreVisible: false,
        isModeSearch: false
      }
    });
  },
  componentWillUnmount() {
    const { layoutDispatch, appBarDispatch, imageGalleryDispatch } = this.props;

    layoutDispatch.changeView(null);
    layoutDispatch.navBackHide();
    layoutDispatch.moreHide();

    appBarDispatch.dispose();

    imageGalleryDispatch.createDispose();
  }
};

export default compose<GalleryEditorProps, {}>(
  withUser,
  withLayout,
  withAppBar,
  withRouter,
  withImageGallery,
  injectIntl,
  withHandlers<GalleryEditorProps, OwnHandlers>(handlerCreators),
  lifecycle<GalleryEditorProps, {}>(lifecycles),
)(GalleryEditorView);