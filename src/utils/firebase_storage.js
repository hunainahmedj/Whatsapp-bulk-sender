import storage from '@react-native-firebase/storage';

export const FireBaseStorage = storage();

export const uploadFileToFireBase = response => {
  try {
    // const {name, uri} = response;
    const {name, data} = response;
    const storageRef = FireBaseStorage.ref(name);
    // return storageRef.putFile(uri);
    return storageRef.putString(data, 'base64');
  } catch (err) {
    console.log(err);
  }
};
