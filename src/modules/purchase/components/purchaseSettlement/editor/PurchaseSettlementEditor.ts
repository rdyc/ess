import AppMenu from '@constants/AppMenu';
import { AppRole } from '@constants/AppRole';
import { FormMode } from '@generic/types';
import { WithLayout, withLayout } from '@layout/hoc/withLayout';
import { WithMasterPage, withMasterPage } from '@layout/hoc/withMasterPage';
import { WithOidc, withOidc } from '@layout/hoc/withOidc';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { layoutMessage } from '@layout/locales/messages';
import { WithStyles, withStyles } from '@material-ui/core';
import {
  ISettlementItemPostPayload,
  ISettlementItemPutPayload,
  ISettlementPostPayload,
  ISettlementPutPayload
} from '@purchase/classes/request/purchaseSettlement';
import { ISettlement, 
} from '@purchase/classes/response/purchaseSettlement';
import {
  PurchaseSettlementFormData,
} from '@purchase/components/purchaseSettlement/editor/forms/PurchaseSettlementForm';
import { PurchaseSettlementEditorView } from '@purchase/components/purchaseSettlement/editor/PurchaseSettlementEditorView';
import { WithPurchaseSettlement, withPurchaseSettlement } from '@purchase/hoc/purchaseSettlement/withPurchaseSettlement';
import { purchaseMessage } from '@purchase/locales/messages/purchaseMessage';
import styles from '@styles';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  compose,
  HandleCreators,
  lifecycle,
  mapper,
  ReactLifeCycleFunctions,
  setDisplayName,
  StateHandler,
  StateHandlerMap,
  StateUpdaters,
  withHandlers,
  withStateHandlers,
} from 'recompose';
import { Dispatch } from 'redux';
import { FormErrors } from 'redux-form';

interface OwnHandlers {
  handleValidate: (payload: PurchaseSettlementFormData) => FormErrors;
  handleSubmit: (payload: PurchaseSettlementFormData) => void;
  handleSubmitSuccess: (result: any, dispatch: Dispatch<any>) => void;
  handleSubmitFail: (errors: FormErrors | undefined, dispatch: Dispatch<any>, submitError: any) => void;
}

interface OwnRouteParams {
  purchaseUid: string;
}

interface OwnState {
  statusType: string | undefined;
  formMode: FormMode;
  companyUid?: string | undefined;
  positionUid?: string | undefined;
  purchaseUid?: string | undefined;
  submitDialogTitle: string;
  submitDialogContentText: string;
  submitDialogCancelText: string;
  submitDialogConfirmedText: string;
}

interface OwnStateUpdaters extends StateHandlerMap<OwnState> {
  stateUpdate: StateHandler<OwnState>;
}

export type PurchaseSettlementEditorProps
  = WithPurchaseSettlement
  & WithOidc
  & WithUser
  & WithLayout
  & WithMasterPage
  & RouteComponentProps<OwnRouteParams>
  & InjectedIntlProps
  & WithStyles<typeof styles>
  & OwnHandlers
  & OwnState
  & OwnStateUpdaters;

const createProps: mapper<PurchaseSettlementEditorProps, OwnState> = (props: PurchaseSettlementEditorProps): OwnState => {
  const { history } = props;

  const state = history.location.state;

  return {
    statusType: state ? state.statusType : undefined,
    formMode: state.statusType ? FormMode.Edit : FormMode.New,
    companyUid: state ? state.companyUid : undefined,
    positionUid: state ? state.positionUid : undefined,
    purchaseUid: state ? state.uid : undefined, 
    submitDialogTitle: !state.statusType ? props.intl.formatMessage(purchaseMessage.settlement.confirm.settleTitle) : props.intl.formatMessage(purchaseMessage.settlement.confirm.modifyTitle),
    submitDialogContentText: !state.statusType ? props.intl.formatMessage(purchaseMessage.settlement.confirm.settleDescription) : props.intl.formatMessage(purchaseMessage.settlement.confirm.modifyDescription),
    // submitDialogContentText: ` `,
    submitDialogCancelText: props.intl.formatMessage(layoutMessage.action.cancel),
    submitDialogConfirmedText: props.intl.formatMessage(layoutMessage.action.ok),

  };
};

