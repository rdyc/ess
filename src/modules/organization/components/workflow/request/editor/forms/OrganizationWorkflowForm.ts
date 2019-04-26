import { FormMode } from '@generic/types';
import { IMenuDetail } from '@lookup/classes/response';
import { InjectedIntlProps } from 'react-intl';
import { InjectedFormProps, reduxForm } from 'redux-form';
import { OrganizationWorkflowFormView } from './OrganizationWorkflowFormView';

const formName = 'organizationWorkflow';

export type WorkflowHierarchyFormData = {
  uid?: string;
  hierarchyUid: string;
  hierarchyName: string | undefined;
  priority: number;
};

export type WorkflowFormData = {
  hierarchy: {
    hierarchies: WorkflowHierarchyFormData[];
  } 
};

interface OwnProps {
  formMode: FormMode;
  companyUid: string | undefined;
  menu: IMenuDetail | undefined;
}

export type OrganizationWorkflowFormProps
  = InjectedFormProps<WorkflowFormData, OwnProps>
  & InjectedIntlProps
  & OwnProps;

export const OrganizationWorkflowForm = reduxForm<WorkflowFormData, OwnProps>({
  form: formName,
  touchOnChange: true,
  touchOnBlur: true,
  enableReinitialize: true,
  destroyOnUnmount: true
})(OrganizationWorkflowFormView);
