import { accountMessage } from '@account/locales/messages/accountMessage';
import { FormMode } from '@generic/types';
import { Card, CardContent, CardHeader } from '@material-ui/core';
import * as React from 'react';
import { Field } from 'redux-form';
import { AccountEmployeeFamilyDetailFormProps } from './AccountEmployeeFamilyDetailForm';

export const AccountEmployeeFamilyDetailFormView: React.SFC<AccountEmployeeFamilyDetailFormProps> = props => {
  const { formMode, intl } = props;
  const { names } = props.context;

  const renderField = (name: string) => {
    const fieldName = name.replace('information.', '');
    const fieldProps = props.generateFieldProps(fieldName);

    // don't show uid for new form
    const fields = ['employeeUid'];
    if (formMode === FormMode.New && fields.indexOf(fieldName) !== -1) {
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
        title={intl.formatMessage(accountMessage.employee.section.basicTitle)}
        subheader={intl.formatMessage(accountMessage.employee.section.basicSubHeader)}
      />
      <CardContent>
        {names.map(name => renderField(name))}
      </CardContent>
    </Card>
  );

  return render;
};