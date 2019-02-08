import AppMenu from '@constants/AppMenu';
import { IListConfig, ListDataProps, ListHandler, ListPage } from '@layout/components/pages';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { layoutMessage } from '@layout/locales/messages';
import { GlobalFormat } from '@layout/types';
import { Button } from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import { ISettlement } from '@purchase/classes/response/purchaseSettlement';
import { SettlementField } from '@purchase/classes/types';
import { SettlementSummary } from '@purchase/components/purchaseSettlement/detail/shared/SettlementSummary';
import { WithSettlementApproval, withSettlementApproval } from '@purchase/hoc/settlementApproval/withSettlementApproval';
import { purchaseMessage } from '@purchase/locales/messages/purchaseMessage';
import * as moment from 'moment';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
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

import { ISettlementApprovalListFilterResult, SettlementApprovalListFilter } from './SettlementApprovalListFilter';

interface IOwnOption {
  
}

interface IOwnState extends ISettlementApprovalListFilterResult {
  shouldUpdate: boolean;
  config?: IListConfig<ISettlement>;
  isFilterOpen: boolean;
}

interface IOwnStateUpdater extends StateHandlerMap<IOwnState> {
  setConfig: StateHandler<IOwnState>;
  setShouldUpdate: StateHandler<IOwnState>;
  setFilterVisibility: StateHandler<IOwnState>;
  setFilterApplied: StateHandler<IOwnState>;
}

interface IOwnHandler {
  handleFilterVisibility: (event: React.MouseEvent<HTMLElement>) => void;
  handleFilterApplied: (filter: ISettlementApprovalListFilterResult) => void;
}

type AllProps 
  = IOwnOption
  & IOwnState
  & IOwnStateUpdater
  & IOwnHandler
  & WithUser
  & WithSettlementApproval
  & InjectedIntlProps
  & RouteComponentProps;

const createProps: mapper<AllProps, IOwnState> = (props: AllProps): IOwnState => {
  const { request } = props.settlementApprovalState.all;
  const state: IOwnState = {
    shouldUpdate: false,
    isFilterOpen: false
  };
  // When location state are present (ex: redirection from dashboard) then don't use redux state
  if (props.location.state) {
    // fill partial props from location state to handle redirection from dashboard notif
    state.status = props.location.state.status;
    state.isNotify = props.location.state.isNotify;
  } else {
  if (request && request.filter) {
      state.customerUid = request.filter.customerUid,
      state.statusType = request.filter.statusType,
      state.isNotify = request.filter.isNotify,
      state.status = request.filter.status;
    }
  }

  return state;
};

const stateUpdaters: StateUpdaters<AllProps, IOwnState, IOwnStateUpdater> = {
  setShouldUpdate: (prevState: IOwnState) => () => ({
    shouldUpdate: !prevState.shouldUpdate
  }),
  setConfig: (prevState: IOwnState) => (config: IListConfig<ISettlement>) => ({
    config
  }),
  setFilterVisibility: (prevState: IOwnState, props: AllProps) => () => ({
    isFilterOpen: !prevState.isFilterOpen
  }),
  setFilterApplied: (prevState: IOwnState) => (filter: ISettlementApprovalListFilterResult) => ({
    ...filter,
    isFilterOpen: false
  }),
};

const handlerCreators: HandleCreators<AllProps, IOwnHandler> = {
  handleFilterVisibility: (props: AllProps) => (event: React.MouseEvent<HTMLElement>) => {
    props.setFilterVisibility();
  },
  handleFilterApplied: (props: AllProps) => (filter: ISettlementApprovalListFilterResult) => {
    props.setFilterApplied(filter);
  },
};

