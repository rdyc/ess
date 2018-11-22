import AppMenu from '@constants/AppMenu';
import { 
  CollectionConfig, 
  CollectionDataProps, 
  CollectionHandler,
  CollectionPage, } from '@layout/components/pages';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { IAppBarMenu } from '@layout/interfaces';
import { layoutMessage } from '@layout/locales/messages';
import { Button } from '@material-ui/core';
import { ISettlement } from '@purchase/classes/response/purchaseSettlement';
import { PurchaseUserAction, SettlementField } from '@purchase/classes/types';
import { SettlementSummary } from '@purchase/components/purchaseSettlement/detail/shared/SettlementSummary';
import { purchaseRequestFieldTranslator } from '@purchase/helper';
import { withSettlementApproval, WithSettlementApproval } from '@purchase/hoc/settlementHistories/withSettlementApproval';
import * as moment from 'moment';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { compose } from 'recompose';

const config: CollectionConfig<ISettlement, AllProps> = {
  // page info
  page: (props: AllProps) => ({
  uid: AppMenu.PurchaseSettlementApproval,
  parentUid: AppMenu.Purchase,
  // title: intl.formatMessage({ id: 'purchase.title' }),
  // description: intl.formatMessage({ id: 'purchase.subTitle' }),
  title: 'Purchase Settlement Approval',
  description: 'Lorem ipsum.',
  }),

  // top bar
  fields: Object.keys(SettlementField).map(key => ({
    value: key,
    name: SettlementField[key]
  })),
  fieldTranslator: purchaseRequestFieldTranslator,

  // searching
  hasSearching: true,
  searchStatus: (states: AllProps): boolean => {
    let result: boolean = false;

    const { request } = states.settlementApprovalState.all;

    if (request && request.filter && request.filter['query.find']) {
      result = request.filter['query.find'] ? true : false;
    }

    return result;
  },

  // action centre
  showActionCentre: true,

  // more
  hasMore: true,
  moreOptions: (props: AllProps, callback: CollectionHandler): IAppBarMenu[] => ([
    {
      id: PurchaseUserAction.Refresh,
      name: props.intl.formatMessage(layoutMessage.action.refresh),
      enabled: true,
      visible: true,
      onClick: () => callback.handleForceReload()
    },
  ]),

  // data filter
  filter: {
    orderBy: 'settlementStatusType',
    direction: 'ascending'
  },

  // events
  onDataLoad: (states: AllProps, callback: CollectionHandler, params: CollectionDataProps, forceReload?: boolean | false) => {
    const { user } = states.userState;
    const { isLoading, response } = states.settlementApprovalState.all;
    const { loadAllRequest } = states.settlementApprovalDispatch;

    // when user is set and not loading
    if (user && !isLoading) {
      // when response are empty or force reloading
      if (!response || forceReload) {
        loadAllRequest({
          filter: {
            companyUid: user.company.uid,
            positionUid: user.position.uid,
            'query.find': params.find,
            'query.findBy': params.findBy,
            'query.orderBy': params.orderBy,
            'query.direction': params.direction,
            'query.page': params.page,
            'query.size': params.size,
          }
        });
      } else {
        // just take data from previous response
        callback.handleResponse(response);
      }
    }
  },
  onUpdated: (states: AllProps, callback: CollectionHandler) => {
    const { isLoading, response } = states.settlementApprovalState.all;

    callback.handleLoading(isLoading);
    callback.handleResponse(response);
  },
  onBind: (item: ISettlement, index: number) => ({
    key: index,
    primary: `${item.currency && item.currency.value} ${item.request}` || item.notes || '',
    secondary: item.projectUid || item.project && item.project.name || '',
    tertiary: item.customer && item.customer.name || item.customerUid || '',
    quaternary: item.uid,
    quinary: item.status && item.status.value || item.statusType || '',
    senary: item.changes && moment(item.changes.updatedAt ? item.changes.updatedAt : item.changes.createdAt).fromNow() || '?'
  }),

  // summary component
  summaryComponent: (item: ISettlement) => (
    <SettlementSummary data = {item} />
    ),

  // action component
  actionComponent: (item: ISettlement, callback: CollectionHandler ) => (
    <Button 
      size= "small"
      // onClick = {() => alert(`go to ${item.uid}`)}
      onClick={() => callback.handleRedirectTo(`/purchase/settlementapprovals/details/${item.uid}`)}
    >
      <FormattedMessage { ...layoutMessage.action.approve } />
    </Button>
  ),

  // custom row render: uncomment to see different
  // onRowRender: (item: ISettlement, index: number) => (
  //   <div key={index}>{item.name}</div>
  // )
};

type AllProps
  = WithUser
  & InjectedIntlProps
  & WithSettlementApproval;

const settlementApprovalCollectionPage: React.SFC<AllProps> = props => (
  <CollectionPage
    config= { config }
    connectedProps = { props }
  />
);

export const SettlementApprovalCollectionPage = compose(
  withUser,
  injectIntl,
  withSettlementApproval
)(settlementApprovalCollectionPage);