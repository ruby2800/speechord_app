  
// import React from 'react';
// import { View, StyleSheet } from 'react-native';
import {
    useTheme,

    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch,
    Divider
} from 'react-native-paper';
// import {
//     DrawerContentScrollView,
//     DrawerItem
// } from '@react-navigation/drawer';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import React, { Component } from 'react';
import { View, Button, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import { SearchBar, Header, Icon , Avatar} from 'react-native-elements';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
// import Icon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import Sound from 'react-native-sound';


import recordpage from './pages/record';
import wordpage from './pages/WordFile';
import historypage from './pages/history';
import launchpage from './pages/Launch';
import registerpage from './pages/register';

import { color } from 'react-native-reanimated';

console.disableYellowBox = true;

function DrawerContent(props) {
  
  // //隱藏播放
  // const { state, ...rest } = props;
  // const newState = { ...state }  //copy from state before applying any filter. do not change original state
  // newState.routes = newState.routes.filter(item => item.name !== '啓動頁面') 
  // newState.routes = newState.routes.filter(item => item.name !== '註冊頁面') 
  // newState.routes = newState.routes.filter(item => item.name !== '文字稿') 
  // //replace "Login' with your route name
  // // newState.routes = newState.routes.filter(item => item.name !== '初始頁面')

return(
  <View style={{flex:1}}>
      <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
              <View style={styles.userInfoSection}>
                  <View style={{flexDirection:'row', marginTop:10, alignContent:"center"}}>
                      <Avatar
                          rounded
                          size={100}
                          source={require('./pages/logo.png')}
                        
                          avatarStyle={{ borderWidth: 1, borderColor: 'grey', borderRadius: 400/ 2}}
                      />
                      <View style={{marginLeft:20, alignSelf:"center"}}>
                          <Caption>賬號名稱：</Caption>
                          <Title style={styles.title}>SpeeChord</Title>
                      </View>
                  </View>
                 
              </View>
              
              <Drawer.Section style={styles.drawerSection}>
              <Divider />
                  <DrawerItem 
                      icon={({color, size}) => (
                          <Icon 
                          name="history" 
                          color={color}
                          size={size}
                          />
                      )}
                      label="歷史紀錄"

                      onPress={() => {props.navigation.navigate('歷史紀錄')}}
                  />
                  <DrawerItem 
                      icon={({color, size}) => (
                          <Icon 
                          name="mic" 
                          color={color}
                          size={size}
                          />
                      )}
                      label="錄音"
                      onPress={() => {props.navigation.navigate('錄音')}}
                  />
              </Drawer.Section>
          
          </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
          <DrawerItem 
              icon={({color, size}) => (
                  <Icon 
                  name="exit-to-app" 
                  color={color}
                  size={size}
                  />
              )}
              label="關閉選單"
              onPress={() => props.navigation.closeDrawer()}
          />
      </Drawer.Section>
  </View>
);
}


const myDrawer = createDrawerNavigator();
function MyDrawer() {
  return (

    <myDrawer.Navigator  drawerContent={props => <DrawerContent {...props} />}>
     
      <myDrawer.Screen name="啓動頁面" component={launchpage}
      options={{
        swipeEnabled: false,
      }} />
      <myDrawer.Screen name="註冊頁面" component={registerpage} 
      options={{
        swipeEnabled: false,
      }} />
      <myDrawer.Screen name="歷史紀錄" component={historypage} />
      <myDrawer.Screen name="錄音" component={recordpage} />
      <myDrawer.Screen name="文字稿" component={wordpage}
       options={{
        swipeEnabled: false,
      }} />
  
    </myDrawer.Navigator>

  );
}
const Stack = createDrawerNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  // caption: {
  //   fontSize: 15,
  //   lineHeight: 5,
  // },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
      marginBottom: 15,
      borderTopColor: '#f4f4f4',
      borderTopWidth: 1
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});