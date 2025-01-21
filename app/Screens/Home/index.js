import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Home = ({navigation}) => {
  return (
    <View style={styles.root}>
      <Text>Home Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
