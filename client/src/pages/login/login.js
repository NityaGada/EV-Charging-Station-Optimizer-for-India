import React, { useState } from 'react';
import { View, TextInput, Button, ImageBackground, StyleSheet } from 'react-native';
// import axios from '../axios'; // Import your Axios instance
import axios from 'axios';
import "./login.css";
import { useNavigation } from '@react-navigation/native';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigatior = useNavigation();

  const handleLogin = async () => {
    console.log('1');
    try {
      console.log('2');
      const response = await axios.post('http://192.168.0.109:5000/login', { username, password });
      console.log('3');
      console.log('Login successful');
      console.log(response.data.username);
      navigatior.navigate('Home', { data: response.data.username });
      // Handle navigation to other screens
    } catch (error) {
      console.error('Error logging in:', error.message);
      // Handle error (e.g., display error message)
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../login/a.png')} style={styles.background} resizeMode="cover">
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} style={styles.button} />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%', // Ensure the image takes up the entire width
    height: '100%', // Ensure the image takes up the entire height
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 40,
  },
  card: {
    width: '100%', // Make the card span the entire width
    backgroundColor: '#f5f5f5',
    marginBottom: -35,
    padding: 50,
    borderRadius: 45,
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
    marginBottom: 20,
    padding: 10,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff', // White input field background
  },
  button: {
    width: '100%',
    padding: 10,
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: 25,
    cursor: 'pointer',
  },
};

export default Login;
