import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ListItem, Header } from 'react-native-elements'
import RNFS from 'react-native-fs';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AudioUtils } from 'react-native-audio';
import { ScrollView } from 'react-native-gesture-handler';

let test = [];



// //import WordFile from'./WordFile';
// 


//ReadDir();





export default class history extends Component {
    state = {
        response: []
    }


    componentDidMount() {
        this.ReadDir();
        // this.state ={
        //     list2 : 'ruvy'
        // }


        //this.readDir();
    }

    // 读取目录
    async ReadDir() {

        await RNFS.readDir(AudioUtils.DocumentDirectoryPath)
            .then((result) => {

                var reg = new RegExp("^.*aac.*$");

                let output = [];
                let res = [];


                if (result && result.length > 0) {

                    let file_c = 0;

                    for (let i = 0; i < result.length; i++) {


                        if (reg.test(result[i].name)) {
                         //   console.log(result[i].name);
                            // console.log(result[i].path);
                            // e.preventDefault();


                            let obj = { 'name': result[i].name, 'path': result[i].path };

                            output.push(obj);
                            // console.log("push" + test);
                            //console.log(file_c);
                          //  console.log("名子" + output[file_c].name)
                            file_c++;
                            this.setState({
                                response: output
                            })

                        }

                    }
                    //我趴媽剩一點了幹就是這個啦幹
                    //幹
                    // let newArray = [...this.state.array];
                    // this.setState({ list2: output })

                }


                // console.log("CONFUSED "+ReadDir.name[3]);
                // return (
                //     output
                // )
            })

            .catch((err) => {
                console.log("錯誤" + err.message + err.code);
            });
        // console.log("結果" + res.output);

        return (
            // <View>
            //     {
            //         output.map((l, i) => (
            //             <ListItem
            //                 key={i}
            //                 // play-circle-filled
            //                 leftIcon={{ name: 'mic' }}
            //                 title={l.name}
            //                 subtitle={l.subtitle}
            //                 bottomDivider
            //                 rightIcon={{ name: 'delete' }}
            //                 onPress={() => navigation.navigate('播放', { url: l.path, time: 5 })}
            //                 onLongPress={() => {

            //                     Alert.alert(
            //                         "提醒",
            //                         "確定要刪除嗎",
            //                         [
            //                             {
            //                                 text: "確定",
            //                                 onPress: () => this.deleteFile("/data/user/0/com.helloworld2/files/'name'+1595830313260.aac"),
            //                                 style: "cancel"
            //                             },
            //                             { text: "沒有", onPress: () => console.log("OK Pressed") }
            //                         ],
            //                         { cancelable: false }
            //                     );
            //                 }}
            //             />
            //             // this.state.currentTime
            //         ))
            //     }
            // </View>

            <Text>sdfsd</Text>
        )
    }


    //删除文件
    async deleteFile(filePath) {
        const path = filePath;
        const res = await RNFS.unlink(path)
            .then(() => {
                this.ReadDir();
                console.log('FILE DELETED');
            })
            .catch((err) => {
                console.log(err.message);
            })
        return res;
    }

    render() {
        //this.ReadDir();
        response = this.state.response;
        console.log("render" + response);


        // 
        //console.log(name);
        // let time = this.state;
        // const { navigation } = this.props;
        // let { play, pause } = this.state;


        // console.log(this.list2);

        // let  {list2} = this.state;



        const list = [
            {
                name: '2020-7-27-19-58.aac',
                path: '/data/user/0/com.helloworld2/files/2020-7-27-21-0.aac'


            },
            {
                name: 'Chris Jackson',
                path: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',

            },

        ]
        const { navigation } = this.props;

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
                        text: '歷史錄音',
                        style: {
                            fontSize: 20,
                            fontWeight: 'bold',
                            fontFamily: 'Fonts.Lato',
                            color: 'white'
                        }
                    }}
                    rightComponent={{ icon: 'mic', type: 'entypo', color: '#fff', underlayColor: '#3488C0', onPress: () => { } }}
                />

                <View>
                    <Text>DFGDF</Text>
                    {/* <ReadDir /> */}
                </View>
                <ScrollView>
                    <View>
                        {
                            response.map((l, i) => (
                                <ListItem
                                    key={i}
                                    // play-circle-filled
                                    leftIcon={{ name: 'mic' }}
                                    title={l.name}
                                    subtitle={l.subtitle}
                                    bottomDivider
                                    rightIcon={{ name: 'delete' }}
                                    onPress={() => navigation.navigate('播放', { url: l.path, time: 5 })}
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
                        <Button title="read"
                            onPress={() => this.ReadDir()} />

                    </View>
                </ScrollView>
            </View>
        )
    }

}
