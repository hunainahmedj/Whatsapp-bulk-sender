import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import DashboardScreen from './src/screens/Dashboard';
import MessageScreen from './src/screens/MessageScreen';
import SplashScreen from './src/screens/SplashScreen';

const navigator = createSwitchNavigator({
  Main: {screen: SplashScreen},
  mainFlow: createStackNavigator(
    {
      Dashboard: DashboardScreen,
      Messages: MessageScreen,
    },
    {},
  ),
  authFlow: createStackNavigator(
    {
      Login: LoginScreen,
      SignUp: SignUpScreen,
    },
    {headerMode: 'none'},
  ),
});

const App = createAppContainer(navigator);

export default () => {
  return <App />;
};
