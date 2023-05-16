import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../common/Header';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
import RazorpayCheckout from 'react-native-razorpay';
let userId = '';
const Checkout = ({ navigation }) => {
  const [cartList, setCartList] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    getCartItems();
  }, [isFocused]);
  const getCartItems = async () => {
    userId = await AsyncStorage.getItem('USERID');
    const user = await firestore().collection('users').doc(userId).get();
    setCartList(user._data.cart);
  };

  const getTotal = () => {
    let total = 0;
    cartList.map(item => {
      total = total + item.data.qty * item.data.discountPrice;
    });
    return total;
  };
  const payNow = async () => {
    const email = await AsyncStorage.getItem('EMAIL');
    const name = await AsyncStorage.getItem('NAME');
    const mobile = await AsyncStorage.getItem('MOBILE');
    var options = {
      description: 'Payment for Order',
      image: '',
      currency: 'INR',
      key: 'rzp_test_KfHLctpXhIHm7n',
      amount: '5000' * 100,
      name: 'CAMS',
      order_id: '', //Replace this with an order_id created using Orders API.
      prefill: {
        email: email,
        contact: mobile,
        name: name,
      },
      theme: { color: '#004AAD' },
    };
    RazorpayCheckout.open(options)
      .then(data => {
        // handle success

        navigation.navigate('OrderStatus', {
          status: 'success',
          paymentId: data.razorpay_payment_id,
          cartList: cartList,
          total: getTotal(),
          userId: userId,
          userName: name,
          userEmail: email,
          userMobile: mobile,
        });
      })
      .catch(error => {
        // handle failure

        navigation.navigate('OrderStatus', {
          status: 'failed',
        });
      });
  };
  return (
    <View style={styles.container}>
      <View>
        <FlatList
          data={cartList}
          renderItem={({ item, index }) => {
            return (
              <View style={styles.itemView}>
                <Image
                  source={{ uri: item.data.imageUrl }}
                  style={styles.itemImage}
                />
                <View style={styles.nameView}>
                  <Text style={styles.nameText}>{item.data.name}</Text>
                  <Text style={styles.descText}>{item.data.description}</Text>
                  <View style={styles.priceView}>
                    <Text style={styles.priceText}>
                      {'Rs ' + item.data.discountPrice}
                    </Text>
                    <Text style={styles.discountText}>
                      {'Rs ' + item.data.price}
                    </Text>
                  </View>
                </View>
                <Text style={styles.nameText}>{'Qty : ' + item.data.qty}</Text>
              </View>
            );
          }}
        />
      </View>
      <View style={styles.totalView}>
        <Text style={styles.nameText}>Total</Text>
        <Text style={styles.nameText}>{'Rs ' + getTotal()}</Text>
      </View>
      <TouchableOpacity style={styles.checkoutBtn}
    onPress={()=>{
     payNow()
    }}
      
      
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '500' }}>
          Pay Now {'Rs ' + getTotal()}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Checkout;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemView: {
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    marginTop: 10,
    borderRadius: 10,
    height: 100,
    marginBottom: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    margin: 5,
  },
  nameView: {
    width: '35%',
    margin: 10,
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
  },
  descText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priceText: {
    fontSize: 18,
    color: '#FF3131',
    fontWeight: '700',
  },
  discountText: {
    fontSize: 17,
    fontWeight: '600',
    textDecorationLine: 'line-through',
    marginLeft: 5,
  },
  totalView: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 20,
    height: 50,
    borderTopWidth: 0.3,
    paddingRight: 20,
    marginTop: 20,
    alignItems: 'center',
    borderTopColor: '#8e8e8e',
  },
  editAddress: {
    color: '#2F62D1',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  checkoutBtn: {
    width: '90%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#004AAD',
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
