import { WorkflowStatusType } from '@common/classes/types';
import AppMenu from '@constants/AppMenu';
import { RadioGroupChoice } from '@layout/components/input/radioGroup';
import { WithAppBar, withAppBar } from '@layout/hoc/withAppBar';
import { WithLayout, withLayout } from '@layout/hoc/withLayout';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { IAppBarMenu } from '@layout/interfaces';
import { MileageApprovalUserAction } from '@mileage/classes/types';
import { MileageItemData } from '@mileage/components/approval/detail/forms/MileageApprovalForm';
import { MileageApprovalDetailView } from '@mileage/components/approval/detail/MileageApprovalDetailView';
import {
  WithMileageApproval,
  withMileageApproval
} from '@mileage/hoc/withMileageApproval';
import { mileageMessage } from '@mileage/locales/messages/mileageMessage';
import { IWorkflowApprovalItemPayload } from '@organization/classes/request/workflow/approval';
import { WorkflowApprovalFormData } from '@organization/components/workflow/approval/WorkflowApprovalMileageItemForm';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  compose,
  HandleCreators,
  lifecycle,
  mapper,
  ReactLifeCycleFunctions,
  withHandlers,
  withStateHandlers
} from 'recompose';
import { Dispatch } from 'redux';
import { FormErrors } from 'redux-form';
import { isNullOrUndefined, isObject } from 'util';

interface OwnHandler {
  // Tambah ITEM Pada workflowapproval, bikin baru mungkin
  handleMileageRefresh: () => void;
  handleValidate: (payload: WorkflowApprovalFormData) => FormErrors;
  handleSubmit: (payload: WorkflowApprovalFormData) => void;
  handleSubmitSuccess: (result: any, dispatch: Dispatch<any>) => void;
  handleSubmitFail: (
    errors: FormErrors | undefined,
    dispatch: Dispatch<any>,
    submitError: any
  ) => void;
}

interface OwnState {
  // Tambah ITEM
  approvalTitle: string;
  approvalSubHeader: string;
  approvalChoices: RadioGroupChoice[];
  approvalTrueValue: string;
  approvalDialogTitle: string;
  approvalDialogContentText: string;
  approvalDialogCancelText: string;
  approvalDialogConfirmedText: string;
}

interface OwnRouteParams {
  mileageUid: string;
}

export type MileageApprovalDetailProps = WithMileageApproval &
  WithUser &
  WithLayout &
  WithAppBar &
  RouteComponentProps<OwnRouteParams> &
  InjectedIntlProps &
  OwnState &
  OwnHandler;

const createProps: mapper<MileageApprovalDetailProps, OwnState> = (
  props: MileageApprovalDetailProps
): OwnState => {
  const { intl } = props;
  
  return {
    // Tambah ITEM
    approvalTitle: intl.formatMessage({ id: 'mileage.approvalTitle' }),
    approvalSubHeader: intl.formatMessage({ id: 'mileage.approvalSubHeader' }),
    approvalChoices: [
      {
        value: WorkflowStatusType.Approved,
        label: intl.formatMessage({ id: 'workflow.approval.action.approve' })
      },
      {
        value: WorkflowStatusType.Rejected,
        label: intl.formatMessage({ id: 'workflow.approval.action.reject' })
      }
    ],
    approvalTrueValue: WorkflowStatusType.Approved,
    approvalDialogTitle: intl.formatMessage({
      id: 'mileage.dialog.approvalTitle'
    }),
    approvalDialogContentText: intl.formatMessage({
      id: 'mileage.dialog.approvalContent'
    }),
    approvalDialogCancelText: intl.formatMessage({
      id: 'global.action.cancel'
    }),
    approvalDialogConfirmedText: intl.formatMessage({
      id: 'global.action.continue'
    })
  };
};

const handlerCreators: HandleCreators<
  MileageApprovalDetailProps,
  OwnHandler
