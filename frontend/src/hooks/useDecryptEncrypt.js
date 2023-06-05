import CryptoJS from 'crypto-js';

export const useEncryptData = (text) => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(text),
      process.env.REACT_APP_SECRET_PASS_FOR_SESSION
    ).toString();
    return encryptedData;
  } catch (error) {
    console.log('somthing went wrong :', error);
    return error;
  }
};

export const useDecryptData = (text) => {
  try {
    const bytes = CryptoJS.AES.decrypt(text, process.env.REACT_APP_SECRET_PASS_FOR_SESSION);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return {
      token: decryptedData,
      isSuccess: true,
    };
    // use the decrypted and parsed data here
  } catch (error) {
    if (error.message === 'expected end of JSON input') {
      console.log('The decrypted data is not valid JSON');
    } else {
      console.log('An error occurred during decryption and parsing:', error.message);
    }
    return {
      token: '',
      isSuccess: false,
    };
  }
};
