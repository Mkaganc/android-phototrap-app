import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Button } from 'react-native';
import axios from 'axios';

const Example = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [providerPhone, setProviderPhone] = useState('');

  const handleAddUser = async () => {
    if (!name || !email || !password || !telegramUsername || !clientPhone || !providerPhone) {
      return alert('You must fill all the fields.');
    }
    try {
      const response = await axios.post('http://your-webserver-domain:5000/register', {
        name: name,
        email: email,
        password: password,
        telegram_username: telegramUsername,
        client_phone: clientPhone,
        provider_phone: providerPhone
      });
      const user = response.data;
      console.log(user);
      if (user.message === 'User saved successfully!') {
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PhotoTrap Register Form</Text>
      <TextInput
        style={styles.input}
        placeholder="Name/Surname:"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email:"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password:"
        value={password}
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Telegram Username:"
        value={telegramUsername}
        onChangeText={text => setTelegramUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Client Phone Number: "
        value={clientPhone}
        onChangeText={text => setClientPhone(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Provider(PhotoTrap Machine) Phone:"
        value={providerPhone}
        onChangeText={text => setProviderPhone(text)}
      />
   <TouchableOpacity style={styles.button} onPress={handleAddUser}>
        <Text style={styles.Text}>Finally Register!</Text>
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
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center'
  },
  input: {
    height: 50,
    width: '75%',
    borderColor: '#EBEBEB',
    borderWidth: 2,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 18,
    textAlign: 'center'
  },
  
  button: {
    backgroundColor: '#5E659A',
    height: 50,
    width: '70%',
    borderColor: '#EBEBEB',
    borderWidth: 2,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 18,
   
  },
  Text: {
    color: '#fff',
    fontSize: 20,
    justifyContent:'center',
    textAlign:'center',
    paddingBottom:10,
    paddingTop:10,
    justifyContent:'center',
  },
});

  export default Example;