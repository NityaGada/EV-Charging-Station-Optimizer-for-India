import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, ImageBackground } from 'react-native';
// import axios from '../axios'; // Import your Axios instance
import axios from 'axios';
import "./signup.css";
import { useNavigation } from '@react-navigation/native';

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigatior = useNavigation();

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://192.168.160.228:5000/signup', { username, email, password });
      console.log('Signup successful');
      navigatior.navigate('Login');
      // Handle navigation to other screens
    } catch (error) {
      console.error('Error signing up:', error.message);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <ImageBackground source={require('../login/a.png')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Join Us" onPress={handleSignup} style={styles.button} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 40,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    padding: 10,
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: 5,
  },
});

export default Signup;
