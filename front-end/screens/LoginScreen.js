import { Button, StyleSheet, Text, View,Platform ,Image,Alert, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';

export default function LoginScreen({navigation}) {

  const [email,setEmail] = useState('');

  const postData = async(email) => {
    try {
      let res = await fetch('https://ez-med.herokuapp.com/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email:email
        }),
      });
      res = await res.json();
      
      if(res.Medicines){
        navigation.navigate('Home',{data:res.Medicines})
      }
    } catch (e) {
      console.error(e);
    }
  }
  const handleLogin = () => {
    if(email){
      postData(email)
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
  