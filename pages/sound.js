import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { Header, Slider } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';

import Sound from 'react-native-sound'
import { DrawerActions, useNavigation } from '@react-navigation/native';
import WordFile from './WordFile';
//const { navigation } = this.props;
// const { route } = this.props;
// const { url } = route.params;
//import { audioPath } from './record';
// let url = 'https://languagezenstorage.blob.core.windows.net/media0/xgcUXjHhP8.mp3';

// console.log("mont李"+ url);
// let whoosh = new Sound(url,'', err => {
//     if (err) {
//         console.log(err + "dfwef");
//     }
//     //whoosh.play();
// })
//const whoosh =new Sound();


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            volume: 0.5,
            seconds: 0, //秒数
            totalMin: '', //总分钟
            totalSec: '', //总分钟秒数
            nowMin: 0, //当前分钟
            nowSec: 0, //当前秒钟
            maximumValue: 0, //滑块最大值
            play: false,
            pause: false
        }
    }
    componentDidMount() {
        let url = this.props.route.params.url;
        let whoosh = new Sound(url, '', (err) => {
            if (err) {
                return console.log("??" + err)
            }


        })
        let time = this.props.route.params.time;
        //get有問題
        //let totalTime = whoosh.getDuration();
        let totalTime = time + 1;
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
    }
    componentWillUnmount() {
        this.time && clearTimeout(this.time);
    }
    // 播放
    _play = () => {
        //  let url = 'https://languagezenstorage.blob.core.windows.net/media0/xgcUXjHhP8.mp3';
        let url = this.props.route.params.url;
        let whoosh = new Sound(url, '', (err) => {
            if (err) {
                return console.log(+err)
            }
            whoosh.play(success => {
                if (success) {
                    console.log('success - 播放成功')
                } else {
                    console.log('fail - 播放失败')
                }
            })
            // if (pause) {

            //     whoosh.pause();
            // }
        });

        console.log("paly" + url);
        this.time = setInterval(() => {
            whoosh.getCurrentTime(seconds => {
                seconds = Math.ceil(seconds);
                this._getNowTime(seconds)
            })
        }, 1000)

        this.setState({ pause: false, play: true })
        // let { pause } = this.state
        // if(pause){

        //     whoosh.pause();
        // }
    }
    // 暂停
    _pause = () => {

        // let url = this.props.route.params.url;
        // let whoosh = new Sound(url, '', (err) => {
        //     if (err) {
        //         return console.log(err)
        //     }
        // })
        // clearInterval(this.time);
        clearInterval(this.time);
        this.setState({ pause: true, play: false })
        // whoosh.pause();
    }
    // 停止
    // _stop = () => {
    //     clearInterval(this.time);
    //     this.setState({
    //         nowMin: 0,
    //         nowSec: 0,
    //         seconds: 0,
    //     })
    //     whoosh.stop();
    // }
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
            <View style={{ flex: 1 }} >

                <Header
                    backgroundColor='transparent'
                    containerStyle={{ width: '100%', backgroundColor: '#3488C0', borderBottomWidth: 0 }}
                    leftComponent={{
                        icon: 'menu', type: 'entypo', color: '#fff', underlayColor: '#3488C0',
                        onPress: () => navigation.dispatch(DrawerActions.openDrawer())
                    }}

                    centerComponent={{
                        text: '20200203 錄音一',
                        style: {
                            fontSize: 20,
                            fontWeight: 'bold',
                            fontFamily: 'Fonts.Lato',
                            color: 'white'
                        }
                    }}
                    rightComponent={{ icon: 'export', type: 'entypo', color: '#fff', underlayColor: '#3488C0', onPress: () => { } }}
                />
                <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', justifyContent: 'space-around'}}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                        <View>
                            <Text>{time.nowMin}:{time.nowSec}/{time.totalMin}:{time.totalSec}</Text>

                        </View>
                        {/* play&pause icon */}

                        <View>{
                            play ?
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

                                    onPress={this._pause}
                                >
                                    <Icon name={"pause"} size={25} color="white" />
                                </TouchableOpacity>
                                :
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

                                    onPress={this._play}
                                >
                                    <Icon name={"play"} size={25} color="white" />
                                </TouchableOpacity>
                        }

                        </View>
                    </View>
                    <View>
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
                            }}
                        />
                    </View>
                </View>
                <View style={{ flex: 4, backgroundColor: 'white' }}>
                    <WordFile />
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});