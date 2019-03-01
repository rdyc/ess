import { ILookupCompany } from '@lookup/classes';
import { ILookupCustomerGetAllFilter } from '@lookup/classes/filters/customer';
import { WithLookupCompany, withLookupCompany } from '@lookup/hoc/withLookupCompany';
import { WithStyles, withStyles } from '@material-ui/core';
import styles from '@styles';
import { InjectedIntlProps, injectIntl } from 'react-intl';
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

import { LookupCustomerListFilterView } from './LookupCustomerListFilterView';

export type ILookupCustomerListFilterResult = Pick<ILookupCustomerGetAllFilter,
  'companyUid'>;

interface OwnOption {
  isOpen: boolean;
  initialProps?: ILookupCustomerListFilterResult;
  onClose: (event: React.MouseEvent<HTMLElement>) => void;
  onApply: (filter: ILookupCustomerListFilterResult) => void;
}

interface IOwnState {
  // filter company
  isFilterCompanyOpen: boolean;
  filterCompany?: ILookupCompany;
}

interface IOwnStateUpdater extends StateHandlerMap<IOwnState> {
  // main filter
  setFilterReset: StateHandler<IOwnState>;

  // filter company
  setFilterCompanyVisibility: StateHandler<IOwnState>;
  setFilterCompany: StateHandler<IOwnState>;
}

interface IOwnHandler {
  // main filter
  handleFilterOnReset: (event: React.MouseEvent<HTMLElement>) => void;
  handleFilterOnApply: (event: React.MouseEvent<HTMLElement>) => void;

  // filter company
  handleFilterCompanyVisibility: (event: React.MouseEvent<HTMLElement>) => void;
  handleFilterCompanyOnSelected: (data: ILookupCompany) => void;
  handleFilterCompanyOnClear: (event: React.MouseEvent<HTMLElement>) => void;
  handleFilterCompanyOnClose: () => void;
}

export type LookupCustomerListFilterProps
  = OwnOption
  & IOwnState
  & IOwnHandler
  & WithLookupCompany
  & IOwnStateUpdater
  & WithStyles<typeof styles>
  & InjectedIntlProps;

const createProps: mapper<LookupCustomerListFilterProps, IOwnState> = (): IOwnState => ({
  isFilterCompanyOpen: false,
});

const stateUpdaters: StateUpdaters<LookupCustomerListFilterProps, IOwnState, IOwnStateUpdater> = {
  // main filter
  setFilterReset: () => () => ({
    filterCompany: undefined
  }),

  // filter company
  setFilterCompanyVisibility: (prevState: IOwnState) => () => ({
    isFilterCompanyOpen: !prevState.isFilterCompanyOpen
  }),
  setFilterCompany: () => (data?: ILookupCompany) => ({
    isFilterCompanyOpen: false,
    filterCompany: data,
  }),
};

const handlerCreators: HandleCreators<LookupCustomerListFilterProps, IOwnHandler> = {
  // main filter
  handleFilterOnReset: (props: LookupCustomerListFilterProps) => () => {
    props.setFilterReset();
  },
  handleFilterOnApply: (props: LookupCustomerListFilterProps) => () => {
    props.onApply({
      companyUid: props.filterCompany && props.filterCompany.uid,
    });
  },

  // filter company
  handleFilterCompanyVisibility: (props: LookupCustomerListFilterProps) => () => {
    props.setFilterCompanyVisibility();
  },
  handleFilterCompanyOnSelected: (props: LookupCustomerListFilterProps) => (data: ILookupCompany) => {
    props.setFilterCompany(data);
  },
  handleFilterCompanyOnClear: (props: LookupCustomerListFilterProps) => () => {
    props.setFilterCompany();
  },
  handleFilterCompanyOnClose: (props: LookupCustomerListFilterProps) => () => {
    props.setFilterCompanyVisibility();
  },
};

const lifecycles: ReactLifeCycleFunctions<LookupCustomerListFilterProps, IOwnState> = {
  componentDidMount() {
    // handling previous filter after leaving list page
    if (this.props.initialProps) {
      const { companyUid } = this.props.initialProps;

      // filter customer
      if (companyUid) {
        const { response } = this.props.lookupCompanyState.list;

        if (response && response.data) {
          const selected = response.data.find(item => item.uid === companyUid);

          this.props.setFilterCompany(selected);
        }
      }
    }
  }
};

export const LookupCustomerListFilter = compose<LookupCustomerListFilterProps, OwnOption>(
  setDisplayName('LookupCustomerListFilter'),
  injectIntl,
  withLookupCompany,
  withStyles(styles),
  withStateHandlers(createProps, stateUpdaters),
  withHandlers(handlerCreators),
  lifecycle(lifecycles)
)(LookupCustomerListFilterView);