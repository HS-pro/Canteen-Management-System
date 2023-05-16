import { View, Text, StyleSheet, Image } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../images/logo.png'

const Splash = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('SelectLogin')
    }, 3000);
  }, []);
  const checkLogin = async () => {
    const email = await AsyncStorage.getItem('EMAIL');
    if (email !== null) {
      navigation.navigate('Home');

    } else {
      navigation.navigate('SelectLogin')
    }

  }

  return (
    <View style={styles.container}>
     <Image
     source = {logo}
     />
    </View>
  );
};

export default Splash;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    backgroundColor: 'transparent'
  },
});
