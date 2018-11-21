import { withLayout } from '@layout/hoc/withLayout';
import { WithUser, withUser } from '@layout/hoc/withUser';
import { IDiem } from '@lookup/classes/response';
import { WithLookupDiem, withLookupDiem } from '@lookup/hoc/withLookupDiem';
import { WithStyles, withStyles } from '@material-ui/core';
import styles from '@styles';
import { TravelItemFormData, TravelRequestFormData } from '@travel/components/request/editor/forms/RequestForm';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose, mapper, StateHandlerMap, StateUpdaters, withStateHandlers } from 'recompose';
import { InjectedFormProps, WrappedFieldArrayProps } from 'redux-form';
import { RequestItemFormView } from './RequestItemFormView';

interface OwnProps {
  context: WrappedFieldArrayProps<TravelItemFormData>;
  destinationTypeValue: string | null | undefined;
  diemRequest: IDiem[] | undefined;
  onCostChange: (event: any, newValue: number, oldValue: number) => void;
}

interface OwnState {
  active: string | undefined;
  isExpanded: boolean;
}

interface OwnStateHandler extends StateHandlerMap<OwnState> {
  handleToggle: (type: string) => OwnState;
}

export type RequestItemFormProps
  = OwnProps
  & InjectedFormProps<TravelRequestFormData, OwnProps>
  & OwnState
  & OwnStateHandler
  & WithUser
  & WithLookupDiem
  & WithStyles
  & InjectedIntlProps;

// const lifecycles: ReactLifeCycleFunctions<RequestItemFormProps, {}> = {
//   componentDidMount() {
//     const { user } = this.props.userState;
//     const { loadAllRequest } = this.props.lookupDiemDispatch;
//     const { destinationTypeValue } = this.props;

//     const filter: any = {
//       projectType: undefined,
//       destinationType: destinationTypeValue,
//       find: user && user.company.uid,
//       findBy: 'companyUid'      
//     };
//     if (user) {
//       loadAllRequest ({
//         filter
//       });
//     }
//   },
//   componentWillUnmount() {

//     const { lookupDiemDispatch } = this.props;

//     lookupDiemDispatch.loadAllDispose();
//   }
// };

const createProps: mapper<RequestItemFormProps, OwnState> = (props: RequestItemFormProps): OwnState => ({
  active: undefined,
  isExpanded: false
});

const stateUpdaters: StateUpdaters<{}, OwnState, OwnStateHandler> = {
  handleToggle: (state: OwnState) => (type: string) => ({
    active: type,
    isExpanded: state.active === type ? !state.isExpanded : true
  })
};

export const RequestItemForm = compose<RequestItemFormProps, OwnProps>(
  withUser,
  withLayout,
  withLookupDiem,
  withStyles(styles),
  injectIntl,
  withStateHandlers<OwnState, OwnStateHandler>(createProps, stateUpdaters),
)(RequestItemFormView);