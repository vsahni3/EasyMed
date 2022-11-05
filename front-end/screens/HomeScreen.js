import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View,Platform ,Image,Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';


export default function HomeScreen({route}) {
    const [image, setImage] = useState(null);
    const { data } = route.params;
    const postData = async(str) => {
      try {
        let files = {'file': "<_io.BufferedReader name='"+str+"'>"};
        let res = await fetch('https://freeocrapi.com/api', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files,
          }),
        });
        console.log(files)
        res = await res.json();
        console.log('res',res)
      } catch (e) {
        console.error(e);
      }
    }
  
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
     
      if (!result.cancelled) {
        setImage(result.uri);
        postData(result.uri);
      }
    };
  
   
    return (
      <View style={styles.container}>
        <Button title={"Pick an image from camera roll"} onPress={pickImage} />
        {/* {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />} */}
        <StatusBar style="auto" />
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
  