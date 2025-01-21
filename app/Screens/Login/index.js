import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  ActivityIndicator,
} from 'react-native';
import {getApiDataProgress} from '../../utils/apiHelper';
import Toast from 'react-native-toast-message';
import _ from 'lodash';
import BaseSetting from '../../config/setting';
import {useDispatch} from 'react-redux';
import actions from '../../redux/auth/actions';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const {setUserData, setAccessToken} = actions;

  const validateInputs = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    try {
      if (!validateInputs()) {
        Toast.show({
          type: 'error',
          text1: 'Please fix the errors before continuing',
        });
        return;
      }
      setLoading(true);

      const data = {
        email: email.trim().toLowerCase(),
        password: password,
      };

      const response = await getApiDataProgress(
        BaseSetting.endpoints.login,
        'post',
        data,
      );

      if (response.success) {
        setEmail('');
        setPassword('');
        dispatch(setUserData(response?.data));
        dispatch(setAccessToken(response?.data?.token));
        navigation.navigate('Home');
        Toast.show({
          type: 'success',
          text1: response?.message,
        });
      } else {
        throw new Error(response?.message || 'Registration failed');
      }
      setLoading(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.message,
      });
      setLoading(false);
    }
  };

  const renderError = field => {
    return errors[field] ? (
      <Text style={styles.errorText}>{errors[field]}</Text>
    ) : null;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.headerContainer}>
        <Image source={require('../../assets/logo1.png')} style={styles.logo} />
      </View>

      <Text style={styles.title}>Login</Text>

      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        value={email}
        onChangeText={text => {
          setEmail(text);
          setErrors(prev => ({...prev, email: null}));
        }}
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      {renderError('email')}

      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Password"
        value={password}
        onChangeText={text => {
          setPassword(text);
          setErrors(prev => ({...prev, password: null}));
        }}
        secureTextEntry
        placeholderTextColor="#999"
        editable={!loading}
      />
      {renderError('password')}

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ForgotPassword');
        }}>
        <Text style={styles.termsLink}>Forgot password</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={() => {
          handleLogin();
        }}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Don’t have an account? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
          disabled={loading}>
          <Text style={styles.loginLink}>Signup</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: '#FFF9E6',
    borderRadius: 100,
    padding: 20,
    width: 150,
    height: 150,
    alignSelf: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingVertical: 8,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#314FA4',
    marginRight: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: '#314FA4',
    fontSize: 14,
  },
  termsText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  termsLink: {
    color: '#314FA4',
    fontWeight: 'bold',
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#314FA4',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  otpText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  loginText: {
    fontSize: 16,
    color: '#000',
  },
  loginLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#314FA4',
  },
  inputError: {
    borderBottomColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -15,
    marginBottom: 10,
  },
  checkboxError: {
    borderColor: 'red',
  },
  buttonDisabled: {
    backgroundColor: '#314FA4',
    opacity: 0.7,
  },
});

export default Login;
