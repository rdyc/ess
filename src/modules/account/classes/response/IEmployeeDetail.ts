import { IEmployeeBank, IEmployeeContact } from '@account/classes/response';
import { ICommonSystem } from '@common/classes';
import { IBaseChanges } from '@generic/interfaces/IBaseChanges';
import { ILookupCompany } from '@lookup/classes';

export interface IEmployeeDetail {
    uid: string;
    joinDate: Date;
    companyUid: string | null;
    company: ILookupCompany | null;
    employmentNumber: string;
    employmentType: string;
    employment: ICommonSystem | null;
    fullName: string;
    dateOfBirth: Date | null;
    birthPlace: string | null;
    email: string;
    emailPersonal: string  | null;
    phone: string | null;
    mobilePhone: string | null;
    address: string  | null;
    addressAdditional: string | null;
    genderType: string | null;
    gender: ICommonSystem | null;
    religionType: string | null;
    religion: ICommonSystem | null;
    taxType: string | null;
    tax: ICommonSystem | null;
    bloodType: string | null;
    blood: ICommonSystem | null;
    familyCardNumber: string | null;
    citizenNumber: string | null;
    taxNumber: string | null;
    bpjsEmploymentNumber: string | null;
    bpjsHealthCareNumber: string | null;
    bank: IEmployeeBank | null;
    contact: IEmployeeContact | null;
    image: string | null;
    changes: IBaseChanges | null;
}