import { Button, StyleSheet, Text, View,Platform ,Image,Alert, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';

export default function LoginScreen({navigation}) {

  const [email,setEmail] = useState('test');
  const [password,setPassword] = useState('123');

  const postData = async(email,password) => {
    try {
      let res = await fetch('https://ezmed.herokuapp.com/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email:email,
          password:password
        }),
      });
      res = await res.json();
      console.log(res)
      if(res.Medicines){
        navigation.navigate('Home',{data:res.Medicines,email: email})
      }
    } catch (e) {
      console.error(e);
    }
  }
  const handleLogin = () => {
    if(email && password){
      postData(email,password)
    }
    else{
      Alert.alert("Please enter email")
    }
  }
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
        />
        <Button title='Login' onPress={handleLogin} />
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });
  