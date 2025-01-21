import {Dimensions, Platform} from 'react-native';
const devMode = __DEV__;

const IOS = Platform.OS === 'ios';

const baseUrl = 'http://3.7.81.243/projects/plie-api/public/api/'; // Client server/

const BaseSetting = {
  name: 'TRADESMEN',
  appVersionCode: '1',
  api: `${baseUrl}`,

  endpoints: {
    register: 'register',
    resendCode: 'resend-email-code',
    sendOtp: 'verify-email',
    login: 'login',
    forgotPassword: 'forgot-password',
    resetPassword: 'reset-password',
  },
  ios: IOS,
};

export default BaseSetting;
