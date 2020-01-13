import { envHelper, IFieldEnvHelper } from '@utils/envHelper';

const hostname: string = document && document.location && document.location.hostname || process.env.REACT_APP_HOST_LOCAL || '';

const roleUids = envHelper(IFieldEnvHelper.RoleIdsSales, hostname);

export const roleOfSales = (): string[] => {
  let result: string[] = [];

  if (roleUids) {
    const uids = roleUids.split(' ');

    result = uids;
  }

  return result;
};