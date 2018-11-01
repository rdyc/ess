import { defineMessages } from 'react-intl';

const prefix = 'project.assignment';

// fields
export const projectAssignmentField = defineMessages({
  uid: { id: `${prefix}.field.uid` },
  
  projectUid: { id: `${prefix}.field.projectUid` },
  projectUidRequired: { id: `${prefix}.field.projectUid.required` },
  projectUidPlaceholder: { id: `${prefix}.field.projectUid.placeholder` },
  
  assignedHours: { id: `${prefix}.field.assignedHours` },
  unassignedHours: { id: `${prefix}.field.unassignedHours` },

  employeeUid: { id: `${prefix}.field.item.employeeUid` },
  employeeUidRequired: { id: `${prefix}.field.item.employeeUid.required` },
  employeeUidPlaceholder: { id: `${prefix}.field.item.employeeUid.placeholder` },
  
  role: { id: `${prefix}.field.item.role` },
  roleRequired: { id: `${prefix}.field.item.role.required` },
  rolePlaceholder: { id: `${prefix}.field.item.role.placeholder` },

  jobDesc: { id: `${prefix}.field.item.jobDesc` },
  jobDescRequired: { id: `${prefix}.field.item.jobDesc.required` },
  jobDescPlaceholder: { id: `${prefix}.field.item.jobDesc.placeholder` },

  mandays: { id: `${prefix}.field.item.mandays` },
  mandaysRequired: { id: `${prefix}.field.item.mandays.required` },
  mandaysPlaceholder: { id: `${prefix}.field.item.mandays.placeholder` },

  hours: { id: `${prefix}.field.item.hours` },
});

export const projectAssignmentFieldHelperFor = (field: string, type: 'fieldName' | 'fieldRequired' | 'fieldPlaceholder') => {
  if (type === 'fieldName') {
    switch (field) {
      case 'projectUid': return projectAssignmentField.projectUid;
      case 'employeeUid': return projectAssignmentField.employeeUid;
      case 'role': return projectAssignmentField.role;
      case 'mandays': return projectAssignmentField.mandays;
    
      default: return {id: field};
    }
  }

  if (type === 'fieldRequired') {
    switch (field) {
      case 'projectUid': return projectAssignmentField.projectUidRequired;
      case 'employeeUid': return projectAssignmentField.employeeUidRequired;
      case 'role': return projectAssignmentField.roleRequired;
      case 'mandays': return projectAssignmentField.mandaysRequired;
    
      default: return {id: field};
    }
  }

  if (type === 'fieldPlaceholder') {
    switch (field) {
      case 'projectUid': return projectAssignmentField.projectUidPlaceholder;
      case 'employeeUid': return projectAssignmentField.employeeUidPlaceholder;
      case 'role': return projectAssignmentField.rolePlaceholder;
      case 'mandays': return projectAssignmentField.mandaysPlaceholder;
    
      default: return {id: field};
    }
  }

  return {id: field};
};

// process
export const projectAssignmentSubmission = defineMessages({
  invalidProps: { id: `${prefix}.message.invalidProps` },
  createSuccess: { id: `${prefix}.message.create.success` },
  createFailure: { id: `${prefix}.message.create.failure` },
  updateSuccess: { id: `${prefix}.message.update.success` },
  updateFailure: { id: `${prefix}.message.update.failure` },
});