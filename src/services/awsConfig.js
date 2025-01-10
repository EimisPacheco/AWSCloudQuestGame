import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
  },
  API: {
    endpoints: [{
      name: 'gameApi',
      endpoint: process.env.REACT_APP_API_ENDPOINT,
      region: process.env.REACT_APP_AWS_REGION
    }]
  },
  DynamoDB: {
    region: process.env.REACT_APP_AWS_REGION
  }
}); 