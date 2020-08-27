import React, { Component, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, ScrollView, RefreshControl, BackHandler } from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { ListItem, Header, Icon } from 'react-native-elements'
import RNFS from 'react-native-fs';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AudioUtils } from 'react-native-audio';
// import { ScrollView } from 'react-native-gesture-handler';

import Upload from 'react-native-background-upload'
import prompt from 'react-native-prompt-android';



const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}



export default class history extends Component {


    state = {
        response: [],
        refreshing: false,
        startread: 0,
        output: [],


    }
    _onRefresh = () => {
        this.setState({ refreshing: true });
        this.ReadDir().then(() => {
            this.setState({ refreshing: false });
        });
    }



    componentDidMount() {


        backAction = async () => {
            this.props.navigation.navigate('歷史紀錄');
        };
        BackHandler.addEventListener("hardwareBackPress", backAction);
        this.ReadDir();
    }

    // 读取目录
    async ReadDir() {
        let { startread, output } = this.state;
        await RNFS.readDir(AudioUtils.DocumentDirectoryPath)
            .then((result) => {

                var reg = new RegExp("^.*awb.*$");

                // let output = [];


                if (result && result.length > 0) {
                    console.log(startread);

                    //每次只抓最新的
                    for (let i = startread; i < result.length; i++) {


                        if (reg.test(result[i].name) && result[i].size > 1000) {
                            console.log(result[i].name);
                            console.log(result[i].size);
                            // console.log(result[i].path);
                            let obj = { 'name': result[i].name, 'path': result[i].path, 'alreadyupload': false, 'changename': false, 'anothername': "" };

                            output.push(obj);
                            this.setState({ startread: (i + 1) })
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

    //差不多的方式可改名稱
    async deleteReadDir(deletepath) {
        let { startread, output } = this.state;
        await RNFS.readDir(AudioUtils.DocumentDirectoryPath)
            .then((result) => {

                var index;
                //json格式要用find才能解決
                this.state.output.find((a, i) => {
                    if (a.path == deletepath) {
                        index = i;
                    }
                })
                console.log("位置" + index);
                console.log(deletepath)

                output.splice(index, 1)

                this.setState({
                    response: output
                })


            })

    }

    //删除文件
    async deleteFile(filePath) {

        const path = filePath;
        const res = await RNFS.unlink(path)
            .then(() => {

                console.log('FILE DELETED');
                this.deleteReadDir(filePath);
            })
            .catch((err) => {
                console.log(err.message);
            })
        return res;
    }

    changeFilename(a) {

    }


    //沒有CONTENT TYPE
    _upload(datas, filename) {

        //let filename = this.filenames;
        let username = "testClient"
        let formData = new FormData();
        // let filename = datas;
        formData.append('userName', "testClient")
        // formdata.append('userName',name)
        formData.append('file', { uri: `file://${datas}`, name: filename, type: 'multipart/form-data' })

        let formData2 = new FormData();
        // let filename = datas;
        formData2.append('userName', "testClient")
        // formdata.append('userName',name)
        formData2.append('fileName', filename)
        //之後要抓使用者名稱

        fetch(`http://140.115.81.199:9943/audioUpload`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            })
            .then(response => {
                console.log(response.status);
            })
            .then(result => {
                console.log("success", result)
                fetch(`http://140.115.81.199:9943/bucketUpload`,
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'multipart/form-data'
                        },
                        body: formData2
                    })
                    .then(response => {
                        console.log(response.status);
                    })
                    .then(result => {
                        console.log("success", result)
                        fetch(`http://140.115.81.199:9943/textDown`,
                            {
                                method: 'POST',
                                headers: {
                                    Accept: 'application/json',
                                    'Content-Type': 'multipart/form-data'
                                },
                                body: formData2
                            })
                            .then(response => {
                                console.log(response.status);
                            })
                            .then(result => {
                                console.log("success", result)
                                fetch(`http://140.115.81.199:9943/snowDown`,
                                    {
                                        method: 'POST',
                                        headers: {
                                            Accept: 'application/json',
                                            'Content-Type': 'multipart/form-data'
                                        },
                                        body: formData2
                                    })
                                    .then(response => {
                                        console.log(response.status);

                                    })
                                    .then(result => {
                                        this.ReadDir();
                                        console.log("success", result)
                                    })
                                    .catch(error => {
                                        console.log("error", error)
                                    })
                            })
                            .catch(error => {
                                console.log("error", error)
                            })
                    })
                    .catch(error => {
                        console.log("error", error)
                    })
            })
            .catch(error => {
                console.log("error", error)
            })
    }


    render() {
        let { response } = this.state;
        const { navigation } = this.props;

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
                                response.map((l, i) => {
                                    if (!l.alreadyupload) {
                                        return (
                                            <ListItem
                                                key={i}
                                                leftIcon={{ name: 'mic' }}
                                                title={() => {
                                                    if (!l.changename) {
                                                        return <Text>{(l.name.replace("name-", "")).replace(".awb", "")}</Text>
                                                    } else {
                                                        return <Text>{l.anothername}</Text>
                                                    }
                                                }
                                                }
                                                subtitle={l.subtitle}
                                                bottomDivider
                                                rightIcon={{
                                                    name: 'cloud-upload-outline',
                                                    type: 'ionicon',
                                                    onPress: () => {
                                                        if (!l.alreadyupload) {
                                                            this._upload(l.path, (l.name.replace("name-", "")).replace(".awb", ""))
                                                            l.alreadyupload = true;
                                                            // alert(l.alreadyupload)
                                                        }
                                                        else {
                                                            alert("bug");
                                                        }
                                                    }
                                                }}
                                                onPress={() => {
                                                    if(l.changename){
                                                        navigation.navigate('播放', { url: l.path, time: 5, name: (l.name.replace("name-", "")).replace(".awb", ""),showname:(l.anothername) })
                                                    }else{
                                                        navigation.navigate('播放', { url: l.path, time: 5, name: (l.name.replace("name-", "")).replace(".awb", ""),showname:(l.name.replace("name-", "")).replace(".awb", ""), })
                                                    }
                                                   
                                                }}

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
                                                            { text: "沒有", onPress: () => console.log("OK Pressed") },
                                                            {
                                                                text: "改檔名",
                                                                onPress: () => {
                                                                    prompt(
                                                                        '改檔名',
                                                                        '輸入',
                                                                        [
                                                                            { text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                                                            {
                                                                                text: '完成', onPress: n => {
                                                                                    l.anothername = n;
                                                                                    l.changename = true;
                                                                                    console.log('name: ' + n)
                                                                                    this.ReadDir();
                                                                                }
                                                                            },
                                                                        ],
                                                                        {

                                                                            placeholder: (l.name.replace("name-", "")).replace(".awb", "")
                                                                        }
                                                                    );


                                                                }
                                                            },
                                                        ],
                                                        { cancelable: false }
                                                    );
                                                }}
                                            />
                                        )
                                    }
                                    if (l.alreadyupload) {
                                        return (
                                            <ListItem
                                                key={i}
                                                leftIcon={{ name: 'mic' }}
                                                title={(l.name.replace("name-", "")).replace(".awb", "")}
                                                subtitle={l.subtitle}
                                                bottomDivider
                                                rightIcon={{
                                                    name: 'checkmark',
                                                    type: 'ionicon',
                                                }}
                                                onPress={() => {
                                                    if(l.changename){
                                                        navigation.navigate('播放', { url: l.path, time: 5, name: (l.name.replace("name-", "")).replace(".awb", ""),showname:(l.anothername) })
                                                    }else{
                                                        navigation.navigate('播放', { url: l.path, time: 5, name: (l.name.replace("name-", "")).replace(".awb", ""),showname:(l.name.replace("name-", "")).replace(".awb", "") })
                                                    }
                                                   
                                                }}
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

                                                            { text: "沒有", onPress: () => console.log("OK Pressed") },
                                                            {
                                                                text: "改檔名",
                                                                onPress: () => {
                                                                    prompt(
                                                                        '改檔名',
                                                                        '輸入',
                                                                        [
                                                                            { text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                                                            {
                                                                                text: '完成', onPress: n => {
                                                                                    l.anothername = n;
                                                                                    l.changename = true;
                                                                                    console.log('name: ' + n)
                                                                                    this.ReadDir();
                                                                                }
                                                                            },
                                                                        ],
                                                                        {

                                                                            placeholder: (l.name.replace("name-", "")).replace(".awb", "")
                                                                        }
                                                                    );


                                                                }
                                                            },
                                                        ],
                                                        { cancelable: false }
                                                    );
                                                }}
                                            />
                                        )
                                    }
                                }


                                )
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
                            onPress={() => navigation.navigate('錄音')}
                        />
                    </View>
                </View >

            </View >


        )
    }

}