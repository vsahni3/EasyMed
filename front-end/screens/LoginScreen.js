import { Button, StyleSheet, Text, View,Platform ,Image,Alert, TextInput, TouchableOpacity } from 'react-native';
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
        <Text style={styles.title}>EasyMed</Text>
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
        <TouchableOpacity style={{
          borderRadius: 3,
          padding: 15,
          elevation: 2,
          marginTop:20,backgroundColor: '#01579B',
          width:'80%'
        }} onPress={handleLogin} >
          <Text style={{textAlign:'center',fontSize:15,color:'#fff',fontWeight:'bold'}}>Login</Text>
        </TouchableOpacity>
        {/* <Button title='Login' /> */}
      </View>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems:'center'
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      width:'80%'
      
    },
    title:{
      fontSize:30,
      textAlign:'center',
      fontWeight:'bold',
      marginBottom:50
    }
  });
  