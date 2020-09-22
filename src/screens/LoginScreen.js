import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {Container, Input, Item, Button, Text} from 'native-base';

import Logo from '../assets/images/logo_trans.png';
import {login} from '../services/firebase';

const LoginScreen = ({navigation}) => {
  useEffect(() => {});

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = () => {
    if (email === '' || password === '') {
      setError('Please fill all the fields.');
      return;
    }
    login(email, password, response => {
      const {checks, user} = response;
      if (checks === 2) {
        navigation.navigate('Dashboard', {user});
      } else if (checks === 1) {
        setError('Wrong password.');
      } else if (checks === 0) {
        setError('No account found with the given email.');
      }
    });
  };

  return (
    <Container style={styles.container}>
      <View style={styles.header}>
        <Image style={styles.headerLogo} source={Logo} resizeMode="cover" />
      </View>

      <View style={styles.form}>
        <Item>
          <Input
            value={email}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={value => setEmail(value)}
            placeholder="Email"
          />
        </Item>
        <Item>
          <Input
            value={password}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={value => setPassword(value)}
            placeholder="Password"
          />
        </Item>

        {error !== '' ? <Text style={{color: 'red'}}>{error}</Text> : null}
      </View>

      <View style={styles.btnContainer}>
        <Button block style={styles.button} onPress={() => onSubmit()}>
          <Text>Login</Text>
        </Button>
        <Button
          block
          style={styles.button}
          onPress={() => navigation.navigate('SignUp')}>
          <Text>Register</Text>
        </Button>
      </View>
    </Container>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
  header: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  headerLogo: {
    width: 200,
    height: 200,
  },
  headerText: {
    fontSize: 32,
  },
  form: {
    flex: 0.4,
    justifyContent: 'space-evenly',
  },
  btnContainer: {
    flex: 0.3,
    marginVertical: 10,
  },
  button: {
    marginVertical: 2,
    backgroundColor: '#3DA677',
  },
});
