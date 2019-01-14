import { ICommonSystem } from '@common/classes';
import { IBaseChanges } from '@generic/interfaces';
import { ICompanyList } from '@lookup/classes/response';

export interface IDiemDetail {
  uid: string; 
  companyUid?: string;
  company?: ICompanyList;
  currencyUid: string;
  currency: string;  // ICurrencyList;   
  projectType: string;
  project?: ICommonSystem;
  destinationType: string;
  destination?: ICommonSystem;
  value: number;
  changes?: IBaseChanges;
}