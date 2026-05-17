import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyB-mwImtpyEocSC7PLA6e1IDcCK2RfAadg",
  authDomain: "talambralu-matrimony-e15c2.firebaseapp.com",
  projectId: "talambralu-matrimony-e15c2",
  storageBucket: "talambralu-matrimony-e15c2.firebasestorage.app",
  messagingSenderId: "873566729503",
  appId: "1:873566729503:web:0400ded59191c17bd0ec2a"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
