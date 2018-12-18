export interface IEmployeePutPayload {
  uid: string;
  companyUid: string;
  employmentNumber: string;
  employementType: string;
  joinDate: string;
  inactiveDate?: string | null;
  fullName: string;
  dateOfBirth: string;
  email: string;
  emailPersonal: string;
  phone: string;
  mobilePhone?: string | null;
  address: string;
  addressAdditional: string;
  genderType: string;
  religionType?: string | null;
  taxType: string;
  bloodType?: string | null;
  familyCardNumber: string;
  citizenNumber: string;
  taxNumber: string;
  bpjsEmployementNumber?: string | null;
  bpjsHealthCareNumber?: string | null;
  bankAccount: string;
  bankAccountName: string;
  bankAccountBranch?: string | null;
  emergencyContactName?: string | null;
  emergencyContactRelation?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactPhoneAdditional?: string | null;
  image?: string | null;
}