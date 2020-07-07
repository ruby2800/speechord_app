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


import  React, { Component }  from 'react';
import { View, Text, Button,ScrollView,TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome';

import {AudioRecorder, AudioUtils} from 'react-native-audio';
import Sound from 'react-native-sound';


import record from './pages/record';
import history from './pages/history';

const Drawer = createDrawerNavigator();




function Historys ({ navigation }) {


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
        navigation.navigate('錄音')
      }/>
      
      </ScrollView>
    );
  }
  
  
  

function Record ({ navigation }) {
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
              }/>     
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

export default function App()  {
  return (
    <NavigationContainer>
      <MyDrawer />
    </NavigationContainer>
  );
}

/*
import React, { Component } from 'react';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import Sound from 'react-native-sound';
//import {requestAudio} from './audioAction'; // 此文件内容在下面



class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
          
            hasPermission: undefined, //录音 授权状态  
            audioPath: AudioUtils.DocumentDirectoryPath + `/quick_audio_${new Date().getTime()}.aac`, // 文件路径  
            stop: false,     //录音是否停止  
            currentTime: 0,  //录音时长  
          
        }
    }
    
    componentDidMount() {
        this.getAudioAuthorize()
    }
    
    // 请求录音授权
    getAudioAuthorize() {
        AudioRecorder.requestAuthorization()
            .then(isAuthor => {
                console.log('是否授权: ' + isAuthor)
                if(!isAuthor) {
                    return alert('APP需要使用录音，请打开录音权限允许APP使用')
                }
                this.setState({hasPermission: isAuthor})
                this.prepareRecordingPath(this.state.audioPath);
                // 录音进展
                AudioRecorder.onProgress = (data) => {
                    this.setState({
                        currentTime: Math.ceil(data.currentTime)
                    });
                };
                // 完成录音
                AudioRecorder.onFinished = (data) => {
                    // data 录音数据，可以在此存储需要传给接口的路径数据
                    console.log(this.state.currentTime)
                };
            }) 
    }
    
    /*
     * AudioRecorder.prepareRecordingAtPath(path,option)
     * 录制路径
     * path 路径
     * option 参数
     */
    /*
    prepareRecordingPath = (path) => {
        const option = {
            SampleRate: 44100.0, //采样率
            Channels: 2, //通道
            AudioQuality: 'High', //音质
            AudioEncoding: 'aac', //音频编码 aac
            OutputFormat: 'mpeg_4', //输出格式
            MeteringEnabled: false, //是否计量
            MeasurementMode: false, //测量模式
            AudioEncodingBitRate: 32000, //音频编码比特率
            IncludeBase64: true, //是否是base64格式
            AudioSource: 0, //音频源
        }
        AudioRecorder.prepareRecordingAtPath(path,option)
    }
    
    // 开始录音
    handleStartAudio = async () => {
        if(!this.state.hasPermission) {
            return alert('APP需要使用录音，请打开录音权限允许APP使用')
        }
        show('录音开始')
        if(this.state.stop) {
            // 初始化录音
            this.prepareRecordingPath(this.state.audioPath)
        }
        try {
            await AudioRecorder.startRecording()
        } catch (err) {
            console.error(err)
        }
    }
    
    // 停止录音
    handleStopAudio = async () => {
        show('录音结束')
        try {
            await AudioRecorder.stopRecording();
            this.setState({ stop: true, recording: false });
        } catch (error) {
            console.error(error);
        }
    }
    
    // 播放录音
    handlePlayAudio = async () => {
        let self = this
        show('正在播放')
        self.whoosh = new Sound(this.state.audioPath, '', (err) => {
            if(err) {
                show('加载音频失败')
                return console.warn(err)
            }
            self.whoosh.play(success => {
                if(success) {
                    console.warn('success - 播放成功')
                    show('播放完毕')
                }else {
                    console.warn('fail - 播放失败')
                    show('播放失败')
                }
            })
        })
    }

    // 删除录音
    handleDelAudio = async () => {
        // 初始化录音
        this.prepareRecordingPath(this.state.audioPath)
        let {listOptionData} = this.state
        listOptionData[11].value = ''
        this.setState({
            currentTime: 0,
            stop: false,
            listOptionData
        })
    }
    
    
    // 注意⚠️，在此处调用接口，传递录音
    async handlesubmit() {
        let {stop, audioPath} = this.state
        if(stop) {
            // 有录音
            let params = {
                path: audioPath // 根据自己项目修改参数哈
            }
            
            let audioResult = await requestAudio(params); // requestAudio 是封装的请求接口的函数，具体内容在下面
            
            console.log('audioResult----请求接口后返回的数据：', audioResult)
        }
    }
    
    

    render() {
        return (
            <View>
                <TouchableOpacity
                    activeOpacity = {.8}
                    onPress={this.handleStartAudio}
                    >
                    <Text> 录音 </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity = {.8}
                    onPress={this.handleStopAudio}
                    >
                    <Text> 停止录音 </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity = {.8}
                    onPress={this.handlePlayAudio}
                    >
                    <Text> 播放录音 </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity = {.8}
                    onPress={this.handleDelAudio}
                    >
                    <Text> 删除录音 </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    activeOpacity = {.8}
                    onPress={() => this.handlesubmit()}
                    >
                    <Text> 提交录音 </Text>
                </TouchableOpacity>
            </View>
        
        )
    }
    
    
    
    
    
}

*/



