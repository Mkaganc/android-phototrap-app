import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Login from './Login';
import Register from './Register';


const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#5E659A',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    width: '80%',
  },
  signupButton: {
    backgroundColor: '#5EAAAD',
    padding: 18,
    borderRadius: 10,
    width: '75%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 21,
  },
};


const HomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>PhotoTrap APP v1.0</Text>
    <TouchableOpacity
      style={styles.loginButton}
      onPress={() => navigation.navigate('Login')}
    >
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.signupButton}
      onPress={() => navigation.navigate('Register')}
    >
      <Text style={styles.buttonText}>Register</Text>
    </TouchableOpacity>
  </View>
);

export default HomeScreen;
