import { SelectSystemOption } from '@common/components/select';
import { InputNumber } from '@layout/components/input/number';
import { InputText } from '@layout/components/input/text';
import { SelectPosition } from '@lookup/components/position/select';
import { organizationMessage } from '@organization/locales/messages/organizationMessage';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { compose, HandleCreators, withHandlers } from 'recompose';
import { WrappedFieldArrayProps } from 'redux-form';
import { isNullOrUndefined } from 'util';
import { OrganizationHierarchyItemFormData } from './HierarchyForm';
import { HierarchyItemFormView } from './HierarchyItemFormView';

interface OwnProps {
  context: WrappedFieldArrayProps<OrganizationHierarchyItemFormData>;
  companyUidValue: string | null | undefined;
}

interface OwnHandlers {
  generateFieldProps: (name: string) => any;
}

export type HierarchyItemFormProps 
  = OwnProps
  & OwnHandlers
  & InjectedIntlProps;

const handlerCreators: HandleCreators<HierarchyItemFormProps, OwnHandlers> = {
    generateFieldProps: (props: HierarchyItemFormProps) => (name: string) => { 
      const { 
        intl, companyUidValue
      } = props;
      
      let fieldProps: SelectSystemOption & any = {};
      
      const positionFilter: any = {
        companyUid: companyUidValue,
      };
  
      switch (name) {
        case 'sequence':
          fieldProps = {
            type: 'number',
            label: intl.formatMessage(organizationMessage.hierarchy.fieldFor(name, 'fieldName')),
            placeholder: intl.formatMessage(organizationMessage.hierarchy.fieldFor(name, 'fieldPlaceholder')),
            component: InputNumber
          };
          break;

        case 'positionUid':
          fieldProps = {
            type: 'text',
            label: intl.formatMessage(organizationMessage.hierarchy.fieldFor(name, 'fieldName')),
            placeholder: intl.formatMessage(organizationMessage.hierarchy.fieldFor(name, 'fieldPlaceholder')),
            component: SelectPosition,
            disabled: isNullOrUndefined(companyUidValue),
            filter: positionFilter
          };
          break;
        
        default:
          fieldProps = {
            type: 'text',
            label: intl.formatMessage(organizationMessage.hierarchy.fieldFor(name, 'fieldName')),
            placeholder: intl.formatMessage(organizationMessage.hierarchy.fieldFor(name, 'fieldPlaceholder')),
            component: InputText
          };
          break;
      }
      return fieldProps;
  }
};

export const HierarchyItemForm = compose<HierarchyItemFormProps, OwnProps>(
  injectIntl,
  withHandlers<HierarchyItemFormProps, OwnHandlers>(handlerCreators),
)(HierarchyItemFormView);