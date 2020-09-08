import React, { Component, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert, ScrollView, RefreshControl, BackHandler } from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { ListItem, Header, Icon } from 'react-native-elements'
import RNFS from 'react-native-fs';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AudioUtils } from 'react-native-audio';
// import { ScrollView } from 'react-native-gesture-handler';

// import Upload from 'react-native-background-upload'
import prompt from 'react-native-prompt-android';
import Swipeout from 'react-native-swipeout';
import * as Animatable from 'react-native-animatable';



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
        totalupload: false,
        isupload: -1
        //  isloading: true,
        //   fileloading: false


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
        this.setState({ refreshing: true });
        this.ReadDir().then(() => {
            this.setState({ refreshing: false });
        });
    }
    setStateAsync(state) {
        return new Promise((resolve) => {
            this.setState(state, resolve)
            //  console.log(state)
        });
    }


    // 读取目录
    //最新的陣列 三個陣列! == 比對 
    async ReadDir() {
        let { startread, output } = this.state;
        this.setState({
            response: [],
            output: []
        })

        RNFS.readDir(AudioUtils.DocumentDirectoryPath)
            .then(
                async (result) => {


                    var reg = new RegExp("^.*awb.*$");
                    var timeorder;

                    result.sort((a, b) => {
                        return a.mtime -
                            b.mtime
                    }).reverse();
                    //console.log(sorted_meetings)


                    if (result && result.length > 0) {

                        for (let i = 0; i < result.length; i++) {

                            if (reg.test(result[i].name) && result[i].size > 1000) {
                                // console.log(result[i].name);


                                console.log(result[i].mtime);
                                // mtime: date

                                var shortname = ((result[i].name).replace("name-", "")).replace(".awb", "");


                                await this.filestate("user", shortname, result[i].name, result[i].path);
                                //console.log(output);
                                //  await this.setState({response:output});

                                //不知為啥這個 一定要留
                                await this.setStateAsync({ response: output });

                                // let obj = { 'name': result[i].name, 'path': result[i].path, 'alreadyupload': false, 'changename': false, 'anothername': "" }; //這裡接api然後可以用string判別01
                                //要到最後才能看有沒有上傳

                                //                       this.setState({ startread: (i + 1) })
                            }

                        }
                        // asy = true;
                        // if (asy) {
                        //     this.setState({

                        //         response: output,

                        //     })
                        // }




                    }

                    //  console.log(output);
                    // this.setState({

                    //     output: []

                    // })
                })
            // .then(() => {
            //     this.setState({ response: output });
            //     
            // })

            .catch((err) => {
                console.log("錯誤" + err.message + err.code);
            });

        // 


    }
    async filestate(user, sname, fname, fpath) {

        let { startread, output } = this.state;

        var obj;
        let check = new FormData();
        // let filename = datas;
        check.append('userName', this.props.route.params.user)



        check.append('fileName', sname);


        await fetch(`http://140.115.81.199:9943/Sinon`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                body: check
            })
            .then((resp) => { return resp.json() })
            .then((json) => {
                // console.log(json)
                if (json == 1) {
                    console.log("1.yes")
                    obj = { 'name': fname, 'path': fpath, 'alreadyupload': true, 'isupload2': false, 'anothername': "" };
                } else {
                    console.log("no")
                    obj = { 'name': fname, 'path': fpath, 'alreadyupload': false, 'isupload2': false, 'anothername': "" };
                }


                output.push(obj);
            }
            )
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

                this.ReadDir();
            })
            .catch((err) => {
                console.log(err.message);
            })
        return res;
    }

    //沒有CONTENT TYPE
    _upload(datas, filename) {

        let { totalupload } = this.state;
        let test = false;

        //let filename = this.filenames;
        // let username = "testClient"
        let formData = new FormData();
        // let filename = datas;
        formData.append('userName', this.props.route.params.user)
        console.log(this.props.route.params.user)
        formData.append('file', { uri: `file://${datas}`, name: filename, type: 'multipart/form-data' })

        let formData2 = new FormData();
        // let filename = datas;
        formData2.append('userName', this.props.route.params.user)
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
                                        //必須在這判斷
                                        console.log(response.status);
                                        if (response.status == 200) {
                                        }

                                    })
                                    .then(result => {
                                        this.ReadDir();
                                        // this.setState({ isupload: false })
                                        console.log("successsf", result)
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
        //console.log(test)

    }
    _compare(a, b) {
        if (a == b) {
            return true;
        } else {
            return false;
        }
    }


    render() {
        let { totalupload, output, isupload } = this.state;
        const { navigation } = this.props;
        const swipeoutBtns = [
            {
                text: 'Delete',
                backgroundColor: 'red',
                underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                onPress: () => {
                    //this.deleteNote(item);
                },
            },
        ];
        var a=0;
        //console.log(this.props.route.params.user)
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
                    {/* <Swipeout right={swipeoutBtns} onPress>
                        <View>
                            <Text>Swipe me left</Text>
                        </View>
                    </Swipeout> */}



                    < ScrollView refreshControl={
                        < RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />}>
                        {/* <ScrollView> */}
                        < View >
                            {


                                output.map((l, i) => {
                                    //  console.log("render"+l.alreadyupload);
                                    if (!l.alreadyupload) {
                                        if (!l.alreadyupload) {

                                            return (
                                                // <Swipeout right={swipeoutBtns}>

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

                                                    rightIcon=
                                                    {
                                                        <Icon
                                                       
                                                        name= {(a==-1)?'stop' :'cloud-upload-outline'}
                                                        type= 'ionicon'
                                                       // color={this.checkIfIDExists(item.id) ? 'red' : 'grey'}
                                                        onPress= {() => {
                                                            // console.log("i"+i)
                                                            // this.setState({ isupload: i })
                                                            if (!l.alreadyupload) {
                                                               
                                                               a=-1;
                                                               console.log(a);
                                                               Alert.alert(
                                                                "提醒",
                                                                "上傳中",
                                                                [
                                                                    {
                                                                        text: "確認", onPress: () => console.log("OK Pressed")
                                                                    },
                                                                    // {
                                                                    //     text: "改檔名",
                                                                    //     onPress: () => {
                                                                    //         prompt(
                                                                    //             '改檔名',
                                                                    //             '輸入',
                                                                    //             [
                                                                    //                 { text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                                                    //                 {
                                                                    //                     text: '完成', onPress: n => {
                                                                    //                         l.anothername = n;
                                                                    //                         l.changename = true;
                                                                    //                         console.log('name: ' + n)
                                                                    //                         this.ReadDir();
                                                                    //                     }
                                                                    //                 },
                                                                    //             ],
                                                                    //             {
    
                                                                    //                 placeholder: (l.name.replace("name-", "")).replace(".awb", "")
                                                                    //             }
                                                                    //         );
    
    
                                                                    //     }
                                                                    // },
                                                                ],
                                                                { cancelable: false }
                                                            );
                                                               
                                                                // console.log("isupload"+isupload)
                                                                // console.log("i2"+i)
                                                                // console.log(this._compare(i, isupload));
                                                                //    console.log(  l.isupload)
                                                                if (this._upload(l.path, (l.name.replace("name-", "")).replace(".awb", ""))) {
                                                                    console.log("gan")
                                                                    //l.alreadyupload = true;
                                                                }
                                                                // l.alreadyupload = true;

                                                            }
                                                            else {
                                                                alert("bug");
                                                            }

                                                        }}
                                                      />
                                                    }
                                        
                                                    onPress={() => {
                                                        if (l.changename) {
                                                            navigation.navigate('文字稿', { username: this.props.route.params.user, url: l.path, time: 5, name: (l.name.replace("name-", "")).replace(".awb", ""), showname: (l.anothername), l: l.alreadyupload })
                                                        } else {
                                                            navigation.navigate('文字稿', { username: this.props.route.params.user, url: l.path, time: 5, name: (l.name.replace("name-", "")).replace(".awb", ""), showname: (l.name.replace("name-", "")).replace(".awb", ""), l: l.alreadyupload })
                                                        }

                                                    }}

                                                    onLongPress={() => {

                                                        Alert.alert(
                                                            "提醒",
                                                            "確定要刪除嗎?",
                                                            [
                                                                {
                                                                    text: "確定",
                                                                    onPress: () => console.log("OK Pressed")
                                                                },
                                                                { text: "沒有", onPress: () => console.log("OK Pressed") },
                                                                // {
                                                                //     text: "改檔名",
                                                                //     onPress: () => {
                                                                //         prompt(
                                                                //             '改檔名',
                                                                //             '輸入',
                                                                //             [
                                                                //                 { text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                                                                //                 {
                                                                //                     text: '完成', onPress: n => {
                                                                //                         l.anothername = n;
                                                                //                         l.changename = true;
                                                                //                         console.log('name: ' + n)
                                                                //                         this.ReadDir();
                                                                //                     }
                                                                //                 },
                                                                //             ],
                                                                //             {

                                                                //                 placeholder: (l.name.replace("name-", "")).replace(".awb", "")
                                                                //             }
                                                                //         );


                                                                //     }
                                                                // },
                                                            ],
                                                            { cancelable: false }
                                                        );
                                                    }}
                                                />)
                                        } else {
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
                                                                console.log(i);
                                                                // l.isupload = true;
                                                                //Alert.alert( <Animatable.Text animation="slideInDown" iterationCount={5} direction="alternate">Up and down you go</Animatable.Text>)
                                                                if (this._upload(l.path, (l.name.replace("name-", "")).replace(".awb", ""))) {
                                                                    console.log("gan")
                                                                    //l.alreadyupload = true;
                                                                }
                                                                // l.alreadyupload = true;

                                                            }
                                                            else {
                                                                alert("bug");
                                                            }

                                                        }
                                                    }}
                                                    onPress={() => {
                                                        if (l.changename) {
                                                            navigation.navigate('文字稿', { username: this.props.route.params.user, url: l.path, time: 5, name: (l.name.replace("name-", "")).replace(".awb", ""), showname: (l.anothername), l: l.alreadyupload })
                                                        } else {
                                                            navigation.navigate('文字稿', { username: this.props.route.params.user, url: l.path, time: 5, name: (l.name.replace("name-", "")).replace(".awb", ""), showname: (l.name.replace("name-", "")).replace(".awb", ""), l: l.alreadyupload })
                                                        }

                                                    }}

                                                    onLongPress={() => {

                                                        Alert.alert(
                                                            "提醒",
                                                            "確定要刪除嗎?",
                                                            [
                                                                {
                                                                    text: "重新上傳",
                                                                    style: "cancel",
                                                                    onPress: () => {
                                                                        this._upload(l.path, (l.name.replace("name-", "")).replace(".awb", ""))
                                                                    }
                                                                },
                                                                {
                                                                    text: "確定",
                                                                    onPress: () => this.deleteFile(l.path),
                                                                    
                                                                },
                                                                { text: "沒有", onPress: () => console.log("OK Pressed") },
                                                                
                                                            ],
                                                            { cancelable: false }
                                                        );
                                                    }} />
                                            )
                                        }


                                        // </Swipeout>

                                    }
                                    if (l.alreadyupload) {
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
                                                    name: 'checkmark',
                                                    type: 'ionicon',
                                                }}
                                                onPress={() => {
                                                    if (l.changename) {
                                                        navigation.navigate('文字稿', { username: this.props.route.params.user, url: l.path, time: 5, name: (l.name.replace("name-", "")).replace(".awb", ""), showname: (l.anothername), l: l.alreadyupload })
                                                    } else {
                                                        navigation.navigate('文字稿', { username: this.props.route.params.user, url: l.path, time: 5, name: (l.name.replace("name-", "")).replace(".awb", ""), showname: (l.name.replace("name-", "")).replace(".awb", ""), l: l.alreadyupload })
                                                    }

                                                }}
                                                onLongPress={() => {

                                                    Alert.alert(
                                                        "提醒",
                                                        "確定要刪除嗎?",
                                                        [
                                                            {
                                                                text: "重新上傳",
                                                                style: "cancel",
                                                                onPress: () => {
                                                                    this._upload(l.path, (l.name.replace("name-", "")).replace(".awb", ""))
                                                                }
                                                            },
                                                            {
                                                                text: "確定",
                                                                onPress: () => this.deleteFile(l.path),
                                                                
                                                            },
                                                            { text: "沒有", onPress: () => console.log("OK Pressed") },
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