const stateUpdaters: StateUpdaters<{}, OwnState, OwnStateUpdaters> = {
  stateUpdate: (prevState: OwnState) => (newState: any) => ({
    ...prevState,
    ...newState
  })
};

const handlers: HandleCreators<PurchaseSettlementEditorProps, OwnHandlers> = {
  handleValidate: (props: PurchaseSettlementEditorProps) => (formData: PurchaseSettlementFormData) => {
    const errors = {
      information: {},
      items: {
        items: []
      }
    };

    const requiredFields = [
      'date',
    ];

    requiredFields.forEach(field => {
      if (!formData.information[field] || (formData.information[field] === undefined || formData.information[field] === null)) {
        errors.information[field] = props.intl.formatMessage({ id: `purchase.field.information.${field}.required` });
      }
    });

    if (formData.items) {
      const requiredItemFields = ['actual'];

      const itemErrors: any[] = [];

      formData.items.items.forEach((item, index) => {
        const itemError: any = {};

        if (!item) { return; }

        requiredItemFields.forEach(field => {
          if (!item[field] || (item[field] === undefined || item[field] === null)) {
            Object.assign(itemError, { [`${field}`]: 'Required' });
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

    return errors;
  },
  handleSubmit: (props: PurchaseSettlementEditorProps) => (formData: PurchaseSettlementFormData) => {
    const { formMode, purchaseUid, intl } = props;
    const { user } = props.userState;
    // const { response } = props.purchaseSettlementState.detail;
    const { createRequest, updateRequest } = props.purchaseSettlementDispatch;

    if (!user) {
      return Promise.reject('item was not found');
    }

    const parsedItems = () => {
      if (!formData.items) {
        return null;
      }

      const _items: ISettlementItemPostPayload[] = [];
      
      if (formMode === FormMode.New)  {
        formData.items.items.forEach(item =>
          _items.push({
            uid: item.uid,
            amount: item.actual
          })
        );
      }

      return _items;
    };

    const parsedItemsPut = () => {
      if (!formData.items) {
        return null;
      }
      
      const _itemsPut: ISettlementItemPutPayload[] = [];

      if (formMode === FormMode.Edit) {
        formData.items.items.forEach(item =>
          _itemsPut.push({
            uid: item.uid,
            amount: item.actual
          })
          );
        } 
        
      return _itemsPut;
    };

    const payload = {
      date: formData.information.date,
      notes: formData.information.notes,
      items: parsedItems()
    };
    
    const payloadPut = {
      date: formData.information.date,
      notes: formData.information.notes,
      items: parsedItemsPut()
      };
      
    if (!purchaseUid) {
      const message = intl.formatMessage(purchaseMessage.settlement.message.emptyPurchaseUid);

      return Promise.reject(message);
    }
    // creating
    if (formMode === FormMode.New) {
      return new Promise((resolve, reject) => {
        createRequest({
          resolve,
          reject,
          purchaseUid,
          companyUid: user.company.uid,
          positionUid: user.position.uid,
          data: payload as ISettlementPostPayload
        });
      });
    }

    // update checking

    if (formMode === FormMode.Edit) {
      return new Promise((resolve, reject) => {
        updateRequest({
          purchaseUid,
          resolve,
          reject,
          companyUid: user.company.uid,
          positionUid: user.position.uid,
          data: payloadPut as ISettlementPutPayload,
        });
      });
    }

    return null;
  },
  handleSubmitSuccess: (props: PurchaseSettlementEditorProps) => (response: ISettlement) => {
    const { formMode, intl, history } = props;
    const { alertAdd } = props.layoutDispatch;

    let message: string = '';

    if (formMode === FormMode.New) {
      message = intl.formatMessage(purchaseMessage.settlement.message.settleSuccess, { uid: response.uid });
    }

    if (formMode === FormMode.Edit) {
      message = intl.formatMessage(purchaseMessage.settlement.message.updateSuccess, { uid: response.uid });
    }

    alertAdd({
      message,
      time: new Date()
    });

    history.push(`/purchase/settlement/requests/${response.uid}`);
  },
  handleSubmitFail: (props: PurchaseSettlementEditorProps) => (errors: FormErrors | undefined, dispatch: Dispatch<any>, submitError: any) => {
    const { formMode, intl } = props;
    const { alertAdd } = props.layoutDispatch;

    if (errors) {
      // validation errors from server (400: Bad Request)
      alertAdd({
        time: new Date(),
        message: (submitError !== null && typeof submitError === 'object') ? submitError.message : submitError
      });
    } else {
      // another errors from server
      let message: string = '';

      if (formMode === FormMode.New) {
        message = intl.formatMessage(purchaseMessage.settlement.message.settleFailure);
      }

      if (formMode === FormMode.Edit) {
        message = intl.formatMessage(purchaseMessage.settlement.message.updateFailure);
      }

      alertAdd({
        message,
        time: new Date(),
        details: (submitError !== null && typeof submitError === 'object') ? submitError.message : submitError
      });
    }
  }
};

const lifecycles: ReactLifeCycleFunctions<PurchaseSettlementEditorProps, {}> = {
  componentDidMount() {
    const { intl, history, stateUpdate } = this.props;
    const { loadDetailRequest } = this.props.purchaseSettlementDispatch;
    const { user } = this.props.userState;

    const purchase = {
      title: intl.formatMessage(purchaseMessage.settlement.pages.newTitle),
      subTitle: intl.formatMessage(purchaseMessage.settlement.pages.newTitle)
    };

    if (!user) {
      return;
    }

    const { user: oidc } = this.props.oidcState;
    let result: boolean = false;
    if (oidc) {
      const role: string | string[] | undefined = oidc.profile.role;

      if (role) {
        if (Array.isArray(role)) {
          result = role.indexOf(AppRole.Admin) !== -1;
        } else {
          result = role === AppRole.Admin;
        }
      }

      if (result) {
        stateUpdate({ 
          isAdmin: true
        });
      }
    }

    stateUpdate({
      companyUid: user.company.uid,
      positionUid: user.position.uid,
      formMode: FormMode.New
    });

    if (!(history.location.state === undefined || history.location.state === null)) {

      if (!(history.location.state.statusType === undefined || history.location.state.statusType === null)) {
      purchase.title = intl.formatMessage(purchaseMessage.settlement.pages.modifyTitle);
      purchase.subTitle = intl.formatMessage(purchaseMessage.settlement.pages.modifyTitle);

      stateUpdate({
          formMode: FormMode.Edit,
        submitDialogTitle: this.props.intl.formatMessage(purchaseMessage.settlement.confirm.modifyTitle),
        submitDialogContentText: this.props.intl.formatMessage(purchaseMessage.settlement.confirm.modifyDescription),
          // submitDialogContentText: ` `,
        });  
    }

      loadDetailRequest({
        companyUid: user.company.uid,
        positionUid: user.position.uid,
        purchaseUid: history.location.state.uid
      });
      
    }

    this.props.masterPage.changePage({
      uid: AppMenu.PurchaseSettlementRequest,
      parentUid: AppMenu.Purchase,
      parentUrl: `/purchase/requests/${this.props.history.location.state.uid}`,
      title: intl.formatMessage({ id: purchase.title }),
    });
  },
  componentWillUnmount() {
    const { masterPage, purchaseSettlementDispatch } = this.props;

    masterPage.resetPage();

    purchaseSettlementDispatch.createDispose();
    purchaseSettlementDispatch.updateDispose();
  }
};

export const PurchaseSettlementEditor = compose<PurchaseSettlementEditorProps, {}>(
  setDisplayName('PurchaseSettlementEditor'),
  withOidc,
  withUser,
  withLayout,
  withMasterPage,
  withRouter,
  withPurchaseSettlement,
  injectIntl,
  withStyles(styles),
  withStateHandlers<OwnState, OwnStateUpdaters, {}>(createProps, stateUpdaters),
  withHandlers<PurchaseSettlementEditorProps, OwnHandlers>(handlers),
  lifecycle<PurchaseSettlementEditorProps, {}>(lifecycles),
)(PurchaseSettlementEditorView);