import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Image, ImageBackground} from 'react-native';

export default function Splash({navigation}) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Signup');
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/logo2.png')}
        style={styles.logo1}>
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <Image
            source={require('../../assets/logo1.png')}
            style={styles.logo2}
          />
        </View>
      </ImageBackground>
      <Text style={styles.text}>TRADESMEN</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo1: {width: 200, height: 200},
  logo2: {width: 100, height: 100, marginTop: 50},
  text: {fontSize: 24, fontWeight: 'bold', color: '#333'},
});
