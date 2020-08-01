import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ListItem, Header } from 'react-native-elements'
import RNFS from 'react-native-fs';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AudioUtils } from 'react-native-audio';
import { ScrollView } from 'react-native-gesture-handler';


export default class history extends Component {
    state = {
        response: [],
        refresh: true
    }
    refunction(){
        
        setState:({refresh:false})
    }
    componentDidMount() {
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
                            // console.log(result[i].name);
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

    render() {
        let { response } = this.state;
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
                                    onPress={() => navigation.navigate('播放', { url: l.path, time: 5 ,name: l.name})}
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
