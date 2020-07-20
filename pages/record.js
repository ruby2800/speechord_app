import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';



import { DrawerActions, useNavigation } from '@react-navigation/native';


import { Slider } from 'react-native-elements';


import Sound from 'react-native-sound';
import { AudioRecorder, AudioUtils } from 'react-native-audio';






export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasPermission: undefined, //授权状态     
            //audioPath: AudioUtils.DocumentDirectoryPath + `/${new Date().getTime()}.aac`,  // 文件路径
            audioPath: AudioUtils.DocumentDirectoryPath + '/test.aac',  // 文件路径
            recording: false, //是否录音
            pause: false, //录音是否暂停
            stop: false, //录音是否停止
            currentTime: 0, //录音时长

        };
    }


    componentDidMount() {
        // 请求授权
        AudioRecorder.requestAuthorization()
            .then(isAuthor => {
                console.log('是否授權: ' + isAuthor)
                if (!isAuthor) {
                    return alert('請前往設定開啟錄音權限')
                }
                this.setState({ hasPermission: isAuthor })
                this.prepareRecordingPath(this.state.audioPath);
                // 录音进展
                AudioRecorder.onProgress = (data) => {
                    this.setState({ currentTime: Math.floor(data.currentTime) });
                };
                // 完成录音
                AudioRecorder.onFinished = (data) => {
                    // data 返回需要上传到后台的录音数据
                    console.log(this.state.currentTime)
                    console.log(this.state.audioPath);
                    console.log(this.state.whoosh);
                };
            })
    };

    /**
     * AudioRecorder.prepareRecordingAtPath(path,option)
     * 录制路径
     * path 路径
     * option 参数
     */
    prepareRecordingPath = (path) => {
        const option = {
            SampleRate: 44100.0, //采样率
            Channels: 2, //通道
            AudioQuality: 'High', //音质
            AudioEncoding: 'aac', //音频编码
            OutputFormat: 'mpeg_4', //输出格式
            MeteringEnabled: false, //是否计量
            MeasurementMode: false, //测量模式
            AudioEncodingBitRate: 32000, //音频编码比特率
            IncludeBase64: true, //是否是base64格式
            AudioSource: 0, //音频源
        }
        AudioRecorder.prepareRecordingAtPath(path, option)
    }

    // 开始录音
    _record = async () => {
        if (!this.state.hasPermission) {
            return alert('沒有授權')
        }
        if (this.state.recording) {
            return alert('已在錄音中...')
        }
        if (this.state.stop) {
            this.prepareRecordingPath(this.state.audioPath)
        }
        this.setState({ recording: true, pause: false })

        try {
            await AudioRecorder.startRecording()
        } catch (err) {
            console.log(err)
        }
    }

    // 暂停录音
    _pause = async () => {
        if (!this.state.recording) {
            return alert('請先按下錄音鍵')
        }

        try {
            await AudioRecorder.pauseRecording()
            this.setState({ pause: true, recording: false })
        } catch (err) {
            console.log(err)
        }
    }

    // 恢复录音
    _resume = async () => {
        if (!this.state.pause) {
            return alert('錄音未暫停')
        }

        try {
            await AudioRecorder.resumeRecording();
            this.setState({ pause: false, recording: true })
        } catch (err) {
            console.log(err)
        }
    }

    // 停止录音
    _stop = async () => {
        this.setState({ stop: true, recording: false, paused: false });
        try {

            await AudioRecorder.stopRecording();
        } catch (error) {
            console.log("停止");
            console.error(error);
        }
    }

    // 播放录音
    _play = async () => {
        let url = 'https://languagezenstorage.blob.core.windows.net/media0/xgcUXjHhP8.mp3';
        
        let whoosh = new Sound(this.state.audioPath, '', (err) => {
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
    }



    render() {
        let { recording, pause, currentTime } = this.state;
        //要加上去
        const { navigation } = this.props;

        return (
            <View style={styles.container}>
                <View>
                    <Button
                        title="選單"
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                    />
                </View>
                <Text style={styles.text} onPress={this._record}> Record(開始) </Text>

                <Text style={styles.text} onPress={this._pause}> Pause(暫停) </Text>
                <Text style={styles.text} onPress={this._resume}> Resume(繼續) </Text>
                <Text style={styles.text} onPress={this._stop}> Stop(結束) </Text>
                <Text style={styles.text} onPress={this._play}> Play(播放) </Text>
               

                <Text style={styles.text}>
                    {
                        recording ? '正在录音' :
                            pause ? '已暂停' : '未开始'
                    }
                </Text>
                <Text style={styles.text}>時間長: {currentTime}</Text>
            </View>


        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        marginVertical: 10,
    }
})
