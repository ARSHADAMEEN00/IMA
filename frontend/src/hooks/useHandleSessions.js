import { TOKEN_PREFIX } from '../server/api/http';
import { useDecryptData, useEncryptData } from './useDecryptEncrypt';

export const useSetToken = (token) => {
  const encryptedToken = useEncryptData(token?.split(`_${TOKEN_PREFIX}_`)[0]);

  sessionStorage.setItem(TOKEN_PREFIX, encryptedToken);

  // mock
  // sessionStorage.setItem(`${TOKEN_PREFIX}-t-n`, encryptedToken?.slice(0, 100));
  // sessionStorage.setItem(`${TOKEN_PREFIX}-vk-t`, encryptedToken?.slice(0, 150));
  // sessionStorage.setItem(`${TOKEN_PREFIX}-vk-au-token`, encryptedToken?.slice(0, 200));
};

export const useGetToken = (key) => {
  const encryptedToken = sessionStorage.getItem(key);
  const decryptData = useDecryptData(encryptedToken);
  return decryptData;
};

export const useSetRoles = (roles) => {
  const roleToString = roles?.join(',').toString();

  const encryptedRoles = useEncryptData(roleToString);

  sessionStorage.setItem('roles', encryptedRoles);
};

export const useSetRole = (role) => {
  const currentRole = role;

  const encryptedRole = useEncryptData(currentRole);

  sessionStorage.setItem('currentRole', encryptedRole);
};

export const useGetRoles = () => {
  const encryptedRoles = sessionStorage.getItem('roles');
  const encryptedRole = sessionStorage.getItem('currentRole');

  const { isSuccess: successRoles, token: roles } = useDecryptData(encryptedRoles);
  const { isSuccess: successRole, token: role } = useDecryptData(encryptedRole);

  const roleArray = roles?.split(',');

  return {
    roles: roleArray,
    successRoles,
    successRole,
    role,
  };
};
