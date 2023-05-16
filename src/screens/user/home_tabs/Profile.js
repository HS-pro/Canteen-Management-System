import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../common/Header';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
let userId = '';
let name = '';
let email = '';
let mobile = '';
const Profile = () => {

  const [profile, setProfile] = useState([]);
  useEffect(() => {
    getProfile();
  }, []);
  
  const getProfile = async () => {
    const userId = await AsyncStorage.getItem('USERID');
    console.log(userId)
    const user = await firestore().collection('users').doc(userId).get();
    console.log(JSON.stringify(user._data));
    setProfile(user._data);
  };

  return (
    <View style={styles.container}>
      <Header title={'Profile'} />
      <FlatList
        data={profile}
        keyExtractor={({item, index}) => index}
        renderItem={({item, index}) => {
          return (
            <View style={styles.infoContainer}>
              
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 20
  },
  infoContainer: {
    marginTop: 20,
    marginLeft: 20
  },
  infoLabel: {
    fontWeight: 'bold',
    marginLeft: 20
  },
  infoValue: {
    marginTop: 5,
    marginLeft: 20
  },
});

export default Profile;