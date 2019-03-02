import { WorkflowStatusType } from '@common/classes/types';
import { RadioGroupChoice } from '@layout/components/input/radioGroup';
import { IPopupMenuOption } from '@layout/components/PopupMenu';
import { WithLayout, withLayout } from '@layout/hoc/withLayout';
import { WithNotification, withNotification } from '@layout/hoc/withNotification';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { layoutMessage } from '@layout/locales/messages';
import { ModuleDefinitionType, NotificationType } from '@layout/types';
import { IWorkflowApprovalPayload } from '@organization/classes/request/workflow/approval';
import { WorkflowApprovalFormData } from '@organization/components/workflow/approval/WorkflowApprovalForm';
import { organizationMessage } from '@organization/locales/messages/organizationMessage';
import { TravelUserAction } from '@travel/classes/types';
import { WithTravelApproval, withTravelApproval } from '@travel/hoc/withTravelApproval';
import { WithTravelSettlementApproval, withTravelSettlementApproval } from '@travel/hoc/withTravelSettlementApproval';
import { travelApprovalMessage } from '@travel/locales/messages/travelApprovalMessages';
import { travelMessage } from '@travel/locales/messages/travelMessage';
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
import { isNullOrUndefined, isObject } from 'util';

import { TravelSettlementApprovalDetailViews } from './TravelSettlementApprovalDetailViews';

interface OwnHandler {
  handleGetDataTravel: () => void;
  handleOnLoadApi: () => void;
  handleOnLoadTravel: () => void;
  handleOnSelectedMenu: (item: IPopupMenuOption) => void;
  handleValidate: (payload: WorkflowApprovalFormData) => FormErrors;
  handleSubmit: (payload: WorkflowApprovalFormData) => void;
  handleSubmitSuccess: (result: any, dispatch: Dispatch<any>) => void;
  handleSubmitFail: (errors: FormErrors | undefined, dispatch: Dispatch<any>, submitError: any) => void;
}

interface OwnRouteParams {
  travelSettlementUid: string;
}

interface OwnState {
  shouldLoad: boolean;
  getDataTravel: boolean;
  menuOptions?: IPopupMenuOption[];  
  approvalTitle: string;
  approvalSubHeader: string;
  approvalChoices: RadioGroupChoice[];
  approvalTrueValue: string;
  approvalDialogTitle: string;
  approvalDialogContentText: string;
  approvalDialogCancelText: string;
  approvalDialogConfirmedText: string;
}

interface OwnStateUpdater extends StateHandlerMap<OwnState> {
  setOptions: StateHandler<OwnState>;
  setShouldLoad: StateHandler<OwnState>;
  stateUpdate: StateHandler<OwnState>;
}

export type TravelSettlementApprovalDetailProps
  = WithTravelSettlementApproval
  & WithNotification
  & WithTravelApproval
  & WithUser
  & WithLayout
  & RouteComponentProps<OwnRouteParams> 
  & InjectedIntlProps
  & OwnHandler
  & OwnState
  & OwnStateUpdater;

const createProps: mapper<TravelSettlementApprovalDetailProps, OwnState> = (props: TravelSettlementApprovalDetailProps): OwnState => ({
  shouldLoad: false,
  getDataTravel: false,
  approvalTitle: props.intl.formatMessage(travelMessage.settlement.section.approvalTitle),
  approvalSubHeader: props.intl.formatMessage(travelMessage.settlement.section.approvalSubHeader),
  approvalChoices: [
    { value: WorkflowStatusType.Approved, label: props.intl.formatMessage(organizationMessage.workflow.option.approve) },
    { value: WorkflowStatusType.Rejected, label: props.intl.formatMessage(travelMessage.settlementApproval.option.adjustmentNeeded) }
  ],
  approvalTrueValue: WorkflowStatusType.Approved,
  approvalDialogTitle: props.intl.formatMessage(travelMessage.settlementApproval.confirm.submissionTitle),
  approvalDialogContentText: props.intl.formatMessage(travelMessage.settlementApproval.confirm.submissionContent),
  approvalDialogCancelText: props.intl.formatMessage(layoutMessage.action.cancel),
  approvalDialogConfirmedText: props.intl.formatMessage(layoutMessage.action.continue)
});

