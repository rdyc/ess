import { ICompanyAccess } from '@generic/interfaces';

export interface ITimesheetApprovalGetByIdRequest extends ICompanyAccess {
  timesheetUid?: string;
}