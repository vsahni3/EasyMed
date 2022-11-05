import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View,Platform ,Image,Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import { firebase_app } from '../firebase';

export default function HomeScreen({route}) {
    const [image, setImage] = useState(null);
    const { data ,email} = route.params;
    const postText = async(text) => {
      try {
        let res = await fetch('https://freeocrapi.com/api/upload', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            text
          }),
        });
        console.log(JSON.stringify({
            email,
            text
          }))
        // res = await res.json();
        console.log('res',JSON.stringify(res))
      } catch (e) {
        console.error(e);
      }
    }

    const ocrCall = async(str) => {
      try {
        fetch('https://api.ocr.space/parse/imageurl?apikey=helloworld&url=https://raw.githubusercontent.com/vsahni3/EasyMed/main/JohnSmith-Example.jpg')
        .then(response => response.json())
        // .then(data => console.log(data))
        .then(data => postText(data?.ParsedResults[0].ParsedText));
      } catch (e) {
        console.error(e);
      }
    }
    const uploadImage = async (image) => {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function() {
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', image, true);
        xhr.send(null);
      })
      const ref = firebase_app.storage().ref().child(`Pictures/Image1`)
      const snapshot = ref.put(blob)
      snapshot.on(firebase_app.storage.TaskEvent.STATE_CHANGED,
        ()=>{
          
        },
        (error) => {
          
          console.log(error)
          blob.close()
          return 
        },
        () => {
          snapshot.snapshot.ref.getDownloadURL().then((url) => {
            ocrCall(url)
            blob.close()
            return url
          })
        }
        )
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
        uploadImage(result.uri);
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
  