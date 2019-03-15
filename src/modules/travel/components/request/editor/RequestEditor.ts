import AppMenu from '@constants/AppMenu';
import { FormMode } from '@generic/types';
import { WithLayout, withLayout } from '@layout/hoc/withLayout';
import { WithMasterPage, withMasterPage } from '@layout/hoc/withMasterPage';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { layoutMessage } from '@layout/locales/messages';
import { IDiem } from '@lookup/classes/response';
import { WithLookupDiem, withLookupDiem } from '@lookup/hoc/withLookupDiem';
import { ITravelPostPayload, ITravelPutPayload } from '@travel/classes/request';
import { ITravelPutItem } from '@travel/classes/request/ITravelPutItem';
import { ITravelRequest } from '@travel/classes/response';
import { RequestEditorView } from '@travel/components/request/editor//RequestEditorView';
import { TravelRequestFormData } from '@travel/components/request/editor/forms/RequestForm';
import { WithTravelRequest, withTravelRequest } from '@travel/hoc/withTravelRequest';
import { travelMessage } from '@travel/locales/messages/travelMessage';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import { compose, HandleCreators, lifecycle, mapper, ReactLifeCycleFunctions, StateHandler, StateHandlerMap, StateUpdaters, withHandlers, withStateHandlers } from 'recompose';
import { Dispatch } from 'redux';
import { FormErrors } from 'redux-form';
import { isNullOrUndefined, isObject } from 'util';

interface OwnHandlers {
  handleValidate: (payload: TravelRequestFormData) => any;
  handleSubmit: (payload: TravelRequestFormData) => void;
  handleSubmitSuccess: (result: any, dispatch: Dispatch<any>) => void;
  handleSubmitFail: (errors: FormErrors | undefined, dispatch: Dispatch<any>, submitError: any) => void;
  generateDiemData: () => IDiem[] | undefined;
}

interface OwnRouteParams {
  travelUid: string;
}

interface OwnState {
  formMode: FormMode;
  companyUid?: string | undefined;
  positionUid?: string | undefined;
  travelUid?: string | undefined;
  submitDialogTitle: string;
  submitDialogContentText: string;
  submitDialogCancelText: string;
  submitDialogConfirmedText: string;
}

interface OwnStateUpdaters extends StateHandlerMap<OwnState> {
  stateUpdate: StateHandler<OwnState>;
}

export type RequestEditorProps
  = WithTravelRequest
  & WithLookupDiem
  & WithUser
  & WithLayout
  & WithMasterPage
  & RouteComponentProps<OwnRouteParams>
  & InjectedIntlProps
  & OwnHandlers
  & OwnState
  & OwnStateUpdaters;

const handlerCreators: HandleCreators<RequestEditorProps, OwnHandlers> = {
  handleValidate: (props: RequestEditorProps) => (formData: TravelRequestFormData) => {
    const errors = {
      information: {},
      // item: {}
    };

    const requiredFields = [
      'projectUid', 'destinationType', 'activityType',
      'start', 'end',
    ];

    requiredFields.forEach(field => {
      if (!formData.information[field] || isNullOrUndefined(formData.information[field])) {
        Object.assign(errors.information, {[`${field}`]: props.intl.formatMessage({ id: `travel.field.information.${field}.required` })});
      }
    });

    if (formData.items) {
      const requiredItemFields = ['employeeUid', 'transportType', 'departureDate', 'from', 'destination', 'returnDate'];

      const itemErrors: any[] = [];
      
      formData.items.forEach((item, index) => {
        const itemError: any = {};

        if (!item) { return ; }

        requiredItemFields.forEach(field => {
          if (!item[field] || isNullOrUndefined(item[field])) {
            Object.assign(itemError, {[`${field}`]: props.intl.formatMessage({id: `travel.field.information.item.${field}.required`})});
          }
        });

        itemErrors.push(itemError);
      });

      if (itemErrors.length) {
        Object.assign(errors, {
          items: itemErrors
        });
      }
    }
    
    // console.log(errors);
    return errors;
  },
  handleSubmit: (props: RequestEditorProps) => (formData: TravelRequestFormData) => {
    const { formMode, travelUid } = props;
    const { user } = props.userState;
    const { createRequest, updateRequest } = props.travelRequestDispatch;

    if (!user) {
      return Promise.reject('user was not found');
    }

    if (!formData.items.length) {
      return Promise.reject('At least one item must be entered');
    }

    const parsedItems = () => {
      if (!formData.items) {
        return null;
      }

      const _items: ITravelPutItem[] = [];

      formData.items.forEach(item => 
        _items.push({
          uid: item.uid,
          employeeUid: item.employeeUid,
          isRoundTrip: item.isRoundTrip,
          transportType: item.transportType,
          from: item.from,
          departureDate: item.departureDate,
          destination: item.destination,
          returnDate: item.returnDate,
          costTransport: item.costTransport ? item.costTransport : 0,
          isTransportByCompany: item.isTransportByCompany,
          hotel: item.hotel,
          costHotel: item.costHotel ? item.costHotel : 0,
          isHotelByCompany: item.isHotelByCompany,
          notes : item.notes
        })
      );
      
      return _items;
    };

    const payload = {
      ...formData.information,
      items: parsedItems(),
    };

    // creating
    if (formMode === FormMode.New) {
      return new Promise((resolve, reject) => {
        createRequest({
          resolve,
          reject,
          companyUid: user.company.uid,
          positionUid: user.position.uid,
          data: payload as ITravelPostPayload
        });
      });
    }

    // update checking
    if (!travelUid) {
      // const message = intl.formatMessage(travelRequestMessage.emptyTravelUid);

      return Promise.reject('empty travelUid');
    }

    if (formMode === FormMode.Edit) {
      return new Promise((resolve, reject) => {
        updateRequest({
          travelUid,
          resolve,
          reject,
          companyUid: user.company.uid,
          positionUid: user.position.uid,
          data: payload as ITravelPutPayload,
        });
      });
    }

    return null;
  },
  handleSubmitSuccess: (props: RequestEditorProps) => (response: ITravelRequest) => {
    const { formMode, intl, history } = props;
    const { alertAdd } = props.layoutDispatch;

    let message: string = '';

    if (formMode === FormMode.New) {
      message = intl.formatMessage(travelMessage.request.message.createSuccess, { uid: response.uid });
    }

    if (formMode === FormMode.Edit) {
      message = intl.formatMessage(travelMessage.request.message.updateSuccess, { uid: response.uid });
    }

    alertAdd({
      message,
      time: new Date()
    });

    history.push(`/travel/requests/${response.uid}`);
  },
  handleSubmitFail: (props: RequestEditorProps) => (errors: FormErrors | undefined, dispatch: Dispatch<any>, submitError: any) => {
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
        message = intl.formatMessage(travelMessage.request.message.createFailure);
      }

      if (formMode === FormMode.Edit) {
        message = intl.formatMessage(travelMessage.request.message.updateFailure);
      }

      alertAdd({
        message,
        time: new Date(),
        details: isObject(submitError) ? submitError.message : submitError
      });
    }
  }, 
  generateDiemData: (props: RequestEditorProps) => (): IDiem[] | undefined => {
    const { response } = props.lookupDiemState.all;
    if (response && response.data) {
      return response.data;
    }
    return undefined;
  }
};

