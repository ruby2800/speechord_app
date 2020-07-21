/*import React from 'react';
import { Text, View ,ScrollView} from 'react-native';
import { Button, ThemeProvider,Header,SearchBar,Slider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class App extends React.Component {
  state = {
    search: '',
  };

  updateSearch = (search) => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;

    return (
      <ScrollView>
      <Header
      placement="left"
      leftComponent={{ icon: 'menu',color: '#fff' }}
      centerComponent={{ text: '錄音轉換', style: { color: '#fff' } }}
      
    /><View>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={this.updateSearch}
        value={search}
      />
      </View>
     

<View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
  <Slider
    value={this.state.value}
    onValueChange={(value) => this.setState({ value })}
  />
  <Text>Value: {this.state.value}</Text>
</View>
<View>

<Icon name="warning" size={30} color="#4F8EF7" />
</View>
</ScrollView>
    );
  }
}*/


import React, { Component } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';

import { AudioRecorder, AudioUtils } from 'react-native-audio';
import Sound from 'react-native-sound';


import recordpage from './pages/record';
import historypage from './pages/history';
import wordpage from './pages/WordFile';

const Drawer = createDrawerNavigator();




function Mainpage({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 2, backgroundColor: 'white' }}>
        <View style={{ flex: 1, }}>
        
         
          <View>
            <SearchBar
              placeholder="Type Here..."
              platform="ios"
              
            // onChangeText={this.updateSearch}
            // value={search}
            />
          </View>
          <TouchableOpacity
            style={{
              
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              width: 50,
              height: 50,
              backgroundColor: 'black',
              borderRadius: 10,
            }}
            
            onPress={() =>
              navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Icon name={"align-justify"} size={25} color="white" />
          </TouchableOpacity>

        </View>

      </View>

      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              backgroundColor: 'red',
              borderRadius: 50,
            }}
            onPress={() =>
              navigation.navigate('錄音')}
          >
            <Icon name={"circle"} size={50} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}



function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="關閉選單"
        onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
      />

    </DrawerContentScrollView>
  );
}
function MyDrawer() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="初始頁面" component={Mainpage} />
      <Drawer.Screen name="錄音" component={recordpage} />
      <Drawer.Screen name="歷史紀錄" component={historypage} />
      <Drawer.Screen name="逐字稿" component={wordpage} />
    </Drawer.Navigator>
  );
}

export default function App() {

  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}
/*
function Historys({ navigation }) {


  return (
    <ScrollView>
      <View>
        <SearchBar
          placeholder="Type Here..."
        //onChangeText={this.updateSearch}
        //value={search}
        />
      </View>
      <View>

        <Icon name="warning" size={30} color="#4F8EF7" />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>音檔</Text>
        <Button
          title="選單"
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        />
      </View>
      <Button
        title="錄音"
        onPress={() =>
          navigation.navigate('record')
        } />

    </ScrollView>
  );
}

function Record({ navigation }) {
  
  function trytry(props) {
    
    console.log('Ask me later pressed');
    
  }
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>錄音</Text>
      <Button
        title="選單"
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <Button
        title="音檔"
        onPress={() =>
          navigation.navigate('音檔')
        } />
      <Button 
        title="開始"
        onPress={
          this.trytry
        } />
    </View>
  );
}




function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="關閉選單"
        onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
      />

    </DrawerContentScrollView>
  );
}



function MyDrawer() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="音檔" component={Historys} />
      <Drawer.Screen name="錄音" component={Record} />

    </Drawer.Navigator>
  );
}

export default function App() {

  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}

*/





