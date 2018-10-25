import { IAccountEmployee } from '@account/classes';
import { ICommonSystem } from '@common/classes';
import { IBaseChanges } from '@generic/interfaces';
import { ILookupCustomer, ILookupPosition } from '@lookup/classes';
import { IOrganizationWorkflow } from '@organization/interfaces';
import { IProject, IProjectSite } from '@project/classes/response';
import { ITravelSettlementItem, ITravelSummary } from '@travel/classes/response';

export interface ITravelSettlementDetail {
  uid: string; 
  employeeUid: string;
  employee?: IAccountEmployee | null;
  positionUid: string;
  position: ILookupPosition | null;
  destinationType: string;
  destination?: ICommonSystem | null;
  start: string;
  end: string;
  customerUid: string;
  customer?: ILookupCustomer | null;
  projectUid: string;
  project?: IProject | null;
  siteUid?: string | null;
  site?: IProjectSite | null;
  activityType: string;
  activity?: ICommonSystem | null;
  objective?: string | null;
  target?: string | null;
  comment?: string | null;
  total: number;
  statusType: string;
  status?: ICommonSystem | null;
  rejectReason?: string | null;
  isNotified: boolean;
  histories?: History[];
  workflow?: IOrganizationWorkflow | null;
  changes?: IBaseChanges | null;
  items: ITravelSettlementItem[] | null;
  summary: ITravelSummary | null;
}