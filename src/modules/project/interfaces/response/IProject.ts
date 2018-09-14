import { ILookupCustomer } from '@lookup/interfaces';
import { ICommonSystem } from '@common/interfaces';
import { IBaseChanges } from '@generic/interfaces';
import { IAccountEmployee } from '@account/interfaces';

export interface IProject {
  uid:              string;
  customerUid:      string;
  customer:         ILookupCustomer | null;
  projectType:      string;
  project:          ICommonSystem | null;
  contractNumber:   string | null;
  ownerEmployeeUid: string | null;
  owner:            IAccountEmployee | null;
  name:             string;
  description:      string | null;
  maxHours:         number;
  start:            string | null;
  end:              string | null;
  statusType:       string;
  status:           ICommonSystem | null;
  rejectedReason:   string | null;
  changes:          IBaseChanges | null;
}
