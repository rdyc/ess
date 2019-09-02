import { IEmployee } from '@account/classes/response';
import { IBaseChanges } from '@generic/interfaces';
import { IKPITemplate } from '..';
import { IKPIAssignItem } from './IKPIAssignItem';

export interface IKPIAssignDetail {
  uid: string;
  employeeUid: string;
  employee?: IEmployee | null;
  templateUid: string;
  template?: IKPITemplate | null;
  year: number;
  isFinal: boolean;
  revision?: string;
  items?: IKPIAssignItem[] | null;
  // sentBy?: string | null;
  // sent?: IEmployee | null;
  // sentAt?: string | null;
  changes: IBaseChanges | null;
}