const stateUpdaters: StateUpdaters<{}, OwnState, OwnStateUpdater> = {
  setShouldLoad: (prevState: OwnState) => (): Partial<OwnState> => ({
    shouldLoad: !prevState.shouldLoad
  }),
  setOptions: (state: OwnState, props: TravelSettlementApprovalDetailProps) => (options?: IPopupMenuOption[]): Partial<OwnState> => ({
    menuOptions: options
  }),
  stateUpdate: (prevState: OwnState) => (newState: any) => ({
    ...prevState,
    ...newState
  })
};

const handlerCreators: HandleCreators<TravelSettlementApprovalDetailProps, OwnHandler> = {
  handleOnLoadApi: (props: TravelSettlementApprovalDetailProps) => () => { 
    if (props.userState.user && !props.travelSettlementApprovalState.detail.isLoading && props.match.params.travelSettlementUid) {
      props.travelSettlementApprovalDispatch.loadDetailRequest({
        companyUid: props.userState.user.company.uid,
        positionUid: props.userState.user.position.uid,
        travelSettlementUid: props.match.params.travelSettlementUid
      });
      if (props.history.location.state) {
        props.travelApprovalDispatch.loadDetailRequest({
          companyUid: props.userState.user.company.uid,
          positionUid: props.userState.user.position.uid,
          travelUid: props.history.location.state.travelUid
        });
      }
    }
  },
  handleOnLoadTravel: (props: TravelSettlementApprovalDetailProps) => () => {
    if (props.userState.user && props.travelSettlementApprovalState.detail.response && props.travelSettlementApprovalState.detail.response.data.travelUid ) {
      props.travelApprovalDispatch.loadDetailRequest({
        companyUid: props.userState.user.company.uid,
        positionUid: props.userState.user.position.uid,
        travelUid: props.travelSettlementApprovalState.detail.response.data.travelUid
      });
    }
  },
  handleGetDataTravel: (props: TravelSettlementApprovalDetailProps) => () => {
    props.stateUpdate({
      getDataTravel: true
    });
  },
  handleOnSelectedMenu: (props: TravelSettlementApprovalDetailProps) => (item: IPopupMenuOption) => { 
    switch (item.id) {
      case TravelUserAction.Refresh:
        props.setShouldLoad();
        break;
    
      default:
        break;
    }
  },
  handleValidate: (props: TravelSettlementApprovalDetailProps) => (formData: WorkflowApprovalFormData) => { 
    const errors = {};
  
    const requiredFields = formData.isApproved !== props.approvalTrueValue
      ? ['isApproved', 'remark']
      : ['isApproved'];

    requiredFields.forEach(field => {
      if (!formData[field] || isNullOrUndefined(formData[field])) {
        errors[field] = props.intl.formatMessage(organizationMessage.workflow.fieldFor(field, 'fieldRequired'));
      }
    });
    
    return errors;
  },
  handleSubmit: (props: TravelSettlementApprovalDetailProps) => (formData: WorkflowApprovalFormData) => { 
    const { match, intl } = props;
    const { user } = props.userState;
    const { createRequest } = props.travelSettlementApprovalDispatch;

    // user checking
    if (!user) {
      return Promise.reject('user was not found');
    }

    // props checking
    if (!match.params.travelSettlementUid) {
      const message = intl.formatMessage(travelApprovalMessage.emptyProps);

      return Promise.reject(message);
    }

    // compare approval status string
    const isApproved = formData.isApproved === WorkflowStatusType.Approved;

    // generate payload
    const payload: IWorkflowApprovalPayload = {
      isApproved,
      remark: formData.remark
    };

    // dispatch update request
    return new Promise((resolve, reject) => {
      createRequest({
        resolve, 
        reject,
        companyUid: user.company.uid,
        positionUid: user.position.uid,
        travelSettlementUid: match.params.travelSettlementUid, 
        data: payload, 
      });
    });
  },
  handleSubmitSuccess: (props: TravelSettlementApprovalDetailProps) => (response: boolean) => {
    const { intl, match } = props;
    const { alertAdd } = props.layoutDispatch;
    
    alertAdd({
      time: new Date(),
      message: intl.formatMessage(travelApprovalMessage.submitSuccess),
    });

    // notification: mark as complete
    props.notificationDispatch.markAsComplete({
      moduleUid: ModuleDefinitionType.TravelSettlement,
      detailType: NotificationType.Approval,
      itemUid: match.params.travelSettlementUid
    });

    props.setShouldLoad();
    // history.push('/travel/approvals/settlement');    
  },
  handleSubmitFail: (props: TravelSettlementApprovalDetailProps) => (errors: FormErrors | undefined, dispatch: Dispatch<any>, submitError: any) => {
    const { intl } = props;
    const { alertAdd } = props.layoutDispatch;
    
    if (errors) {
      // validation errors from server (400: Bad Request)
      alertAdd({
        time: new Date(),
        message: isObject(submitError) ? submitError.message : submitError
      });
    } else {
      alertAdd({
        time: new Date(),
        message: intl.formatMessage(travelApprovalMessage.submitFailure),
        details: isObject(submitError) ? submitError.message : submitError
      });
    }
  }
};

