import paypal from 'paypal-rest-sdk';

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID ? process.env.PAYPAL_CLIENT_ID : "",
    'client_secret': process.env.PAYPAL_CLIENT_SECRET ? process.env.PAYPAL_CLIENT_SECRET : ""
  });