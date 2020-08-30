import React, { Component } from 'react';
import {useIsFocused,StyleSheet, View, BackHandler, Modal, TouchableHighlight, SafeAreaView,TextInput, FlatList, ActivityIndicator, ScrollView, RefreshControl, PermissionsAndroid,Alert} from 'react-native';
import { Header, Slider, Icon, Input, Button} from 'react-native-elements'
import Sound from 'react-native-sound'
import { DrawerActions, useNavigation } from '@react-navigation/native';
import {BottomNavigation, Text, FAB, Portal, Provider} from 'react-native-paper';
import RNFS from 'react-native-fs';
import { cos } from 'react-native-reanimated';



let whoosh;

export default class App extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = {
            volume: 0.5,
            seconds: 0, //秒數
            totalMin: '', //總分鐘
            totalSec: '', //總秒數
            nowMin: 0, //目前分鐘
            nowSec: 0, //目前秒鐘
            maximumValue: 0, //滑輪直
            play: false,
            pause: false,
            resume: false,
        };
    }
        
    async componentDidMount() {

        //音檔位置
        let url = this.props.route.params.url;
        //初始化
        whoosh = new Sound(url, '', (err) => {
            if (err) {
                return console.log("??" + err)
            }
            let totalTime = whoosh.getDuration();
            //let totalTime = time + 1;
            console.log("時間" + totalTime);
            totalTime = Math.ceil(totalTime);
            let totalMin = parseInt(totalTime / 60); //总分钟数
            let totalSec = totalTime - totalMin * 60; //秒钟数并判断前缀是否 + '0'
            totalSec = totalSec > 9 ? totalSec : '0' + totalSec;
            this.setState({
                totalMin,
                totalSec,
                maximumValue: totalTime,
            })
        });

        BackHandler.addEventListener("hardwareBackPress", this.backAction.bind(this));
    }

    componentWillUnmount() {
        this.time && clearTimeout(this.time);
    }

    backAction = async () => {
        this.props.navigation.navigate('歷史紀錄');
        this.setState({
            play:false,
            pause: false,
            resume: false,
            nowMin: 0,
            nowSec: 0,
            seconds: 0,
        })
        clearInterval(this.time);
       
        whoosh.pause();
    };

      // 播放
    _play = () => {
        this.setState({ pause: false, play: true })

        if(this.state.resume==false){
            let url = this.props.route.params.url;
            whoosh = new Sound(url, '', (err) => {
    
                let totalTime = whoosh.getDuration();
                //let totalTime = time + 1;
                console.log("時間" + totalTime);
                totalTime = Math.ceil(totalTime);
                let totalMin = parseInt(totalTime / 60); //总分钟数
                let totalSec = totalTime - totalMin * 60; //秒钟数并判断前缀是否 + '0'
                totalSec = totalSec > 9 ? totalSec : '0' + totalSec;
                this.setState({
                    totalMin,
                    totalSec,
                    maximumValue: totalTime,
                })   
                if (err) {
                    return console.log(+err)
                }   
                whoosh.play(success => {
                    if (success) {
                        console.log('success - 播放成功')
                        this._stop();
                    } 
                    else {
                        console.log('fail - 播放失败')
                    }
                })   
            });   
            console.log("play" + url);
        }
        else{
            whoosh.play();
            console.log("resume")
            this.setState({resume:false,pause: false, play: true})
            console.log("play"+this.state.resume)
        }
        this.time = setInterval(() => {
            whoosh.getCurrentTime(seconds => {
                seconds = Math.ceil(seconds);
                this._getNowTime(seconds)
            })
        }, 1000)
        // if (this.state.pause) {
        //     whoosh.pause();
        //     console.log("pasue");
        // }         
    }

    // 暂停
    _pause = () => {
        clearInterval(this.time);
        this.setState({ pause: true, play: false,resume:true })
        console.log("pause"+this.state.resume)
        whoosh.pause();
    }

    //恢復
    _stop = () => {
        clearInterval(this.time);
        this.setState({
            nowMin: 0,
            nowSec: 0,
            seconds: 0,
        })
        this.setState({ pause: true, play: false })
    }

    _getNowTime = (seconds) => {
        let nowMin = this.state.nowMin,
            nowSec = this.state.nowSec;
        if (seconds >= 60) {
            nowMin = parseInt(seconds / 60); //当前分钟数
            nowSec = seconds - nowMin * 60;
            nowSec = nowSec < 10 ? '0' + nowSec : nowSec;
        } else {
            nowSec = seconds < 10 ? '0' + seconds : seconds;
        }
        this.setState({
            nowMin,
            nowSec,
            seconds
        })
    }

    render() {
        let time = this.state;
        const { navigation } = this.props;
        let { play, pause } = this.state;

            return (
                < ScrollView 
                // refreshControl={
                //     < RefreshControl
                //         refreshing={this.state.refreshing}
                //         onRefresh={this._onRefresh}
                //     />}
                >
                  <View style={{flex:1}}>
                    <Header
                        placement="left"
                        backgroundColor='transparent'
                        containerStyle={{ width: '100%', backgroundColor: '#3488C0', borderBottomWidth: 0 }}
                        leftComponent={{
                            icon: 'close', color: '#fff', underlayColor: '#3488C0',size:30,
                            onPress: () => this.backAction()
                        }}

                        centerComponent={{
                            text: this.props.route.params.showname,
                            style: {
                                fontSize: 22,
                                fontWeight: 'bold',
                                fontFamily: 'Fonts.Lato',
                                color: 'white'
                            }
                        }}
                        // rightComponent={{ icon: 'export', type: 'entypo', color: '#fff', underlayColor: '#3488C0', onPress: () => { } }}
                    />

                    <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', justifyContent: 'space-around' }}>
                                {/* time&icon */}
                        <View style={{ flex: 1, paddingTop:10, marginHorizontal:30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                            <View>
                                <Text style={{fontSize:18}}>{time.nowMin}:{time.nowSec}/{time.totalMin}:{time.totalSec}</Text>
                            </View>
                                {/* play&pause icon */}
                            <View>
                                {
                                play ?
                                    <Icon name='controller-paus' type='entypo' size={25} color="black" onPress={this._pause}/>
                                     :
                                    <Icon  name='controller-play' type='entypo' size={30} color="black" onPress={this._play}/>
                                }
                            </View>
                        </View>
                                {/* Slider */}
                        <View style={{ flex: 1, paddingHorizontal:10, justifyContent: 'space-around'}}>
                            <Slider                      
                                // disabled //禁止滑动
                                maximumTrackTintColor={'#ccc'} //右侧轨道的颜色
                                minimumTrackTintColor={'skyblue'} //左侧轨道的颜色
                                maximumValue={this.state.maximumValue} //滑块最大值
                                minimumValue={0} //滑块最小值
                                value={this.state.seconds}
                                onSlidingComplete={(value) => { //用户完成更改值时调用的回调（例如，当滑块被释放时）
                                    value = parseInt(value);
                                    this._getNowTime(value)
                                    // 设置播放时间
                                    whoosh.setCurrentTime(value);
                                }} />
                        </View>
                    </View>
                    
                    <View style={{ flex: 1}} >
                        {/* <Text style={{textAlign:'center', fontSize:20, fontWeight:"bold", padding:30}}>Network Error!!!</Text> */}
                        <Text style={{textAlign:'center', marginTop:30, fontSize:15, color:"grey"}}>音檔尚未上傳！</Text>
                    </View>   
                
                  </View>
                 </ ScrollView>
            );
        
    }
}