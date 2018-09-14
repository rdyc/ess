import { IAccountEmployee } from '@account/interfaces';
import { ICommonSystem } from '@common/interfaces';
import { IBaseChanges } from '@generic/interfaces';
import { ILookupCustomer } from '@lookup/interfaces';
import { IOrganizationHierarchy, IOrganizationWorkflow } from '@organization/interfaces';
import { IProjectDocument, IProjectSales, IProjectSite } from '@project/interfaces/response';

export interface IProjectDetail {
  uid:              string;
  customerUid:      string;
  customer:         ILookupCustomer | null;
  projectType:      string;
  project:          ICommonSystem | null;
  hierarchyUid:     string;
  hierarchy:        IOrganizationHierarchy | null;
  currencyType:     string;
  currency:         ICommonSystem;
  contractNumber:   string | null;
  ownerEmployeeUid: string | null;
  owner:            IAccountEmployee | null;
  name:             string;
  description:      string | null;
  maxHours:         number;
  start:            string | null;
  end:              string | null;
  childProjectUid:  string | null;
  statusType:       string;
  status:           ICommonSystem | null;
  rejectedReason:   string | null;
  rate:             number | null;
  valueUsd:         number;
  valueIdr:         number | null;
  isNotifyToOwner:  boolean;
  isNotified:       boolean;
  sites:            IProjectSite[] | null;
  sales:            IProjectSales[] | null;
  documents:        IProjectDocument[] | null;
  documentPreSales: IProjectDocument[] | null;
  histories:        History[];
  workflow:         IOrganizationWorkflow | null;
  changes:          IBaseChanges | null;
}
