import { StatusBar } from 'expo-status-bar';
import { FlatList, StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import { firebase_app } from '../firebase';
import Ionicons from '@expo/vector-icons/Ionicons';
import {Item}  from '../components/Item'

export default function HomeScreen({route}) {
    const [image, setImage] = useState(null);
    const [day,setDay] = useState(null);
    const { data ,email} = route.params;
    const [medList,setMedList] = useState(data);
    useEffect(()=>{
      const d = new Date();
      let day = d.getDay();
      setDay(day)
      loadList(day);
    },[])

    const loadList = (day) => {
      if(day==0){
        let list = data.filter(item => item[1] == 'Sunday' );
        setMedList(list)
      }
      else if(day==1){
        let list = data.filter(item => item[1] == 'Monday' );
        setMedList(list)
      }
      else if(day==2){
        let list = data.filter(item => item[1] == 'Tuesday' );
        setMedList(list)
      }
      else if(day==3){
        let list = data.filter(item => item[1] == 'Wednesday' );
        setMedList(list)
      }
      else if(day==4){
        let list = data.filter(item => item[1] == 'Thursday' );
        setMedList(list)
      }
      else if(day==5){
        let list = data.filter(item => item[1] == 'Friday' );
        setMedList(list)
      }
      else if(day==6){
        let list = data.filter(item => item[1] == 'Saturday' );
        setMedList(list)
      }
      console.log(medList)
    }
    const postText = async(text) => {
      try {
        let res = await fetch('https://ezmed.herokuapp.com/upload', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email:email,
            text:text
          })
        });
        res = await res.json();
        console.log(res.Medicines)
      } catch (e) {
        console.error(e);
      }
    }

    const ocrCall = async(str) => {
      try {
        fetch('https://api.ocr.space/parse/imageurl?apikey=helloworld&url=https://raw.githubusercontent.com/vsahni3/EasyMed/main/JohnSmith-Example.jpg')
        .then(response => response.json())
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
          snapshot.snapshot.ref.getDownloadURL(ref).then((url) => {
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
    const handleChangeDay = (day) =>{
      setDay(day)
      loadList(day)
    }
    const handleUpdate = (list) => {
      setMedList(list)
      loadList(day)
    }
    const renderItem = ({ item }) => (
      <Item title={item} key={item[0]} email={email} day = {day} handleUpdate={(list)=>handleUpdate(list)} />
    );
    return (
      <View style={styles.container}>
        <View style={styles.weekContainer}>
          <TouchableOpacity style={[styles.dayContainer , day == 0 && styles.selectedDay]} onPress={()=>handleChangeDay(0)}>
            <Text style={[styles.dayText, day == 0 && {color:'#fff'}]}>S</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dayContainer , day == 1 && styles.selectedDay]} onPress={()=>handleChangeDay(1)}>
            <Text style={[styles.dayText, day == 1 && {color:'#fff'}]}>M</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dayContainer , day == 2 && styles.selectedDay]} onPress={()=>handleChangeDay(2)}>
            <Text style={[styles.dayText, day == 2 && {color:'#fff'}]}>T</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dayContainer , day == 3 && styles.selectedDay]} onPress={()=>handleChangeDay(3)}>
            <Text style={[styles.dayText, day == 3 && {color:'#fff'}]}>W</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dayContainer , day == 4 && styles.selectedDay]} onPress={()=>handleChangeDay(4)}>
            <Text style={[styles.dayText, day == 4 && {color:'#fff'}]}>T</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dayContainer , day == 5 && styles.selectedDay]} onPress={()=>handleChangeDay(5)}>
            <Text style={[styles.dayText, day == 5 && {color:'#fff'}]}>F</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dayContainer , day == 6 && styles.selectedDay]} onPress={()=>handleChangeDay(6)}>
            <Text style={[styles.dayText, day == 6 && {color:'#fff'}]}>S</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={medList}
          renderItem={renderItem}
          keyExtractor={item => item[0]}
          // numColumns={2}
        />
        <TouchableOpacity style={styles.fab} onPress={pickImage}>
          <Ionicons name="md-add-circle" size={60} color="#01579B" />
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    fab:{
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 30,
      right: 30,
    },
    weekContainer:{
      height:50,
      flexDirection:'row',
      marginTop:15,
      marginBottom:15
    },
    dayContainer:{
      flex:1,
      borderWidth:1,
      borderColor:'#BDBDBD',
      margin:3,
      justifyContent:'center',
      alignItems:'center',
      borderRadius:3,
    },
    selectedDay:{
      backgroundColor:'#01579B',
      borderColor:'#01579B'
    },
    dayText:{
      fontSize:16,
      fontWeight:'600'
    }
  });
  