import { SelectSystem, SelectSystemOption } from '@common/components/select';
import { FormMode } from '@generic/types';
import { InputText } from '@layout/components/input/text';
import { WithAllowedStatusType, withAllowedStatusType } from '@project/hoc/withAllowedStatusType';
import { projectMessage } from '@project/locales/messages/projectMessage';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose, HandleCreators, setDisplayName, withHandlers } from 'recompose';
import { BaseFieldsProps } from 'redux-form';

import { StatusDetailFormView } from './StatusDetailFormView';

interface IOwnProps {
  formMode: FormMode;
  context: BaseFieldsProps;
  statusType: string | null | undefined;
}

interface IOwnHandlers {
  generateFieldProps: (name: string) => any;
}

export type StatusDetailFormProps 
  = IOwnProps
  & IOwnHandlers
  & WithAllowedStatusType
  & InjectedIntlProps;

const handlerCreators: HandleCreators<StatusDetailFormProps, IOwnHandlers> = {
  generateFieldProps: (props: StatusDetailFormProps) => (name: string) => { 
    const { allowedStatusTypes, intl, statusType } = props;
    
    let fieldProps: SelectSystemOption & any = {};
  
    switch (name) {
      case 'statusType':
        fieldProps = {
          required: true,
          category: 'status',
          label: intl.formatMessage(projectMessage.registration.fieldFor(name, 'fieldName')),
          placeholder: intl.formatMessage(projectMessage.registration.fieldFor(name, 'fieldPlaceholder')),
          component: SelectSystem,
          onlyForTypes: allowedStatusTypes(statusType)
        };
        break;
    
      default:
        fieldProps = {
          disabled: true,
          label: intl.formatMessage(projectMessage.registration.fieldFor(name, 'fieldName')),
          placeholder: intl.formatMessage(projectMessage.registration.fieldFor(name, 'fieldPlaceholder')),
          component: InputText
        };
        break;
    }

    return fieldProps;
  }
};

export const StatusDetailForm = compose<StatusDetailFormProps, IOwnProps>(
  setDisplayName('StatusDetailForm'),
  withAllowedStatusType,
  injectIntl,
  withHandlers(handlerCreators),
)(StatusDetailFormView);