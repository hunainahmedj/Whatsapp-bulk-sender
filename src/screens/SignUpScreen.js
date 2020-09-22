import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Input, Item, Button, Text} from 'native-base';
import {register} from '../services/firebase';

const SignUpScreen = ({navigation}) => {
  
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = () => {
    if (email !== '' || contact !== '' || password !== '') {
      register(email, password, contact, response => {
        if (response.status === 200) {
          console.log(response.status);
          navigation.navigate('Login');
        } else {
          setError('Something went wrong please try again.');
        }
      });
    } else {
      setError('Please fill all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>WatsMesSender</Text>
      </View>

      <View style={styles.inputContainers}>
        <Item>
          <Input
            style={styles.inputStyle}
            placeholder="Email"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={value => setEmail(value)}
          />
        </Item>

        <Item>
          <Input
            style={styles.inputStyle}
            placeholder="Contact Number"
            autoCapitalize="none"
            autoCorrect={false}
            value={contact}
            onChangeText={value => setContact(value)}
          />
        </Item>

        <Item>
          <Input
            style={styles.inputStyle}
            placeholder="Password"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={true}
            value={password}
            onChangeText={value => setPassword(value)}
          />
        </Item>

        {error !== '' ? <Text style={{color: 'red'}}>{error}</Text> : null}
      </View>

      <View style={styles.btnContainer}>
        <Button block success style={styles.button} onPress={() => onSubmit()}>
          <Text>Register</Text>
        </Button>

        <Button
          block
          success
          style={styles.button}
          onPress={() => navigation.navigate('Login')}>
          <Text>Login</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flex: 0.2,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
  },
  inputContainers: {
    flex: 0.5,
    justifyContent: 'space-around',
  },
  inputStyle: {
    paddingVertical: 2,
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
export default SignUpScreen;
