import api from '../utils/api';

export const sendTwilioMedia = (numbers, message, fileURL) => {
  // const numbers = ['whatsapp:+923122306373', 'whatsapp:+923218770492'];
  return api
    .post(
      '/api/services/twilio',
      {
        numbers: numbers,
        message: message,
        media: fileURL,
      },
      {headers: {'Retry-After': '3600'}},
    )
    .then(res => {
      return res.status;
    })
    .catch(err => console.log(err));
};

export const sendTwilio = (numbers, message) => {
  // const numbers = ['whatsapp:+923122306373', 'whatsapp:+923218770492'];
  return api
    .post(
      '/api/services/twilio',
      {
        numbers: numbers,
        message: message,
      },
      {headers: {'Retry-After': '3600'}},
    )
    .then(res => {
      return res.status;
    })
    .catch(err => console.log(err));
};
