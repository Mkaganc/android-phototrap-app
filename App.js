// In App.js in a new project

import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './screens/HomePage';
import Login from './screens/Login';
import Register from './screens/Register';

import Anasayfa from './screens/Anasayfa';

const Stack = createNativeStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen name="Home"
        options={{title: 'Anasayfa'}}
        component={HomePage} />
     
  <Stack.Screen name="Login"
  options={{title: 'Login'}}
  component={Login} />

<Stack.Screen name="Register"
  options={{title: 'Kayıt Ol!'}}
  component={Register} /> 
 
  <Stack.Screen name="Anasayfa"
  options={{title: 'Yönetim Paneli'}}
  component={Anasayfa} /> 

</Stack.Navigator>
</NavigationContainer>
  );
}

export default App;