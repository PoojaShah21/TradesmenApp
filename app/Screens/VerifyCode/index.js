import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  TextInput,
} from 'react-native';
import {getApiDataProgress} from '../../utils/apiHelper';
import Toast from 'react-native-toast-message';
import BaseSetting from '../../config/setting';
import {useDispatch} from 'react-redux';
import actions from '../../redux/auth/actions';

const VerifyCode = ({navigation, route}) => {
  const sendEmail = route?.params?.data;
  const screen = route?.params?.screen;
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationState, setVerificationState] = useState('input'); // 'input', 'success', 'error'
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const [timer, setTimer] = useState(151);
  const dispatch = useDispatch();
  const {setUserData, setAccessToken} = actions;

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = seconds => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  };

  const inputRefs = useRef([]);
  const handleChangeText = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (text.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  const shakeError = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleVerifyCode = async () => {
    setIsLoading(true);
    const fullCode = code.join('');
    console.log('fullCode', fullCode);
    try {
      const response = await getApiDataProgress(
        BaseSetting.endpoints.sendOtp,
        'post',
        {
          email: sendEmail,
          code: fullCode,
        },
      );

      console.log('response==========', response);
      if (response.success) {
        if (screen === 'forgot') {
          navigation.navigate('ResetPassword', {
            data: sendEmail,
            code: fullCode,
          });
        } else {
          setVerificationState('success');
          dispatch(setUserData(response?.data));
          dispatch(setAccessToken(response?.data?.token));
        }
      } else {
        if (_.isEmpty(response?.data)) {
          setVerificationState('error');
        } else {
          setVerificationState('incorrect');
        }
        shakeError();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Verification failed',
        text2: 'Please try again',
      });
      setVerificationState('error');
      shakeError();
    }
  };

  const resendCode = async () => {
    try {
      const data = email;
      await getApiDataProgress(BaseSetting.endpoints.resendCode, 'post', {
        data,
      });
      Toast.show({
        type: 'success',
        text1: 'Code resent successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failed to resend code',
      });
    }
  };

  const renderContent = () => {
    switch (verificationState) {
      case 'success':
        return (
          <>
            <View style={styles.stateContainer}>
              <Image
                source={require('../../assets/sucess.png')}
                style={styles.stateImage}
              />
            </View>

            <Text style={styles.stateTitle}>OTP is verified...</Text>
            <Text style={styles.stateMessage}>
              Happy to say everything went smoothly. Start with Tradesmen for
              great experience...
            </Text>
            <TouchableOpacity onPress={() => navigation.replace('Home')}>
              <Text style={styles.loginLink}>Continue to App</Text>
            </TouchableOpacity>
          </>
        );
      case 'incorrect':
        return (
          <>
            <View style={styles.stateContainer}>
              <Image
                source={require('../../assets/incorrect.png')}
                style={styles.stateImage}
              />
            </View>

            <Text style={styles.stateTitle}>OTP is incorrect</Text>
            <Text style={styles.stateMessage}>
              Please enter valid data, code is incorrect.
            </Text>
            <TouchableOpacity onPress={() => setVerificationState('input')}>
              <Text style={styles.loginLink}>Try Again</Text>
            </TouchableOpacity>
          </>
        );
      case 'error':
        return (
          <>
            <View style={styles.stateContainer}>
              <Image
                source={require('../../assets/error.png')}
                style={styles.stateImage}
              />
            </View>

            <Text style={styles.stateTitle}>Something went wrong!</Text>
            <Text style={styles.stateMessage}>
              Taking too much time, Please check your internet connection.
            </Text>
            <TouchableOpacity onPress={() => setVerificationState('input')}>
              <Text style={styles.loginLink}>Try Again</Text>
            </TouchableOpacity>
          </>
        );
      default:
        return (
          <>
            <View style={styles.headerContainer}>
              <Image
                source={require('../../assets/code.png')}
                style={styles.headerImage}
              />
            </View>
            <Text style={styles.title}>Verify Code</Text>
            <Text style={styles.subtitle}>
              Check your Email inbox we have sent you the code
            </Text>

            <View style={styles.codeContainer}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.codeInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={text => handleChangeText(text, index)}
                  ref={ref => (inputRefs.current[index] = ref)}
                  onKeyPress={({nativeEvent}) => {
                    if (
                      nativeEvent.key === 'Backspace' &&
                      code[index] === '' &&
                      index > 0
                    ) {
                      inputRefs.current[index - 1].focus();
                    }
                  }}
                />
              ))}
            </View>
            <Text style={styles.timerText}>{formatTime(timer)}</Text>
            <Text style={styles.receiveText}>Did not received the code?</Text>

            {timer === 0 && (
              <TouchableOpacity
                style={styles.resendButton}
                onPress={() => {
                  resendCode();
                }}
                disabled={isLoading}>
                <Text style={styles.resendText}>Resend Code</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                handleVerifyCode();
              }}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </>
        );
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  codeInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#E2E9FF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#454545',
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  headerImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },

  timerText: {
    fontSize: 16,
    fontWeight: 400,
    color: '#343434',
  },
  codeBox: {
    width: 50,
    backgroundColor: '#E2E9FF',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  keypadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  keypadButton: {
    width: '30%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  keypadText: {
    fontSize: 24,
    color: '#314FA4',
  },
  resendButton: {
    marginTop: 10,
  },
  resendText: {
    color: '#314FA4',
    fontSize: 16,
    fontWeight: 700,
    textDecorationLine: 'underline',
  },
  receiveText: {
    color: '#454545',
    fontSize: 16,
    fontWeight: 400,
    marginTop: 10,
  },
  stateContainer: {
    alignItems: 'center',
  },
  stateImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  stateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#314FA4',
    textDecorationLine: 'underline',
  },
  stateMessage: {
    fontSize: 16,
    color: '#343434',
    marginBottom: 20,
    fontWeight: 400,
  },
  tryAgainButton: {
    backgroundColor: '#314FA4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  tryAgainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#314FA4',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VerifyCode;
