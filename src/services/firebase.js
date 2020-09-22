import axios from 'axios';
import {FIREBASEURL} from '../utils/misc';

export const register = (email, password, contact, cb) => {
  axios({
    method: 'POST',
    url: `${FIREBASEURL}/users.json`,
    data: {
      email: email,
      password: password,
      contact: contact,
      limit: 15,
      availed: 0,
    },
  })
    .then(response => {
      cb(response);
    })
    .catch(e => {
      return e;
    });
};

export const updateLimit = (userID, updateAmount) => {
  axios({
    method: 'PATCH',
    url: `${FIREBASEURL}/users/${userID}/.json`,
    data: {
      availed: updateAmount,
    },
  })
    .then(response => {
      // console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
};

export const purchaseLimit = async (userID, userLimit, updateAmount) => {
  return axios({
    method: 'PATCH',
    url: `${FIREBASEURL}/users/${userID}/.json`,
    data: {
      limit: userLimit + updateAmount,
    },
  })
    .then(response => {
      return response.status;
    })
    .catch(error => {
      console.log(error);
    });
};

export const login = (email, password, cb) => {
  axios({
    method: 'GET',
    url: `${FIREBASEURL}/users.json`,
  })
    .then(response => {
      const users = [];
      for (let key in response.data) {
        users.push({
          ...response.data[key],
          id: key,
        });
      }

      const loginData = checkUser(email, password, users);
      // console.log(user);
      // let checks = checkUser(email, password, users);

      cb(loginData);
    })
    .catch(e => {
      return e;
    });
};

const checkUser = (email, password, users) => {
  let checks = 0;
  let user = null;
  for (let key in users) {
    if (email === users[key].email) {
      checks += 1;
      if (password === users[key].password.toString()) {
        checks += 1;
        user = users[key];
      }
    }
  }
  console.log(checks);
  return {checks: checks, user: user};
};

const uriToBlob = uri => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      // return the blob
      resolve(xhr.response);
    };

    xhr.onerror = function() {
      // something went wrong
      reject(new Error('uriToBlob failed'));
    };
    // this helps us get a blob
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);

    xhr.send(null);
  });
};

const uploadToFirebase = blob => {
  return new Promise((resolve, reject) => {
    var storageRef = app.storage().ref();
    storageRef
      .child('uploads/photo.jpg')
      .put(blob, {
        contentType: 'image/jpeg',
      })
      .then(snapshot => {
        blob.close();
        resolve(snapshot);
      })
      .catch(error => {
        reject(error);
      });
  });
};
