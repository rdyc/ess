import { IBasePayload } from '@generic/interfaces';
import { IOrganizationHierarchyPostItem } from './IOrganizationHierarchyPostItem';

export interface IOrganizationHierarchyPutPayload extends IBasePayload {
  name: string;
  description?: string;
  inactiveDate?: string;
  items: IOrganizationHierarchyPostItem[];
}