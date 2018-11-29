import AppMenu from '@constants/AppMenu';
import { DialogConfirmation } from '@layout/components/dialogs';
import { SingleConfig, SingleHandler, SinglePage, SingleState } from '@layout/components/pages/singlePage/SinglePage';
import { IAppBarMenu } from '@layout/interfaces';
import { layoutMessage } from '@layout/locales/messages';
import { IRoleDetail } from '@lookup/classes/response';
import { RoleUserAction } from '@lookup/classes/types';
import { lookupMessage } from '@lookup/locales/messages/lookupMessage';
import * as React from 'react';
import { RoleDetailProps } from './LookupRoleDetail';
import { LookupRoleInformation } from './shared/LookupRoleInformation';

const config: SingleConfig<IRoleDetail, RoleDetailProps> = {
  // page info
  page: (props: RoleDetailProps) => ({
    uid: AppMenu.LookupRole,
    parentUid: AppMenu.Lookup,
    title: props.intl.formatMessage(lookupMessage.role.page.detailTitle),
    description: props.intl.formatMessage(lookupMessage.role.page.detailSubHeader),
  }),

  // action centre
  showActionCentre: true,

  // more
  hasMore: true,
  moreOptions: (props: RoleDetailProps, state: SingleState, callback: SingleHandler): IAppBarMenu[] => ([
    {
      id: RoleUserAction.Refresh,
      name: props.intl.formatMessage(layoutMessage.action.refresh),
      enabled: true,
      visible: true,
      onClick: callback.handleForceReload
    },
    {
      id: RoleUserAction.Modify,
      name: props.intl.formatMessage(layoutMessage.action.modify),
      enabled: true,
      visible: true,
      onClick: props.handleOnModify
    },
    // {
    //   id: CompanyUserAction.Delete,
    //   name: props.intl.formatMessage(layoutMessage.action.),
    //   enabled: true,
    //   visible: true,
    //   onClick: () => alert('go to new page here')
    // }
  ]),

  // events
  onDataLoad: (props: RoleDetailProps, callback: SingleHandler, forceReload?: boolean | false) => {
    const { user } = props.userState;
    const { isLoading, request, response } = props.lookupRoleState.detail;
    const { loadDetailRequest } = props.lookupRoleDispatch;

    // when user is set and not loading and has timesheetUid in route params
    if (user && !isLoading && props.match.params.roleUid && props.history.location.state) {
      // when timesheetUid was changed or response are empty or force to reload
      if ((request && request.roleUid !== props.match.params.roleUid) || !response || forceReload) {
        loadDetailRequest({
          companyUid: props.history.location.state.companyUid,
          roleUid: props.match.params.roleUid,
        });
      } else {
        // just take data from previous response
        callback.handleResponse(response);
      }
    }
  },
  onUpdated: (states: RoleDetailProps, callback: SingleHandler) => {
    const { isLoading, response } = states.lookupRoleState.detail;
    
    callback.handleLoading(isLoading);

    // when got a response from api
    if (response && response.data) {
      callback.handleResponse(response);
    }
  },
  
  // primary
  primaryComponent: (data: IRoleDetail, props: RoleDetailProps) => (
    <LookupRoleInformation data={data}/>
  ),

  // secondary (multiple components are allowed)
  secondaryComponents: (data: IRoleDetail, props: RoleDetailProps) => ([
    // <WorkflowHistory data={data.workflow} />
  ])
};

export const LookupRoleDetailView: React.SFC<RoleDetailProps> = props => (
  <SinglePage
    config={config}
    connectedProps={props}
  >
    <DialogConfirmation 
      isOpen={props.dialogOpen}
      fullScreen={props.dialogFullScreen}
      title={props.dialogTitle}
      content={props.dialogContent}
      labelCancel={props.dialogCancelLabel}
      labelConfirm={props.dialogConfirmLabel}
      onClickCancel={props.handleOnCloseDialog}
      onClickConfirm={props.handleOnConfirm}
    />
  </SinglePage>
);
