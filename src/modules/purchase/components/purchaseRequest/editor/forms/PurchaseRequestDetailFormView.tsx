import { FormMode } from '@generic/types';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import { PurchaseRequestDetailFormProps } from '@purchase/components/purchaseRequest/editor/forms/PurchaseRequestDetailForm';
import { purchaseMessage } from '@purchase/locales/messages/purchaseMessage';
import * as React from 'react';
import { Field } from 'redux-form';

export const PurchaseRequestDetailFormView: React.SFC<PurchaseRequestDetailFormProps> = props => {
  const { formMode, intl, isCurrencyIdr } = props;
  const { names } = props.context;

  const renderField = (name: string) => {
    const fieldName = name.replace('information.', '');
    const fieldProps = props.generateFieldProps(name);

    // don't show uid for new form
    const fields = ['uid'];
    if (formMode === FormMode.New && fields.indexOf(fieldName) !== -1) {
      return null;
    }

    const fieldIDRs = ['requestInIDR'];
    if (isCurrencyIdr && fieldIDRs.indexOf(fieldName) !== -1) {
      return null;
    }

    return (
      <Field
        key={fieldName}
        name={fieldName}
        {...fieldProps}
      />
    );
  };

  const render = (
    <Card square>
      <CardHeader
        title={intl.formatMessage(purchaseMessage.request.section.infoTitle)}
        // subheader={intl.formatMessage(purchaseMessage.request.section.infoSubHeader)}
      />
      <CardContent>
        {names.map(name => renderField(name))}
      </CardContent>
    </Card>
  );

  return render;
};