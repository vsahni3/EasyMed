import { FlatList, StyleSheet, Text, View,TouchableOpacity,Modal,Pressable,Linking } from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import WeekdayPicker from "react-native-weekday-picker"
import React, { useState, useEffect } from 'react';


export  const Item = ({ title,email,day,handleUpdate}) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay,setSelectedDay] = useState(day);
  const [medTime,setMedTime] = useState(new Date());

  useEffect(()=>{
    setTime(title)
    
  },[])
  const handleDone = async (title,email) => {
    try {
      let res = await fetch('https://ezmed.herokuapp.com/newrecord', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email:email,
          med_id:title[0],
          expected_time:title[2],
          current_date: getDate(),
          current_time: getTime()
        })
      });
      // res = await res.json();
    } catch (e) {
      console.error(e);
    }
  }
  
  const getDate = () =>{
    const date = new Date();
    let day = date.getDate();
    if(day < 10) {
      day = '0'+day;
    }
    let month = date.getMonth() + 1;
    let year = date.getFullYear().toString().substr(-2);
    let currentDate = `${month}/${day}/${year}`;
    return currentDate;
  }
  const getTime = () => {
    var today = new Date();
    let hours = today.getHours();
    if(hours < 10){
      hours = '0'+hours;
    }
    var time = hours + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;
  }
  const setTime = (title) => {
    let hours = title[2].slice(0,2);
    let minutes = title[2].slice(3,5);
    let seconds = title[2].slice(6,8);
    let date = new Date(title[2]);
    // date.setHours(hours);
    // date.setMinutes(minutes);
    // date.setSeconds(seconds);
    
    if(date.getHours() ){
      setMedTime(date);
    }
    
  }
  const handleChangeDay = (day) =>{
    setSelectedDay(day);
  }
  const handleOkay = async (time) => {
    try {
      let nTime = time ? time : medTime;
      let res = await fetch('https://ezmed.herokuapp.com/update', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email:email,
          new_med:[title[0],getDay(selectedDay),nTime,title[3],title[4]]
        })
      });
      res = await res.json();
      // console.log('dd',res)
      handleUpdate(res.Medicines)
      setModalVisible(!modalVisible)
    } catch (e) {
      console.error(e);
    }
  }
  const getDay = (day) => {
    if( day ==0 )
    return 'Sunday'
    else if (day == 1)
    return 'Monday'
    else if (day == 2)
    return 'Tuesday'
    else if (day == 3)
    return 'Wednesday'
    else if (day == 4)
    return 'Thursday'
    else if (day == 5)
    return 'Friday'
    else if (day == 6)
    return 'Saturday'
  }
  const changeTime = (event, date) => {
    // setMedTime(getTime(date));
    // handleOkay(date)
  };
  const handleMAD =()=>{

    handleDone(title,email)
    Linking.openURL('https://lighthearted-pixie-69acca.netlify.app/')
  }
  return(
    <View style={styles.item}>
      <Text style={styles.title}>{title[3]}</Text>
      <View style={styles.remindContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.dayText}>{title[1] ==='NULL' ? 'Select day':title[1]}</Text>
        </TouchableOpacity> 
      
        <RNDateTimePicker mode='time' value={medTime} style={{height:50,width:100}} onChange={changeTime} />
      </View>
      
      <TouchableOpacity style={styles.doneBtn} onPress={handleMAD} >
        <Text style={styles.doneTxt}>Mark as Done</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.weekContainer}>
              <TouchableOpacity style={[styles.dayContainer , selectedDay == 0 && styles.selectedDay]} onPress={()=>handleChangeDay(0)}>
                <Text style={[styles.dayText, selectedDay == 0 && {color:'#fff'}]}>S</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.dayContainer , selectedDay == 1 && styles.selectedDay]} onPress={()=>handleChangeDay(1)}>
                <Text style={[styles.dayText, selectedDay == 1 && {color:'#fff'}]}>M</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.dayContainer , selectedDay == 2 && styles.selectedDay]} onPress={()=>handleChangeDay(2)}>
                <Text style={[styles.dayText, selectedDay == 2 && {color:'#fff'}]}>T</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.dayContainer , selectedDay == 3 && styles.selectedDay]} onPress={()=>handleChangeDay(3)}>
                <Text style={[styles.dayText, selectedDay == 3 && {color:'#fff'}]}>W</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.dayContainer , selectedDay == 4 && styles.selectedDay]} onPress={()=>handleChangeDay(4)}>
                <Text style={[styles.dayText, selectedDay == 4 && {color:'#fff'}]}>T</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.dayContainer , selectedDay == 5 && styles.selectedDay]} onPress={()=>handleChangeDay(5)}>
                <Text style={[styles.dayText, selectedDay == 5 && {color:'#fff'}]}>F</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.dayContainer , selectedDay == 6 && styles.selectedDay]} onPress={()=>handleChangeDay(6)}>
                <Text style={[styles.dayText, selectedDay == 6 && {color:'#fff'}]}>S</Text>
              </TouchableOpacity>
            </View>
           
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => handleOkay()}>
              <Text style={styles.textStyle}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      
    },
    dayContainer:{
      flexDirection:'row'
    },
    item: {
      borderColor:'#BDBDBD',
      borderWidth:1,
      padding: 10,
      marginVertical: 8,
      marginHorizontal: 16,
      // width:'40%'
    },
    title: {
      fontSize: 25,
    },
    remindContainer:{
      justifyContent:'space-between',
      marginTop:10,
      flexDirection:'row',
      alignItems:'center'
    },
    doneBtn:{
      backgroundColor:'#01579B',
      borderRadius:3,
      marginTop:20,
      padding:7,
      alignItems:'center',
      justifyContent:'center'
    },
    doneTxt:{
      color:'#fff',
      fontWeight:'bold',
      fontSize:15
    },
    modalView: {
      height:'50%',
      margin: 20,
      marginTop:100,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 3,
      padding: 10,
      elevation: 2,
      marginTop:20
    },
    button2:{
      borderRadius: 3,
      padding: 15,
      elevation: 2,
      margin:3,
      backgroundColor: '#01579B',
    },
    button2:{
      borderRadius: 3,
      padding: 15,
      elevation: 2,
      margin:3,
      backgroundColor: '#01579B',
    },
    buttonOpen: {
      backgroundColor: '#ddd',
    },
    buttonClose: {
      backgroundColor: '#01579B',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
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