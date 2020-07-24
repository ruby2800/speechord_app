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
import { View, Text, Button, ScrollView, TouchableOpacity} from 'react-native';
import { SearchBar, Header, Icon} from 'react-native-elements';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
// import Icon from 'react-native-vector-icons/Entypo';

import { AudioRecorder, AudioUtils } from 'react-native-audio';
import Sound from 'react-native-sound';


import recordpage from './pages/record';
import soundpage from './pages/sound';
import wordpage from './pages/WordFile';
import historypage from './pages/history';

import { color } from 'react-native-reanimated';



function Mainpage({ navigation }) {
  return (
    <View style={{ flex: 1 }}>

        {/* Header&Body */}
        <View style={{ flex: 7, backgroundColor: 'white' }}>
          {/* <View style={{ flex: 1, }}>                     */}
                <Header
                    placement="left"
                    // backgroundColor='#E8E8E8'
                    backgroundColor='#3488C0'
                    
                    // containerStyle={{ width: '100%', backgroundColor: '#3488C0', borderBottomWidth: 0 }}
                    leftComponent={{ icon: 'menu', type:'entypo', color: 'white', underlayColor: '#3488C0', onPress:() => navigation.openDrawer()}}
                    centerComponent={{
                        text: '語音列表',
                        style: {
                          fontSize: 20,
                          fontWeight: 'bold',
                          fontFamily: 'Fonts.Lato',
                          color: 'white'
                        }
                    }}
                />
                <ScrollView>
                    <SearchBar
                      searchIcon={{size:15, color:'#A5A5A5'}}
                      placeholder="Type Here..."
                      placeholderTextColor='#A5A5A5'
                      platform="ios"
                      inputStyle={{fontSize:15}}
                      inputContainerStyle={{ height:10 ,backgroundColor:'#ECECEC'}}
                      containerStyle={{height:50, backgroundColor:'transparent'}}                                          
                    // onChangeText={this.updateSearch}
                    // value={search}
                    />
                </ScrollView>       
          {/* </View> */}
        </View>

        {/* Footer */}
        <View style={{ flex: 1, backgroundColor: '#E8E8E8'}}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Icon raised name='controller-record' type='entypo' color='red'
                      onPress={() => navigation.navigate('錄音')}
                />
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
        // onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
        onPress={() => props.navigation.closeDrawer()}
      />

    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();
function MyDrawer() {
  return (
    
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen name="初始頁面" component={Mainpage} />
        <Drawer.Screen name="錄音" component={recordpage} />
        <Drawer.Screen name="歷史紀錄" component={historypage} />
        <Drawer.Screen name="播放" component={soundpage} />
        {/* <Drawer.Screen name="逐字稿" component={wordpage} /> */}
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





