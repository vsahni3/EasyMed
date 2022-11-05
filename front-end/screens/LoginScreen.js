import { Button, StyleSheet, Text, View,Platform ,Image,Alert } from 'react-native';
import React, { useState, useEffect } from 'react';

export default function LoginScreen({navigation}) {
    return (
      <View style={styles.container}>
        <Button title='Login' onPress={() => navigation.navigate('Home')} />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  