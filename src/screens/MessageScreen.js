import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ActivityIndicator, ToastAndroid} from 'react-native';
import {
  Container,
  Picker,
  Textarea,
  Item,
  Label,
  Button,
  Text,
  Icon,
} from 'native-base';
import DocumentPicker from 'react-native-document-picker';

import styling from '../assets/styles/styling';
import {convertContacts} from '../utils/helpers';
import {sendTwilio, sendTwilioMedia} from '../services/Twilio';
import {FireBaseStorage, uploadFileToFireBase} from '../utils/firebase_storage';
import {
  sendWessenger,
  uploadFileWessenger,
  sendWessengerWithFile,
} from '../services/Wessenger';
import {updateLimit} from '../services/firebase';

const MessageScreen = ({navigation}) => {
  useEffect(() => {
    setUser(navigation.state.params.user);
    console.log('Update');
  }, [navigation]);

  const [user, setUser] = useState();
  const [document, setDocument] = useState();
  const [mediaURL, setMediaURL] = useState('');
  const [contacts, setContacts] = useState([]);
  const [contactFileName, setContactFileName] = useState('');
  const [body, setBody] = useState('');
  const [service, setService] = useState('Wessanger');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateMsgLimit = () => {
    const _user = user;
    const updateAmount = _user.availed + contacts.length;

    updateLimit(user.id, updateAmount);
    _user.availed = updateAmount;
    setUser(_user);

    if (parseInt(_user.limit) <= user.availed.toString()) {
      setError('You ran out of limit. Please buy more Messages.');
      setLoading(true);
      return;
    }
  };

  const documentPick = async () => {
    try {
      const resource = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      setDocument(resource);
      var RNFS = require('react-native-fs');
      let file = {};
      RNFS.readFile(resource.uri, 'base64').then(res => {
        file.data = res;
        file.name = resource.name;
        setLoading(true);
        uploadFileToFireBase(file)
          .then(() => {
            let storageRef = FireBaseStorage.ref();
            storageRef
              .child(resource.name)
              .getDownloadURL()
              .then(url => {
                setLoading(false);
                setMediaURL(url);
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  const getContacts = async () => {
    try {
      const csv = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      if (csv.type === 'text/csv') {
        setContactFileName(csv.name);
        let RNFS = require('react-native-fs');
        RNFS.readFile(csv.uri).then(async data => {
          const numbers = await convertContacts(data);
          setContacts(numbers);
          const user = navigation.state.params.user;
          const allowedMessages = user.limit - user.availed;
          if (numbers.length > allowedMessages) {
            setError(
              `You can only send ${allowedMessages} message(s) due to your message limit select a file with ${allowedMessages} contacts.`,
            );
            setLoading(true);
            // navigation.navigate('Login', {
            //   limitError: `You can only send ${allowedMessages} message(s) due to your message limit select a file with ${allowedMessages} contacts.`,
            // });
          }
        });
      } else {
        console.log(csv.type);
        setError('Please select a comma seperated CSV file for contacts.');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  };

  const sendMessage = async () => {
    const allowedMessages = user.limit - user.availed;
    if (contacts.length > allowedMessages) {
      setError(
        `You can only send ${allowedMessages} message(s) due to your message limit select a file with ${allowedMessages} contacts or buy more messages.`,
      );
      setLoading(true);
      return;
    } else {
      if (body === '') {
        setError('Please fill message body');
        return;
      } else if (contacts.length <= 0) {
        setError('Please upload contacts');
        return;
      }

      switch (service) {
        case 'Twilio':
          if (mediaURL !== '') {
            const status = await sendTwilioMedia(contacts, body, mediaURL);
            if (status === 200) {
              setError('');
              ToastAndroid.show(
                'Your message(s) will be sent.',
                ToastAndroid.SHORT,
              );
              updateMsgLimit();
            } else {
              setError(
                'Message(s) not sent please check your contacts or internet connectivity.',
              );
            }
          } else {
            const status = await sendTwilio(contacts, body);
            if (status === 200) {
              setError('');
              ToastAndroid.show(
                'Your message(s) will be sent.',
                ToastAndroid.SHORT,
              );
              updateMsgLimit();
            } else {
              setError(
                'Message(s) not sent please check your contacts or internet connectivity.',
              );
            }
          }
          break;
        default:
          if (mediaURL !== '') {
            const file = await uploadFileWessenger(mediaURL);
            const status = await sendWessenger(contacts, body);
            // const status = await sendWessengerWithFile(contacts, body, file);
            if (status === 201) {
              setError('');
              ToastAndroid.show(
                'Your message(s) will be sent.',
                ToastAndroid.SHORT,
              );
              updateMsgLimit();
            } else {
              setError(
                'Message(s) not sent please check your contacts or internet connectivity.',
              );
            }
          } else {
            const status = await sendWessenger(contacts, body);
            if (status === 201) {
              setError('');
              ToastAndroid.show(
                'Your message(s) will be sent.',
                ToastAndroid.SHORT,
              );
              updateMsgLimit();
            } else {
              setError(
                'Message(s) not sent please check your contacts or internet connectivity.',
              );
            }
          }
          break;
      }
    }
  };

  return (
    <Container style={styling.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Send Bulk Messages</Text>
      </View> */}
      <View style={styles.form}>
        <Textarea
          value={body}
          rowSpan={3}
          bordered
          placeholder="Message Body"
          onChangeText={value => setBody(value)}
        />
        {error !== '' ? <Text style={{color: 'red'}}>{error}</Text> : null}

        {document ? (
          <Text style={{fontSize: 12}}>Attached File: {document.name}</Text>
        ) : null}
        <Button
          iconLeft
          rounded
          success
          style={styles.button}
          onPress={documentPick}>
          <Icon type="FontAwesome" name="paperclip" />
          <Text>Attach File</Text>
        </Button>

        {contactFileName !== '' ? (
          <Text style={{fontSize: 12}}>
            Contacts Selected: {contactFileName}
          </Text>
        ) : null}

        <Button
          iconLeft
          rounded
          success
          style={styles.button}
          onPress={getContacts}>
          <Icon type="FontAwesome" name="users" />
          <Text>Upload Contacts</Text>
        </Button>

        <Item>
          <Label>Selected Service</Label>
          <Picker
            selectedValue={service}
            mode="dropdown"
            onValueChange={value => setService(value)}>
            <Picker.Item value="Twilio" label="Twilio" />
            <Picker.Item value="Wessanger" label="Wessanger" />
          </Picker>
        </Item>
      </View>

      <View style={styles.buttons}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Button block success style={styles.button} onPress={sendMessage}>
            <Text>Send</Text>
          </Button>
        )}
      </View>
    </Container>
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    backgroundColor: '#fff',
  },
  header: {
    flex: 0.1,
    justifyContent: 'center',
  },
  headerLogo: {
    width: 550,
    height: 550,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3DA677',
  },
  form: {
    flex: 0.8,
    justifyContent: 'space-evenly',
  },
  buttons: {
    flex: 0.2,
    justifyContent: 'space-around',
  },
  button: {
    marginVertical: 2,
    backgroundColor: '#3DA677',
  },
});