const lifecycles: ReactLifeCycleFunctions<AllProps, IOwnState> = {
  componentDidMount() { 
    const { user } = this.props.userState;
    const { isLoading, request, response } = this.props.settlementApprovalState.all;
    const { loadAllRequest } = this.props.settlementApprovalDispatch;

    const config: IListConfig<ISettlement> = {
      // page
      page: {
        uid: AppMenu.PurchaseSettlementApproval,
        parentUid: AppMenu.Purchase,
        title: this.props.intl.formatMessage(purchaseMessage.s_approval.pages.listTitle),
        // description: this.props.intl.formatMessage(purchaseMessage.s_approval.pages.listSubHeader),
        description: '',
      },
      
      // top bar
      fields: Object.keys(SettlementField)
        .map(key => ({ 
          value: key, 
          name: SettlementField[key] 
        })),
      // fieldTranslator: purchaseRegistrationFieldTranslator,
    
      // searching
      hasSearching: true,
      searchStatus: () => {
        let result: boolean = false;
        
        if (request && request.filter && request.filter.find) {
          result = request.filter.find ? true : false;
        }
    
        return result;
      },
    
      // action centre
      showActionCentre: false,
    
      // events
      onDataLoad: (callback: ListHandler, params: ListDataProps, forceReload?: boolean, resetPage?: boolean) => {  
        // when user is set and not loading
        if (user && !isLoading) {
          // when response are empty or force reloading
          if (!request || !response || forceReload) {
            loadAllRequest({
              filter: {
                companyUid: user.company.uid,
                positionUid: user.position.uid,
                customerUid: this.props.customerUid,
                statusType: this.props.statusType,
                status: this.props.status,
                isNotify: this.props.isNotify,
                find: params.find,
                findBy: params.findBy,
                orderBy: params.orderBy,
                direction: params.direction,
                page: resetPage ? 1 : params.page,
                size: params.size,
            }});
          } else {
            // just take data from previous response
            callback.handleResponse(response);
          }
        }
      },
      onBind: (item: ISettlement, index: number) => ({
        key: index,
        primary: item.uid,
        secondary: item.projectUid || item.project && item.project.name || '',
        tertiary: item.customer && item.customer.name || item.customerUid || '',
        quaternary: item.actualInIDR && `${this.props.intl.formatNumber(item.actualInIDR, GlobalFormat.CurrencyDefault)}` || '',
        quinary: item.status && item.status.value || item.statusType || '',
        senary: item.changes && moment(item.changes.updatedAt ? item.changes.updatedAt : item.changes.createdAt).fromNow() || '?'
      }),
    
      // summary component
      summaryComponent: (item: ISettlement) => ( 
        <SettlementSummary data={item} />
      ),
    
      // action component
      actionComponent: (item: ISettlement, callback: ListHandler) => (
        <React.Fragment>
          <Button 
            size="small"
            onClick={() => this.props.history.push(`/purchase/settlement/approvals/${item.uid}`)}
          >
            <FormattedMessage {...layoutMessage.action.details}/>
          </Button>
        </React.Fragment>
      ),

      // additional controls
      additionalControls: [
        {
          id: 'option-filter',
          title: this.props.intl.formatMessage(layoutMessage.tooltip.filter),
          icon: TuneIcon,
          showBadgeWhen: () => {
            return this.props.customerUid !== undefined ||
              this.props.statusType !== undefined || 
              this.props.status !== undefined || 
              this.props.isNotify === true;
          },
          onClick: this.props.handleFilterVisibility
        }
      ]
    };

    this.props.setConfig(config);
  },
  componentDidUpdate(nextProps: AllProps) {
    // track any changes in filter props
    if (
      this.props.customerUid !== nextProps.customerUid ||
      this.props.status !== nextProps.status ||
      this.props.statusType !== nextProps.statusType ||
      this.props.isNotify !== nextProps.isNotify
    ) {
      this.props.setShouldUpdate();
    }
  }
};

const listView: React.SFC<AllProps> = props => (
  <React.Fragment>
    {
      props.config &&
      <ListPage 
        config={props.config} 
        source={props.settlementApprovalState.all} 
        loadDataWhen={props.shouldUpdate} 
      >
        <SettlementApprovalListFilter 
          isOpen={props.isFilterOpen}
          initialProps={{
            customerUid: props.customerUid,
            statusType: props.statusType,
            status: props.status,
            isNotify: props.isNotify,
          }}
          onClose={props.handleFilterVisibility}
          onApply={props.handleFilterApplied}
        />
      </ListPage>
    }
  </React.Fragment>
);

export const SettlementApprovalList = compose<AllProps, IOwnOption>(
  setDisplayName('SettlementApprovalList'),
  withUser,
  withSettlementApproval,
  withRouter,
  injectIntl,
  withStateHandlers(createProps, stateUpdaters),
  withHandlers(handlerCreators),
  lifecycle(lifecycles)
)(listView);