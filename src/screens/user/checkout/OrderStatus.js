import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
const OrderStatus = ({ navigation }) => {
  const route = useRoute();
  useEffect(() => {
    if (route.params.status == 'success') {
      placeOrder();
    }
  })
  const placeOrder = () => {
    let tempOrders = []
    tempOrders.push({ 
      items: route.params.cartList,
      orderBy: route.params.userName,
      userEmail:route.params.userEmail
    });
    firestore().collection('users').doc(route.params.userId).update({
      cart: [],
      orders: tempOrders,
    })
  }

  return (
    <View style={styles.container}>
      <Image
        source={
          route.params.status == 'success'
            ? require('../../../images/success.gif')
            : require('../../../images/failed.gif')
        }
        style={styles.icon}
      />
      <Text style={styles.msg}>
        {route.params.status == 'success' ? 'Order Placed Successfully' : "Order Failed"}
      </Text>
      <TouchableOpacity style={styles.backToHome}
        onPress={() => {
          navigation.navigate('Home')
        }}
      >
        <Text>Return To Home</Text>
      </TouchableOpacity>


    </View>
  );
};

export default OrderStatus;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '50%',
    height: '40%',
    alignSelf: 'center',
  },
  msg: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginTop: -50,
  },
  backToHome: {
    width: '50%',
    height: 50,
    borderWidth: 0.5,
    marginTop: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
