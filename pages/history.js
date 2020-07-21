import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Slider } from 'react-native-elements'
import Sound from 'react-native-sound'
import { DrawerActions, useNavigation } from '@react-navigation/native';

//const { navigation } = this.props;
// const { route } = this.props;
// const { url } = route.params;

//import { audioPath } from './record';


//let url = 'https://languagezenstorage.blob.core.windows.net/media0/xgcUXjHhP8.mp3';
// let url = this.props.route.params.url;
// console.log("mont李"+ url);
// let whoosh = new Sound(url,'', err => {
//     if (err) {
//         console.log(err + "dfwef");
//     }
//     //whoosh.play();
// })

let whoosh;
export default class mySound extends Component {

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
                return console.log(err)
            }


        })
        let time = this.props.route.params.time;




        let totalTime = time + 1;
        //console.log("時間"+totalTime);
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

        //let url = 'https://languagezenstorage.blob.core.windows.net/media0/xgcUXjHhP8.mp3';
        let url = this.props.route.params.url;
        let whoosh = new Sound(url, '', (err) => {
            if (err) {
                return console.log(err)
            }
            whoosh.play(success => {
                if (success) {

                    console.log('success - 播放成功')
                } else {
                    console.log('fail - 播放失败')
                }
            })
        })

        console.log(url);
        this.time = setInterval(() => {
            whoosh.getCurrentTime(seconds => {
                seconds = Math.ceil(seconds);
                this._getNowTime(seconds)
            })
        }, 1000)
        this.setState({ pause: false, play: true })
    }
    // 暂停
    _pause = () => {
        clearInterval(this.time);
        let url = this.props.route.params.url;
        let whoosh = new Sound(url, '', (err) => {
            if (err) {
                return console.log(err)
            }


        })

        this.setState({ pause: true, play: false })
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
                <View style={{ flex: 1 }}>
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
                    <View style={{ alignItems: 'center' }}>


                        <Text>{time.nowMin}:{time.nowSec}/{time.totalMin}:{time.totalSec}</Text>
                        <Text>目前音量: {this.state.volume}</Text>
                    </View>
                </View>

                <View style={{ flex: 1 }}>


                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
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



                            {/* <TouchableOpacity
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

                            onPress={this._stop}
                        >
                            <Icon name={"stop"} size={25} color="white" />
                        </TouchableOpacity> */}
                        </View>
                    </View>


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

