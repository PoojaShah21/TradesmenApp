import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BaseSetting from '../../config/setting';
import {getApiDataProgress} from '../../utils/apiHelper';

const ResetPassword = ({navigation}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    const passwordMinLength = 8;

    if (newPassword.length < passwordMinLength) {
      setErrorMessage(
        `Password must be at least ${passwordMinLength} characters long.`,
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(newPassword)) {
      setErrorMessage(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
      );
      return;
    }

    setErrorMessage('');
    console.log('Password reset successful!');
    handleResetPassword();
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);

      const data = {
        email: '',
        code: '',
        password: confirmPassword,
      };

      const response = await getApiDataProgress(
        BaseSetting.endpoints.resetPassword,
        'post',
        data,
      );

      if (response.success) {
        console.log('response---', response);
        Toast.show({
          type: 'success',
          text1: response?.message,
        });
        ResetSuccess();
      } else {
        throw new Error(response?.message);
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Ionicons name="arrow-back" size={20} color="black" />
      </TouchableOpacity>
      <View style={{alignItems: 'center'}}>
        <Image source={require('../../assets/code.png')} style={styles.image} />
      </View>
      <Text style={styles.title}>Reset Password?</Text>
      <Text style={styles.subtitle}>
        Your new password must be different from previous used password, contain
        at least 8 letters.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        placeholderTextColor="#999"
      />

      <TextInput
        style={[styles.input, errorMessage ? styles.inputError : null]}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleConfirm();
        }}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Confirm</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const ResetSuccess = () => {
  return (
    <View style={styles.container2}>
      <Image source={require('../../assets/sucess.png')} style={styles.image} />
      <Text style={styles.title}>Password is set</Text>
      <Text style={styles.subtitle}>
        Reset password is done, login with new password to continue using app.
      </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Continue to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  container2: {
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#343434',
    marginBottom: 20,
    fontWeight: 400,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingVertical: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#314FA4',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#314FA4',
    textDecorationLine: 'underline',
  },
});

export default ResetPassword;
