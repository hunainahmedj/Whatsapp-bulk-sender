import axios from 'axios';

const API_TOKEN =
  '5b6354e4a77ca6c94ac8b3775c294852215d3512d5d35d68b383f4a12d47aa428adf4dd2343f39db';

export const uploadFileWessenger = mediaURL => {
  return axios
    .post(
      'https://api.wassenger.com/v1/files',
      {
        url: mediaURL,
      },
      {
        headers: {
          'content-type': 'application/json',
          token: API_TOKEN,
        },
      },
    )
    .then(res => {
      console.log(res.data[0]);
      let file = {};
      file.id = res.data[0].id;
      file.name = res.data[0].filename;
      return file;
    })
    .catch(err => console.log('Midia', err));
};

export const sendWessenger = async (numbers, message) => {
  const url = 'https://api.wassenger.com/v1/messages';
  const headers = {
    headers: {
      'content-type': 'application/json',
      token: API_TOKEN,
    },
  };

  let requests = [];
  numbers.map(number => {
    number = number.substring(9, number.lenght);
    console.log(number);
    const data = {
      phone: number,
      message: message,
    };
    requests.push(axios.post(url, data, headers));
  });

  return axios
    .all(requests)
    .then(res => {
      return res[0].status;
    })
    .catch(err => console.log('Text', err));
};

export const sendWessengerWithFile = async (numbers, message, file) => {
  const url = 'https://api.wassenger.com/v1/messages';
  const headers = {
    headers: {
      'content-type': 'application/json',
      token: API_TOKEN,
    },
  };
  let requests = [];
  numbers.map(number => {
    number = number.substring(9, number.lenght);
    const data = {
      phone: number,
      message: message,
      media: {
        file: file.id,
        filename: file.name,
      },
    };
    requests.push(axios.post(url, data, headers));
  });

  return axios
    .all(requests)
    .then(res => {
      return res[0].status;
    })
    .catch(err => console.log('Text', err));
};
