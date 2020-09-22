import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator, ToastAndroid} from 'react-native';
import {Container, Button, Text, Input, Item} from 'native-base';
import {purchaseLimit} from '../services/firebase';

const Dashboard = ({navigation}) => {
  useEffect(() => {
    setUser(navigation.state.params.user);
  }, [navigation]);
  const [user, setUser] = useState();
  const [purchase, setPurchase] = useState('100');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const buyMessages = async () => {
    if (purchase === '') {
      setError('Input an amount first.');
      return;
    }
    setLoading(true);
    const status = await purchaseLimit(user.id, user.limit, parseInt(purchase));
    if (status === 200) {
      const _user = user;
      user.limit = user.limit + parseInt(purchase);
      setUser(_user);
      setLoading(false);
      setError('');
      ToastAndroid.show('Transaction has been done.', ToastAndroid.SHORT);
    } else {
      setError('Something went wrong please try again.');
    }
  };

  return (
    <Container style={styles.container}>
      <View
        style={{
          backgroundColor: 'green',
          flex: 0.5,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text> Ad will be posted here </Text>
      </View>
      <View style={styles.header} />
      <View style={styles.main}>
        <View>
          <Text>
            Current Limit: {navigation.state.params.user.limit}, Availed:
            {navigation.state.params.user.availed}
          </Text>
          <Text> Buy More Messages: </Text>
          <Item>
            <Input
              value={purchase}
              autoCorrect={false}
              keyboardType="number-pad"
              onChangeText={value => setPurchase(value)}
              placeholder="Amount of messages to purchase"
            />
          </Item>
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button
            style={styles.button}
            block
            rounded
            onPress={() => {
              buyMessages();
            }}>
            <Text> Purchase </Text>
          </Button>
        )}
      </View>
      <View style={styles.footer}>
        {error !== '' ? <Text style={{color: 'red'}}> {error} </Text> : null}
        <Button
          style={styles.button}
          block
          rounded
          onPress={() => navigation.navigate('Messages', {user})}>
          <Text> Send Message </Text>
        </Button>
      </View>
    </Container>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 15},
  header: {
    flex: 0.2,
    justifyContent: 'space-evenly',
  },
  main: {
    flex: 0.6,
    justifyContent: 'space-evenly',
  },
  footer: {
    flex: 0.2,
    justifyContent: 'space-evenly',
  },
  button: {
    marginVertical: 2,
    backgroundColor: '#3DA677',
  },
});