const createProps: mapper<RequestEditorProps, OwnState> = (props: RequestEditorProps): OwnState => ({ 
  formMode: FormMode.New,
  submitDialogTitle: props.intl.formatMessage(travelMessage.request.dialog.createTitle),
  submitDialogContentText: props.intl.formatMessage(travelMessage.request.dialog.createDescription),
  submitDialogCancelText: props.intl.formatMessage(layoutMessage.action.cancel),
  submitDialogConfirmedText: props.intl.formatMessage(layoutMessage.action.ok),
});

const stateUpdaters: StateUpdaters<{}, OwnState, OwnStateUpdaters> = {
  stateUpdate: (prevState: OwnState) => (newState: any) => ({
    ...prevState,
    ...newState
  })
};

const lifecycles: ReactLifeCycleFunctions<RequestEditorProps, {}> = {
  componentDidMount() {
    const { intl, history, stateUpdate } = this.props;
    const { loadDetailRequest } = this.props.travelRequestDispatch;
    const loadDiem = this.props.lookupDiemDispatch.loadAllRequest;
    const { user } = this.props.userState;
    
    const filter: any = {
      projectType: undefined,
      destinationType: undefined,
      find: user && user.company.uid,
      findBy: 'companyUid'      
    };

    const view = {
      title: travelMessage.request.page.newTitle,
      subTitle: travelMessage.request.page.newSubHeader,
    };

    if (!user) {
      return;
    }

    stateUpdate({ 
      companyUid: user.company.uid,
      positionUid: user.position.uid
    });

    if (!isNullOrUndefined(history.location.state)) {
      view.title = travelMessage.request.page.modifyTitle;
      view.subTitle = travelMessage.request.page.modifySubHeader;

      stateUpdate({ 
        formMode: FormMode.Edit,
        travelUid: history.location.state.uid,
        submitDialogTitle: this.props.intl.formatMessage(travelMessage.request.dialog.editTitle),
        submitDialogContentText: this.props.intl.formatMessage(travelMessage.request.dialog.editDescription),
      });

      loadDetailRequest({
        companyUid: user.company.uid,
        positionUid: user.position.uid,
        travelUid: history.location.state.uid
      });      
    }
    
    loadDiem({
      filter
    });

    this.props.masterPage.changePage({
      uid: AppMenu.TravelRequest,
      parentUid: AppMenu.Travel,
      parentUrl: '/travel/requests',
      title: intl.formatMessage(view.title),
      description : intl.formatMessage(view.subTitle)
    });
  },
  componentWillUnmount() {
    const { masterPage, travelRequestDispatch } = this.props;

    masterPage.resetPage();

    travelRequestDispatch.createDispose();
    travelRequestDispatch.updateDispose();
  }
};

export default compose<RequestEditorProps, {}>(
  withUser,
  withLayout,
  withMasterPage,
  withRouter,
  withTravelRequest,
  withLookupDiem,
  injectIntl,
  withStateHandlers<OwnState, OwnStateUpdaters, {}>(createProps, stateUpdaters),
  withHandlers<RequestEditorProps, OwnHandlers>(handlerCreators),
  lifecycle<RequestEditorProps, {}>(lifecycles),
)(RequestEditorView);
