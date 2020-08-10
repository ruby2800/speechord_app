import React, { Component, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, ScrollView, RefreshControl, BackHandler } from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { ListItem, Header, Icon } from 'react-native-elements'
import RNFS from 'react-native-fs';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AudioUtils } from 'react-native-audio';
// import { ScrollView } from 'react-native-gesture-handler';

import Upload from 'react-native-background-upload'

// import SSHClient from 'react-native-ssh-sftp';

const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

var request = require('request');
var fs = require('fs');
var options = {
  'method': 'POST',
  'url': '140.115.81.238:5000/testUpload',
  'headers': {
    'Content-Type': 'multipart/form-data; boundary=--------------------------609497566538468192188435'
  },
  formData: {
    'file': {
      'value': fs.createReadStream('/C:/Users/ruby/Downloads/錄製.aac'),
      'options': {
        'filename': '/C:/Users/ruby/Downloads/錄製.aac',
        'contentType': null
      }
    }
  }
};
request(options, function (error, response) { 
  if (error) throw new Error(error);
  console.log(response.body);
});




export default class history extends Component {




    // a =this.props.route.params.reload;
    // console.log()


    state = {
        response: [],
        refreshing: false,

    }
    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.ReadDir().then(() => {
            this.setState({ refreshing: false });
        });
    }
    // onRefresh = React.useCallback(() => {
    //     setRefreshing(true);

    //     wait(2000).then(() => setRefreshing(false));
    // }, []);
    //    componentWillMount() {

    //     } 
    // componentWillUnmount() {
    //     BackHandler.removeEventListener("hardwareBackPress",backAction);
    // }


    componentDidMount() {


        backAction = async () => {
            this.props.navigation.navigate('歷史紀錄');
        };
        BackHandler.addEventListener("hardwareBackPress", backAction);
        this.ReadDir();
    }

    // 读取目录
    async ReadDir() {

        await RNFS.readDir(AudioUtils.DocumentDirectoryPath)
            .then((result) => {

                var reg = new RegExp("^.*aac.*$");

                let output = [];


                if (result && result.length > 0) {

                    for (let i = 0; i < result.length; i++) {

                        if (reg.test(result[i].name)) {
                            console.log(result[i].name);
                            // console.log(result[i].path);
                            let obj = { 'name': result[i].name, 'path': result[i].path };

                            output.push(obj);
                            // console.log(output[file_c].name);

                        }
                    }
                    this.setState({
                        response: output
                    })

                }
            })

            .catch((err) => {
                console.log("錯誤" + err.message + err.code);
            });

    }


    //删除文件
    async deleteFile(filePath) {

        const path = filePath;
        const res = await RNFS.unlink(path)
            .then(() => {

                console.log('FILE DELETED');
                this.ReadDir();
            })
            .catch((err) => {
                console.log(err.message);
            })
        return res;
    }


    // UploadRequest(datas) {
    //     //let BaseUrl = 'http://140.115.81.238:5000/testUpload'  // 域名地址，根据自己的修改

    //     const params = {
    //         method: 'POST',
    //         body: datas,
    //         headers: {
    //             'Content-Type': 'multipart/form-data'
    //         },
    //         timeout: 5000 // 5s超时
    //     };

    //     return fetch('http://140.115.81.238:5000/testUpload', params)
    //         .then(response => response.json())
    //         .then(data => data)
    //         .catch(error => {
    //             return { error_code: -3, error_msg: '请求异常，请重试' }
    //         })

    // }

    // requestAudio = async (params) => {
    //     let { path } = params
    //     let formData = new FormData()
    //     let soundPath = `file://${path}`  // 注意需要增加前缀 `file://`
    //     let fileName = path.substring(path.lastIndexOf('/') + 1, path.length) // 文件名
    //     let file = { uri: soundPath, type: "multipart/form-data", name: fileName } // 注意 `uri` 表示文件地址，`type` 表示接口接收的类型，一般为这个，跟后端确认一下
    //     formData.append('file', file)
    //     return await this.UploadRequest(formData) // `UploadRequest` 上传也是封装过，具体参考下面
    // }


    // _upload(file_path) {
    //     // let { stop, audioPath } = this.state
    //     //let { stop, audioPath } = this.state


    //     // 有录音
    //     let params = {
    //         path: file_path
    //     }

    //     let audioResult = this.requestAudio(params);

    //     console.log('audioResult----请求接口后返回的数据：', audioResult)


    // }

    // _upload(uri) {


        // return fetch(url)
        //     .then(function (response) {
        //         return response.json();
        //     })
        //     .then(function (json) {
        //         return {
        //             city: json.name,
        //             temperature: kelvinToF(json.main.temp),
        //             description: _.capitalize(json.weather[0].description)
        //         }
        //     })
        //     .catch(function (error) {
        //         console.log('There has been a problem with your fetch operation: ' + error.message);
        //         // ADD THIS THROW error
        //         throw error;
        //     });

        // let uriParts = uri.split('.');
        // let fileType = uriParts[uriParts.length - 1];
        // console.log(fileType);

        // let formData = new FormData();
        // formData.append('file', {
        //     uri,
        //     name: `recording.${fileType}`,
        //     type: `${fileType}`,
        // });
        // //  fetch('140.115.81.238:5000/testUpload')
        // // .then(() => {

        // fetch('140.115.81.238:5000/testUpload', {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'multipart/form-data',
        //     },
        //     body: formData
        // }).then(r => {

        //     console.log('data value:' + r)


        // }).catch((error) => {
        //     console.error(error);
        // });
        // console.log("Uploading " + uri);
        // let apiUrl = '140.115.81.238:5000/testUpload';
        // let uriParts = uri.split('.');
        // let fileType = uriParts[uriParts.length - 1];
        // console.log(fileType);



        // let options = {
        //     method: 'POST',
        //     body: formData,
        //     headers: {
        //         // 'Accept': 'application/json',
        //         'Content-Type': 'multipart/form-data',
        //     },
        // };

        // console.log("POSTing " + uri + " to " + apiUrl);
        // console.log(formData);
        // return fetch(apiUrl, options);
    // }

    _upload(file_path) {


        // let uriParts = uri.split('.');
        // let fileType = uriParts[uriParts.length - 1];

        // let formData = new FormData();
        // formData.append('file', {
        //   uri,
        //   name: `recording.${fileType}`,
        //   type: `audio/x-${fileType}`,
        // });


        let options = {

            url: 'http://140.115.81.238:5000/testUpload',
            path: file_path,
            method: 'POST',
              type: 'multipart',
             field: 'uploaded_media',
            // maxRetries: 2, // set retry count (Android only). Default 2
            headers: {
                'Content-Type': 'multipart/form-data', // Customize content-type
            },
            useUtf8Charset: true
            // Below are options only supported on Android
            // notification: {
            //     enabled: true
            // },

        }

        Upload.startUpload(options).then((uploadId) => {
            console.log('Upload started')
            console.log(file_path);
            Upload.addListener('progress', uploadId, (data) => {
                console.log(`Progress: ${data.progress}%`)
            })
            Upload.addListener('error', uploadId, (data) => {
                console.log(`Error: ${data.error}%`)
                // console.log(`Error: ${data.}%`)
            })
            Upload.addListener('cancelled', uploadId, (data) => {
                console.log(`Cancelled!`)
            })
            Upload.addListener('completed', uploadId, (data) => {
                // data includes responseCode: number and responseBody: Object
                console.log('Completed!')
            })
        }).catch((err) => {
            console.log('Upload error!', err)
        })

    }

    
    // _upload(datas) {
    //     // let BaseUrl = 'http://140.115.81.238:5000/testUpload'  // 域名地址，根据自己的修改

    //     //let { path } = params
        
    //     let formData = new FormData()
    //    // let soundPath = datas
    //      let soundPath = `file://${datas}`  // 注意需要增加前缀 `file://`
    //     // let fileName = path.substring(path.lastIndexOf('/') + 1, path.length) // 文件名
    //     let file = { uri: soundPath, type: "multipart/form-data", name:"soundPath" } // 注意 `uri` 表示文件地址，`type` 表示接口接收的类型，一般为这个，跟后端确认一下
    //     formData.append('file', file)
        
    //     const params = {
    //         method: 'POST',
    //         body: formData,
    //         headers: {
    //             'Content-Type': 'multipart/form-data'
    //         },
    //         timeout: 5000 // 5s超时
    //     };
        
    //      fetch(`http://140.115.81.238:5000/testUpload`, params)
    //         // .then(response => response.json())
    //         .then(response=>{
    //             console.log("??")
    //         })
    //         .then(data => data)
    //         .catch(error => {
    //             console.log(error)
    //             return { error_code: -3, error_msg: '请求异常，请重试' }
                
    //         })
            
    // }

    // _upload = async (params) => {
    //     let { path } = params
    //     let formData = new FormData()
    //     let soundPath = path
    //     // let soundPath = `file://${path}`  // 注意需要增加前缀 `file://`
    //     // let fileName = path.substring(path.lastIndexOf('/') + 1, path.length) // 文件名
    //     let file = { uri: soundPath, type: "multipart/form-data" } // 注意 `uri` 表示文件地址，`type` 表示接口接收的类型，一般为这个，跟后端确认一下
    //     formData.append('file', file)
    //     return await UploadRequest(formData) // `UploadRequest` 上传也是封装过，具体参考下面
    // }


    // _upload = async (path) => {
    //     requestAudio(path);
    //     // let audioResult = await requestAudio(path);

    //     // console.log('audioResult----请求接口后返回的数据：', audioResult)

    // }



    render() {
        let { response } = this.state;
        const { navigation } = this.props;
        // var refresh_h = this.props.route.params.reload;
        // const [refreshing, setRefreshing] = React.useState(false);

        // const onRefresh = React.useCallback(() => {
        //     setRefreshing(true);

        //     wait(2000).then(() => setRefreshing(false));
        // }, []);







        return (
            <View style={{ flex: 1 }} >

                {/* Header&Body */}
                < View style={{ flex: 7, backgroundColor: 'white' }}>
                    {/* <View style={{ flex: 1, }}>                     */}
                    < Header
                        backgroundColor='transparent'
                        containerStyle={{ width: '100%', backgroundColor: '#3488C0', borderBottomWidth: 0 }}
                        leftComponent={{
                            icon: 'menu', type: 'entypo', color: '#fff', underlayColor: '#3488C0',
                            onPress: () => navigation.dispatch(DrawerActions.openDrawer())
                        }}

                        centerComponent={{
                            text: '歷史錄音',
                            style: {
                                fontSize: 20,
                                fontWeight: 'bold',
                                fontFamily: 'Fonts.Lato',
                                color: 'white'

                            }
                        }}
                    // rightComponent={{ icon: 'mic', type: 'entypo', color: '#fff', underlayColor: '#3488C0', onPress: () => { } }}
                    />
                    < ScrollView refreshControl={
                        < RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />}>
                        {/* <ScrollView> */}
                        < View >
                            {
                                response.map((l, i) => (
                                    <ListItem
                                        key={i}
                                        // play-circle-filled
                                        leftIcon={{ name: 'mic' }}
                                        title={l.name}
                                        subtitle={l.subtitle}
                                        bottomDivider
                                        rightIcon={{
                                            name: 'cloud-upload-outline',
                                            type: 'ionicon',
                                            onPress: () => this._upload(l.path)
                                        }}
                                        onPress={() => navigation.navigate('播放', { url: l.path, time: 5, name: l.name })}
                                        onLongPress={() => {

                                            Alert.alert(
                                                "提醒",
                                                "確定要刪除嗎",
                                                [
                                                    {
                                                        text: "確定",
                                                        onPress: () => this.deleteFile(l.path),
                                                        style: "cancel"
                                                    },
                                                    { text: "沒有", onPress: () => console.log("OK Pressed") }
                                                ],
                                                { cancelable: false }
                                            );
                                        }}
                                    />
                                    // this.state.currentTime
                                ))
                            }
                            {/* <Button title="read"
                        onPress={() => this.ReadDir()} /> */}

                        </View >
                    </ScrollView >

                </View >

                {/* Footer */}
                < View style={{ flex: 1, backgroundColor: '#E8E8E8' }
                }>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon raised name='controller-record' type='entypo' color='red'
                            onPress={() => navigation.navigate('錄音', { record: 0 })}
                        />
                    </View>
                </View >

            </View >


        )
    }

}
