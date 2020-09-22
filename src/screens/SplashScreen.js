import React, {useEffect} from 'react';
import {StyleSheet, Image} from 'react-native';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Login');
    }, 2000);
  });

  return (
    <Image style={styles.image} source={require('../assets/images/logo.jpg')} />
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: null,
    height: null,
  },
});

export default SplashScreen;