const lifecycles: ReactLifeCycleFunctions<TravelSettlementApprovalDetailProps, OwnState> = {
  componentDidMount() {
    if (isNullOrUndefined(this.props.travelSettlementApprovalState.detail.response)) {
      this.props.handleOnLoadApi();
    }
  },
  componentWillUpdate(prevProps: TravelSettlementApprovalDetailProps) {
    // handle updated route params
    if (this.props.match.params.travelSettlementUid !== prevProps.match.params.travelSettlementUid) {
      this.props.handleOnLoadApi();
      // this.props.handleOnLoadTravel();
    }
  },
  componentDidUpdate(prevProps: TravelSettlementApprovalDetailProps) {
    // handle updated should load
    if (this.props.shouldLoad && this.props.shouldLoad !== prevProps.shouldLoad) {
      // turn of shoul load
      this.props.setShouldLoad();

      // load from api
      this.props.handleOnLoadApi();
      // this.props.handleOnLoadTravel();
    }

    // handle updated response state
    if (this.props.travelSettlementApprovalState.detail !== prevProps.travelSettlementApprovalState.detail) {
      const options: IPopupMenuOption[] = [
        {
          id: TravelUserAction.Refresh,
          name: this.props.intl.formatMessage(layoutMessage.action.refresh),
          enabled: !this.props.travelSettlementApprovalState.detail.isLoading,
          visible: true
        }
      ];

      this.props.setOptions(options);
    }

    if (!this.props.getDataTravel && !this.props.history.location.state.travelUid || this.props.match.params.travelSettlementUid !== prevProps.match.params.travelSettlementUid) {
      if (this.props.userState.user && this.props.travelSettlementApprovalState.detail.response ) {
        if (!this.props.travelApprovalState.detail.response) {
          this.props.handleOnLoadTravel();
          this.props.handleGetDataTravel();
        }

        if ( this.props.travelSettlementApprovalState.detail.response.data.travelUid !== (this.props.travelApprovalState.detail.response && this.props.travelApprovalState.detail.response.data.uid) ) {
          this.props.handleOnLoadTravel();
          this.props.handleGetDataTravel();
        }
      }
    }
  },
  componentWillUnmount() {
    const { travelApprovalDispatch, travelSettlementApprovalDispatch } = this.props;
    travelApprovalDispatch.loadDetailDispose();
    travelSettlementApprovalDispatch.loadDetailDispose();
  }
};

export const TravelSettlementApprovalDetails = compose<TravelSettlementApprovalDetailProps, {}>(
  setDisplayName('TravelSettlementApprovalDetail'),
  withRouter,
  withUser,
  withLayout,
  withTravelApproval,
  withTravelSettlementApproval,
  withNotification,
  injectIntl,
  withStateHandlers(createProps, stateUpdaters),
  withHandlers(handlerCreators),
  lifecycle(lifecycles)
)(TravelSettlementApprovalDetailViews);