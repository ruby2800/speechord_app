import {AppRegistry , Image } from 'react-native';
import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import { Input, Icon } from 'react-native-elements';
import { Button } from 'react-native-elements';
import { DrawerActions, useNavigation } from '@react-navigation/native';


export default class Launch extends Component {

    regis = () => {
        const { navigation } = this.props;
        navigation.navigate('註冊頁面');
    }
    
    enterapp = () => {
        const { navigation } = this.props;
        navigation.navigate('歷史紀錄');
    }
    render() {  
      return (
        <View style={styles.container}>
            <Image
                style={styles.Logo}
                source={require('./Common.png')}
            />
    
            <TouchableOpacity
                style={styles.submitButton}
                onPress={
                    () => this.enterapp()
                }>
                <Text style={styles.submitButtonText}>進入Speechord</Text>
            </TouchableOpacity>

            <Button
                title="沒有帳號? 註冊一個"
                type="clear"
                onPress={
                    () => this.regis()
                }

            />
        </View>
      )
    }
  }

  const styles = StyleSheet.create({
    container:{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    Logo: {
       width: 250,
       height: 250,
     },
    submitButton: {
        //backgroundColor: '#7a42f4',
        backgroundColor: 'darkblue',
        padding: 10,
        alignItems: 'center',
        margin: 30,
        width: 300,
        height: 50,
    },
    submitButtonText: {
        color: 'white',
        alignSelf: 'center',
        fontSize: 20,
    }
 
 })