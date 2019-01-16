import { IBasePayload } from '@generic/interfaces';
import { IProjectRegistrationPutDocument, IProjectRegistrationPutSales } from '@project/classes/request/registration';

export interface IProjectRegistrationPatchPayload extends IBasePayload {
  name: string;
  description?: string;
  start: string;
  end: string;
  documents?: IProjectRegistrationPutDocument[];
  sales?: IProjectRegistrationPutSales[];
}