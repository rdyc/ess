import { FormMode } from '@generic/types';
import { PurchaseRequestFormView } from '@purchase/components/purchaseRequest/editor/forms/PurchaseRequestFormView';
import { connect } from 'react-redux';
import { formValueSelector, InjectedFormProps, reduxForm } from 'redux-form';

const formName = 'purchaseRequest';

export type PurchaseRequestItemFormData = {
  uid: string | null | undefined;
  description: string;
  request: number;
};

export type PurchaseRequestFormData = {
  information: {
    uid: string | null | undefined;
    customerUid: string | null | undefined;
    projectUid: string | null | undefined;
    advance: number;
    notes: string | null | undefined;
    date: string | null | undefined;
    currencyType: string | null | undefined;
    rate: number;
    request: number;
  },
  items:  {
   items: PurchaseRequestItemFormData[];
  }
};

interface OwnProps {
  formMode: FormMode;
}

interface FormValueProps {
  formCustomer: string | null;
  formIsCurrencyIDR: boolean | false;
  formCurrencyType: string | null;
  formRate: number | 1;
  formValue: number | 1;
}

export type PurchaseRequestFormProps
  = InjectedFormProps<PurchaseRequestFormData, OwnProps>
  & FormValueProps
  & OwnProps;

const selector = formValueSelector(formName);

const mapStateToProps = (state: any): FormValueProps => {
  
  const customer = selector(state, 'information.customerUid');
  const currencyType = selector(state, 'information.currencyType');
  const rate = selector(state, 'information.rate');
  const value = selector(state, 'information.request'); 
  // const itemValue = selector(state, 'items.items[].requestValue');
  return {
    formCustomer: customer,
    formIsCurrencyIDR: currencyType === 'SCR01',
    formCurrencyType: currencyType,
    formRate: rate,
    formValue: value,
  };
};

const connectedView = connect(mapStateToProps)(PurchaseRequestFormView);

export const PurchaseRequestForm = reduxForm<PurchaseRequestFormData, OwnProps>({
  form: formName,
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true,
  destroyOnUnmount: true,
  onChange: (values: PurchaseRequestFormData, dispatch: any, props: any) => {
    dispatchEvent(new CustomEvent('PURCHASE_FORM', { detail: values }));
  },
})(connectedView);