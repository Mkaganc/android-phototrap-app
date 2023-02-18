import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';


const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
      try {
        const response = await axios.post('http://your-server-ip:5000/login', {
          email: email,
          password: password,
   
        });
        const user = response.data;
        console.log(user);
        
        if (user.message === 'User Identified!') {
          navigation.navigate('Anasayfa');
        }
        else if (user.message === 'Email or Password Incorrect!'){
          alert(user.message);}
      } catch (error) {
        console.error(error);
      }
    };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Title!</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link}
          onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.linkText}>Register!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#5E659A'
  },
  input: {
    height: 50,
    width: '80%',
    borderColor: '#EBEBEB',
    borderWidth: 2,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 18,
  },
  button: {
    backgroundColor: '#5E659A',
    paddingVertical: 15,
    width: '75%',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: '#5E659A',
    fontWeight: 'bold',
    fontSize: 18,
  },
});


export default LoginPage;
