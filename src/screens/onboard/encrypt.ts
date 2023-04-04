import CryptoES from "crypto-es";

export const encrypt = async (data: string, password: string) => {
  return CryptoES.DES.encrypt(data, password).toString();
};

export const decrypt = async (data: string, password: string) => {
  return CryptoES.DES.decrypt(data, password).toString(CryptoES.enc.Utf8);
};