> = {
  handleMileageRefresh: (props: MileageApprovalDetailProps) => () => {
    const { match } = props;
    const { user } = props.userState;
    const { loadDetailRequest } = props.mileageApprovalDispatch;

    if (user) {
      loadDetailRequest({
        companyUid: user.company.uid,
        positionUid: user.position.uid,
        mileageUid: match.params.mileageUid
      });
    }
  },

  handleValidate: (props: MileageApprovalDetailProps) => (
    formData: WorkflowApprovalFormData
  ) => {
    const errors = {};
    // tambahkan Item juga yg required nya ?
    const requiredFields = ['item', 'isApproved', 'remark'];

    requiredFields.forEach(field => {
      if (!formData[field] || isNullOrUndefined(formData[field])) {
        errors[field] = props.intl.formatMessage({
          id: `workflow.approval.field.${field}.required`
        });
      }
    });

    return errors;
  },

  handleSubmit: (props: MileageApprovalDetailProps) => (
    formData: WorkflowApprovalFormData
  ) => {
    const { match, intl } = props;
    const { user } = props.userState;
    const { createRequest } = props.mileageApprovalDispatch;
    // const { response } = props.mileageApprovalState.detail;
    // tambahkan ITEM juga!

    // user checking
    if (!user) {
      return Promise.reject('user was not found');
    }

    // props checking
    if (!match.params.mileageUid) {
      const message = intl.formatMessage(mileageMessage.emptyProps);

      return Promise.reject(message);
    }

    // compare approval status string
    const isApproved = formData.isApproved === WorkflowStatusType.Approved;

    const mileageItems = () => {
      // MASUKAN ITEM
      const items: any[] = [];
      const fillItem = (item: MileageItemData) => {
        const mileageItemUid = Object.keys(item)[0];
     
        items.push({
          mileageItemUid
        });
      };
      console.log(fillItem);
      return items;
    };

    // generate payload
    const payload: IWorkflowApprovalItemPayload = {
      isApproved,
      items: mileageItems(),
      remark: !isApproved ? formData.remark : null
    };

    // dispatch update request
    return new Promise((resolve, reject) => {
      createRequest({
        resolve,
        reject,
        companyUid: user.company.uid,
        positionUid: user.position.uid,
        mileageUid: match.params.mileageUid,
        data: payload
      });
    });
  },

  handleSubmitSuccess: (props: MileageApprovalDetailProps) => (
    response: boolean
  ) => {
    const { intl, history } = props;
    const { alertAdd } = props.layoutDispatch;

    alertAdd({
      time: new Date(),
      message: intl.formatMessage(mileageMessage.updateSuccess)
    });

    history.push('/approval/mileage/list');
  },

  handleSubmitFail: (props: MileageApprovalDetailProps) => (
    errors: FormErrors | undefined,
    dispatch: Dispatch<any>,
    submitError: any
  ) => {
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
        message: intl.formatMessage(mileageMessage.updateFailure),
        details: isObject(submitError) ? submitError.message : submitError
      });
    }
  }
};

const lifecycles: ReactLifeCycleFunctions<MileageApprovalDetailProps, {}> = {
  componentDidMount() {
    const {
      match,
      layoutDispatch,
      appBarDispatch,
      intl,
      handleMileageRefresh
    } = this.props;

    const { user } = this.props.userState;
    const { loadDetailRequest } = this.props.mileageApprovalDispatch;

    layoutDispatch.changeView({
      uid: AppMenu.MileageApproval,
      parentUid: AppMenu.Mileage,
      title: intl.formatMessage({ id: 'mileage.approval.detail.title' }),
      subTitle: intl.formatMessage({ id: 'mileage.approval.detail.subTitle' })
    });

    layoutDispatch.navBackShow();
    layoutDispatch.moreShow();

    const handleMenuClick = (menu: IAppBarMenu): void => {
      switch (menu.id) {
        case MileageApprovalUserAction.Refresh:
          handleMileageRefresh();
          break;

        default:
          break;
      }
    };

    appBarDispatch.assignCallback(handleMenuClick);

    if (user) {
      loadDetailRequest({
        mileageUid: match.params.mileageUid,
        companyUid: user.company.uid,
        positionUid: user.position.uid
      });
    }
  },
  componentWillReceiveProps(nextProps: MileageApprovalDetailProps) {
    if (
      nextProps.mileageApprovalState.detail.response !==
      this.props.mileageApprovalState.detail.response
    ) {
      const { intl } = nextProps;
      const { assignMenus } = nextProps.appBarDispatch;

      const currentMenus = [
        {
          id: MileageApprovalUserAction.Refresh,
          name: intl.formatMessage({ id: 'global.action.refresh' }),
          enabled: true,
          visible: true
        }
      ];

      assignMenus(currentMenus);
    }
  },
  componentWillUnmount() {
    const {
      layoutDispatch,
      appBarDispatch,
      mileageApprovalDispatch
    } = this.props;

    layoutDispatch.changeView(null);
    layoutDispatch.navBackHide();
    layoutDispatch.moreHide();
    layoutDispatch.actionCentreHide();

    appBarDispatch.dispose();

    mileageApprovalDispatch.loadDetailDispose();
  }
};

export const MileageApprovalDetail = compose<MileageApprovalDetailProps, {}>(
  withUser,
  withLayout,
  withAppBar,
  withRouter,
  withMileageApproval,
  injectIntl,
  withStateHandlers<OwnState, {}, {}>(createProps, {}),
  withHandlers<MileageApprovalDetailProps, OwnHandler>(handlerCreators),
  lifecycle<MileageApprovalDetailProps, {}>(lifecycles)
)(MileageApprovalDetailView);
