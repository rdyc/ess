import { IBasePayload } from '@generic/interfaces';

export interface ISystemPostPayload extends IBasePayload {
  companyUid: string;
  parentCode: string;
  name: string;
  description: string;
  isActive: true;
}