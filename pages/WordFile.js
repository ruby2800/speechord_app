import React, { Component } from 'react';
import { Share, useIsFocused, StyleSheet, View, BackHandler, Modal, TouchableHighlight, SafeAreaView, TextInput, FlatList, ActivityIndicator, ScrollView, RefreshControl, PermissionsAndroid, Alert } from 'react-native';
import { Header, Slider, Icon, Input, Button } from 'react-native-elements'
import Sound from 'react-native-sound'
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { BottomNavigation, Text, FAB, Portal, Provider } from 'react-native-paper';
import RNFS from 'react-native-fs';
import { cos } from 'react-native-reanimated';
import Highlighter from 'react-native-highlight-words';

let whoosh;

export default class App extends React.Component {
    // constructor(props) {
    //     super(props);

        state = {
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

            summ: [],
            summ_data: [],
            summ_HighL:[],
            trans: [],
            trans_data: [],
            transInputDisableHolder:false,
            summInputDisableHolder:false,
            borderStatus: false ,
            textTrans:'',
            textSumm:'',
            refreshing: false,
            // isLoading: false,
            index: 0,
            routes: [
                { key: 'trans', title: '逐字稿', icon: 'text-to-speech', color: '#5C9FCC' },
                { key: 'summ', title: '摘要稿', icon: 'text-short', color: '#296C99' },
            ],
            response: [],
            numberOfsummary: 'EX: "5"',
            text: '',
        // };
    }

        //forRefresh
        _onRefresh = () => {
            console.log("refresh")
            whoosh.stop();
            this.setState({      
                play: false,
            })
            this.setState({ refreshing: true });
            this.componentDidMount()
                .then(() => {
                    this.setState({ refreshing: false });
                });
            this.wait(6000).then(() => {
                this.setState({ refreshing: false });
                //Alert message
            });
        }
    
        wait = (timeout) => {
            return new Promise(resolve => {
                setTimeout(resolve, timeout);
            });
        }

    async componentDidMount() {

        // whoosh.stop();
        // this.setState({      
        //     play: false,
        // })
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

        /*用server資料的時候*/
        let formData = new FormData();
            formData.append('userName', this.props.route.params.username);
            formData.append('fileName', this.props.route.params.name);

        const response = fetch(`http://140.115.81.199:9943/textFetch`,
            {
                method: 'POST',
                // headers: {
                //   Accept: 'application/json',
                //   'Content-Type': 'multipart/form-data'
                // },
                body: formData
            })
            .then((resp) => { return resp.json() })
            .then((json) => {
                console.log("JSONSUMhere"+json.summary)

                    //Transcript
                // const transSTR = JSON.stringify(json.transcript);
                // const transdata = transSTR.replace(/\\/g, ""); 
                // const joinT = transdata.split("n"); 
                // const replaceT=joinT.join(`\n`);
                // const transData = replaceT.slice(1,-1); 
                const transSTR = JSON.stringify(json.transcript).replace(/\\/g, "").split("n").join(`\n`);
                const transData = transSTR.slice(1, -1);

                    //Summary
                // const summSTR = JSON.stringify(json.summary);     //"我n愛n你"
                // const summdata = summSTR.split("n");              //“我，愛，你”
                // const joinS = summdata.join(`\n`);                //“我    愛     你”
                // const summData = joinS.slice(1,-1);               //我    愛     你
                // const summSTR = JSON.stringify(json.summary).replace(/\\/g, "").split("n").join(`\n` + "- ");
                // const summData = summSTR.replace(/['"]+/g, "- ").slice(0, -4);
                //.replace(/\s/g, '') for space .replace(/\\/g, "") for slash(\) .replace(/-/g, "") for hyphen(-)
                const sum = JSON.stringify(json.summary).replace(/\\/g, "").replace(/-/g, "").replace(/\s/g, "")
                const sumHighL = sum.replace(/['"]+/g, "n").split('n')
                const summSTR = JSON.stringify(json.summary).replace(/-/g, "").replace(/\s/g, "").split('\\n').join(`\n` + "- ")
                const summData = ("- "+summSTR.replace(/['"]+/g, ""))
                

                this.setState({ summ_HighL:sumHighL, summ: json.summary, summ_data: summData, trans: json.transcript, trans_data: transData, isLoading: true });
                console.log(this.state.summ_HighL)
                console.log(sum.replace(/['"]+/g, "n"))
                console.log(JSON.stringify(json.summary).replace(/\\/g, "").replace(/-/g, ""))
                console.log(JSON.stringify(json.summary).replace(/\\/g, "").replace(/-/g, "").replace(/\s/g, ""))
                console.log("n"+JSON.stringify(json.summary).replace(/\\/g, "").replace(/-/g, "").replace(/\s/g, "").split('n'))
            });



        // /*用假資料的時候*/
        //     const response = await fetch('https://gist.githubusercontent.com/kiwi9823/2cf7242d8f10b04e77aa72acd246462e/raw/4199f0a385da9a5585462f262d4de48d8a882beb/test.json');
        //     const json = await response.json();

        //         const transSTR = JSON.stringify(json.transcript).replace(/\\/g, "").split("n").join(`\n`);
        //         const transData = transSTR.slice(1, -1);

        //         const summSTR = JSON.stringify(json.summary).replace(/\\/g, "").split("n").join(`\n` + "- ").replace("-","");
        //         const summData = summSTR.replace(/['"]+/g, "- ").slice(0, -4);

        //         this.setState({ summ: json.summary, summ_data: summData, trans: json.transcript, trans_data: transData, isLoading: false, visible: true });
    }

    componentWillUnmount() {
        this.time && clearTimeout(this.time);
    }

    backAction = async () => {
        this._stop();
        this.props.navigation.navigate('歷史紀錄');
        this.setState({
            // volume: 0.5,
            // seconds: 0, //秒數
            // totalMin: '', //總分鐘
            // totalSec: '', //總秒數
            // nowMin: 0, //目前分鐘
            // nowSec: 0, //目前秒鐘
            // maximumValue: 0, //滑輪直
            // play: false,
            // pause: false,
            // resume: false,
            play: false,
            pause: false,
            resume: false,
            nowMin: 0,
            nowSec: 0,
            seconds: 0,

            summ: [],
            summ_data: [],
            trans: [],
            trans_data: [],
            transInputDisableHolder:false,
            summInputDisableHolder:false,
            borderStatus:false,
            textTrans:'',
            textSumm:'',
            
            isLoading: false,
            index: 0,
            routes: [
                { key: 'trans', title: '逐字稿', icon: 'text-to-speech', color: '#5C9FCC' },
                { key: 'summ', title: '摘要稿', icon: 'text-short', color: '#296C99' },
            ],
            response: [],
            numberOfsummary: 'EX: "5"',
            text: '',
        })
        clearInterval(this.time);
        console.log("close")
        whoosh.pause();
    };

    // 播放
    _play = () => {
        this.setState({ pause: false, play: true })

        if (this.state.resume == false) {
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
        else {
            whoosh.play(success => {
                if (success) {
                    console.log('success - 播放成功')
                    this._stop();
                }
                else {
                    console.log('fail - 播放失败')
                }
            })
            console.log("resume")
            this.setState({ resume: false, pause: false, play: true })
            console.log("play" + this.state.resume)
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
        this.setState({ pause: true, play: false, resume: true })
        console.log("pause" + this.state.resume)
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

    onChangedTrans(text) {
        console.log("Transcript Editing")
        let newText = '';

        for (var i = 0; i < text.length; i++) {
                newText = newText + text[i];
            }
        this.setState({ textTrans: newText });
    }

    editTrans = () => {
        console.log("Trans Editable")
        this.setState({ transInputDisableHolder: true, borderStatus: true}) 
    }

    saveTrans = () => {
        console.log('Save transEdit')
        this.setState({transInputDisableHolder:false, borderStatus: false})

        if(this.state.textTrans === ''){
            let formData = new FormData();
            formData.append('userName', this.props.route.params.username);
            formData.append('fileName', this.props.route.params.name);
            formData.append('modCont', this.state.trans_data);                    

                fetch(`http://140.115.81.199:9943/transUpdate`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data'
                    },
                    body: formData
                })
                .then(response => {
                    console.log("saveTrans"+response.status);
                })
                .catch(error => {
                    console.log("error", error)
                })
                this.setState({
                    summ: [],
                    summ_data: [],
                    trans: [],
                    trans_data: [],
                    textTrans:'',
                    textSumm:'',
                    isLoading: false,
                    routes: [
                        { key: 'trans', title: '逐字稿', icon: 'text-to-speech', color: '#5C9FCC' },
                        { key: 'summ', title: '摘要稿', icon: 'text-short', color: '#296C99' },
                    ],
                    response: [],
                })
                this.componentDidMount()
                    .then(() => {
                        this.setState({ refreshing: false });
                    });
                this.wait(5000).then(() => {
                    this.setState({ refreshing: false });
                    //Alert message
                });
        }
        else{
            let formData = new FormData();
                formData.append('userName', this.props.route.params.username);
                formData.append('fileName', this.props.route.params.name);
                formData.append('modCont', this.state.textTrans);                    

            fetch(`http://140.115.81.199:9943/transUpdate`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            })
            .then(response => {
                console.log("saveTrans"+response.status);
            })
            .catch(error => {
                console.log("error", error)
            })
            this.setState({
                summ: [],
                summ_data: [],
                trans: [],
                trans_data: [],
                textTrans:'',
                textSumm:'',
                isLoading: false,
                routes: [
                    { key: 'trans', title: '逐字稿', icon: 'text-to-speech', color: '#5C9FCC' },
                    { key: 'summ', title: '摘要稿', icon: 'text-short', color: '#296C99' },
                ],
                response: [],
            })
            this.componentDidMount()
                .then(() => {
                    this.setState({ refreshing: false });
                });
            this.wait(5000).then(() => {
                this.setState({ refreshing: false });
                //Alert message
            });
        }   
    }

    trans_download = () => {
        // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
        // // create a path you want to write to
        // // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
        // // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
        var date = new Date().getDate(); //To get the Current Date
        var month = new Date().getMonth() + 1; //To get the Current Month
        var year = new Date().getFullYear(); //To get the Current Year
        var hours = new Date().getHours(); //To get the Current Hours
        var min = new Date().getMinutes(); //To get the Current Minutes

        // var path = RNFS.DownloadDirectoryPath + `/trans${this.props.route.params.name}_${year}${month}${date}_${hours}${min}.txt`;
        // console.log(path);
        // // write the file
        // RNFS.writeFile(path, this.state.trans_data, 'utf8')
        //     // RNFS.writeFile(path, this.state.tran, 'utf8')
        //     .then((success) => {
        //         Alert.alert(
        //             "Download File",
        //             "Success!",
        //             [
        //                 // {
        //                 //   text: "Cancel",
        //                 //   onPress: () => console.log("Cancel Pressed"),
        //                 //   style: "cancel"
        //                 // },
        //                 { text: "OK", onPress: () => console.log("Transcript Download Success") }
        //             ],
        //             { cancelable: false }
        //         );
        //         console.log('FILE WRITTEN!');
        //     })
        //     .catch((err) => {
        //         console.log(err.message);
        //     });

        Share.share({ message: this.state.trans_data, title : `trans${this.props.route.params.name}_${year}/${month}/${date}_${hours}:${min}.txt` })
        //after successful share return result
        .then(result => console.log(result))
        //If any thing goes wrong it comes here
        .catch(errorMsg => console.log(errorMsg));
    }

    Transcript = () => {
        const [state, setState] = React.useState({ open: false });
        const onStateChange = ({ open }) => setState({ open });
        const { open } = state;

        return (
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 15, paddingBottom:30}}>

                    {
                    // Display the content in screen when state object "content" is true.
                    // Hide the content in screen when state object "content" is false. 
                    this.state.transInputDisableHolder 
                    ? 
                        <Button
                        title="Save Edit"
                        type="clear"
                        onPress={this.saveTrans}
                        /> 
                    : 
                    null
                    }
                                
                <ScrollView>

                    <TextInput 
                        onChangeText={text=> this.onChangedTrans(text)}
                        multiline={true} 
                        editable={this.state.transInputDisableHolder}     
                        style={ this.state.borderStatus ? styles.editBorder : styles.transNoBorder}                                               
                    >
                        
                        <Highlighter
                    highlightStyle={{backgroundColor: 'yellow'}}
                    searchWords={this.state.summ_HighL}
                    textToHighlight={this.state.trans_data+"\n"}
                />
                    </TextInput>
                </ScrollView>

                <Provider>
                    <Portal>
                        <FAB.Group
                            open={open}
                            icon={open ? 'close' : 'plus'}
                            fabStyle={{ backgroundColor: "rgba(231,76,60,1)" }}

                            actions={[
                                // { icon: 'plus', onPress: () => console.log('Pressed add') },
                                {
                                    icon: 'format-title',
                                    label: '編輯',
                                    onPress: () => this.editTrans(),
                                },
                                {
                                    icon: 'share',
                                    label: '匯出',
                                    onPress: () => this.trans_download(),
                                },
                            ]}

                            onStateChange={onStateChange}
                            onPress={() => {
                                if (open) {
                                    // do something if the speed dial is open
                                }
                            }}
                        />
                    </Portal>
                </Provider>
            </SafeAreaView>
        );
    }

    Summary = () => {
        const [state, setState] = React.useState({ open: false });
        const onStateChange = ({ open }) => setState({ open });
        const { open } = state;

        // const styles = StyleSheet.create({
        //     centeredView: {
        //         flex: 1,
        //         justifyContent: "center",
        //         alignItems: "center",
        //         marginTop: 22,
        //     },
        //     modalView: {
        //         margin: 20,
        //         backgroundColor: "white",
        //         borderRadius: 20,
        //         padding: 30,
        //         alignItems: "center",
        //         shadowColor: "blue",
        //         shadowOffset: {
        //             width: 0,
        //             height: 2
        //         },
        //         shadowOpacity: 5,
        //         shadowRadius: 3.84,
        //         elevation: 100
        //     },
        //     openButton: {
        //         backgroundColor: "#F194FF",
        //         borderRadius: 10,
        //         padding: 10,
        //         elevation: 2
        //     },
        //     textStyle: {
        //         color: "white",
        //         fontWeight: "bold",
        //         textAlign: "center"
        //     },
        //     modalText: {
        //         marginBottom: 15,
        //         textAlign: "center",
        //         color: "black",
        //         fontSize: 18,
        //         fontWeight: "bold",
        //     },
        //     editBorder: {
        //         borderColor:"lightblue",
        //         borderWidth:2,
        //         fontSize: 16, 
        //         color:"black"
        //     },
        //     noBorder: {
        //         borderWidth:0,
        //         fontSize: 16, color:"black"
        //     },
        // });

        const [modalVisible, setModalVisible] = React.useState(false);
        //   const [value, onChangeText] = React.useState('');

        return (
            <SafeAreaView style={{ flex: 1, paddingHorizontal:15, paddingBottom: 15 }}>
                {/* < ScrollView refreshControl={
                    < RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />}
                > */}

                    {
                    // Display the content in screen when state object "content" is true.
                    // Hide the content in screen when state object "content" is false. 
                    this.state.summInputDisableHolder 
                    ? 
                        <Button
                        title="Save Edit"
                        type="clear"
                        onPress={this.saveSumm}
                        /> 
                    : 
                    <Text style={{ textAlign: "center", color: 'grey', paddingTop:15}}>** 可在右下功能鍵中自由設定摘要句數</Text>
                    }

                <ScrollView>
                    <TextInput 
                        onChangeText={text=> this.onChangedSumm(text)}
                        multiline={true} 
                        editable={this.state.summInputDisableHolder}     
                        style={this.state.borderStatus ? styles.editBorder : styles.noBorder}                              
                    >
                        {this.state.summ_data+"\n"}
                    </TextInput>
                </ScrollView>

                {/* </ScrollView> */}
                {/* <FlatList
                    data={this.state.summ}
                    extraData={state}
                    keyExtractor={({ id }, index) => id}
                    renderItem={({ item }) => (
                      <View>
                        <Text style={{ fontSize: 15 }}>{item.text}{"\n"}</Text>
                      </View>
                    )}
                />  */}

                <Provider>
                    <Portal>
                        <FAB.Group
                            open={open}
                            icon={open ? 'close' : 'plus'}
                            fabStyle={{ backgroundColor: "rgba(231,76,60,1)" }}

                            actions={[
                                {
                                    icon: 'sort',
                                    label: '設定',
                                    onPress: () => setModalVisible(true),
                                },
                                {
                                    //   icon: 'format-title',
                                    icon: 'format-title',
                                    label: '編輯',
                                    onPress: () => this.editSumm(),
                                },
                                {
                                    icon: 'share',
                                    label: '匯出',
                                    onPress: () => this.summ_download(),
                                },
                            ]}

                            onStateChange={onStateChange}
                            onPress={() => {
                                if (open) {
                                    // do something if the speed dial is open
                                }
                            }}
                        />
                    </Portal>
                </Provider>
                <View style={styles.centeredView}>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>請輸入摘要句數：</Text>
                                <TextInput
                                    keyboardType='numeric'
                                    style={{ height: 40, width: 130, backgroundColor: 'lightgray', marginBottom: 15, paddingHorizontal: 10 }}
                                    onChangeText={(text) => this.onChanged(text)}
                                    placeholder={this.state.numberOfsummary}
                                    maxLength={100}  //setting limit of input
                                />
                                <View style={{ flexDirection: 'row' }}>
                                    <TouchableHighlight
                                        style={{ ...styles.openButton, backgroundColor: "#2196F3", marginRight: 10 }}
                                        onPress={() => {
                                            setModalVisible(!modalVisible);
                                            this.getNumofSummary(this.state.numberOfsummary)
                                        }}
                                    >
                                        <Text style={styles.textStyle}>提交</Text>
                                    </TouchableHighlight>

                                    <TouchableHighlight
                                        style={{ ...styles.openButton, backgroundColor: "grey" }}
                                        onPress={() => {
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.textStyle}>關閉</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        );
    }

    onChanged(text) {
       
        let newText = '';
        let numbers = '0123456789';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
            else {
                // your call back function
                alert("please enter numbers only");
            }
        }
        this.setState({ numberOfsummary: newText });
    }

    getNumofSummary = (numberOfsummary) => {

        this.setState({ refreshing: true });
        console.log(this.state.numberOfsummary);

        let formData = new FormData();
            formData.append('userName', this.props.route.params.username);
            formData.append('fileName', this.props.route.params.name);

        fetch(`http://140.115.81.199:9943/sumSet/${numberOfsummary}`,
        {
            method: 'POST',
            // headers: {
            //     Accept: 'application/json',
            //     'Content-Type': 'multipart/form-data'
            // },
            body: formData
        })
        .then(response => {
            console.log("getNumofSummary"+response.status);
        })
        .catch(error => {
            console.log("error", error)
        })
        this.setState({
            summ: [],
            summ_data: [],
            trans: [],
            trans_data: [],
            isLoading: false,
            routes: [
                { key: 'trans', title: '逐字稿', icon: 'text-to-speech', color: '#5C9FCC' },
                { key: 'summ', title: '摘要稿', icon: 'text-short', color: '#296C99' },
            ],
            response: [],
        })
        this.componentDidMount()
            .then(() => {
                this.setState({ refreshing: false });
            });
        this.wait(5000).then(() => {
            this.setState({ refreshing: false });
            //Alert message
        });
    }

    onChangedSumm(text) {
        console.log("Summary Editing")
        let newText = '';

        for (var i = 0; i < text.length; i++) {
                newText = newText + text[i];
            }
        this.setState({ textSumm: newText });
    }

    editSumm = () => {
        console.log("Sum Editable")
        this.setState({ summInputDisableHolder: true, borderStatus: true}) 
    }

    saveSumm = () => {
        console.log('Save sumEdit')
        this.setState({summInputDisableHolder:false, borderStatus: false})

        if(this.state.textSumm === ''){
            let formData = new FormData();
            formData.append('userName', this.props.route.params.username);
            formData.append('fileName', this.props.route.params.name);
            formData.append('modCont', this.state.summ_data);                    

            fetch(`http://140.115.81.199:9943/sumUpdate`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            })
            .then(response => {
                console.log("saveSumm"+response.status);
            })
            .catch(error => {
                console.log("error", error)
            })
            this.setState({
                summ: [],
                summ_data: [],
                trans: [],
                trans_data: [],
                textTrans:'',
                textSumm:'',
                isLoading: false,
                routes: [
                    { key: 'trans', title: '逐字稿', icon: 'text-to-speech', color: '#5C9FCC' },
                    { key: 'summ', title: '摘要稿', icon: 'text-short', color: '#296C99' },
                ],
                response: [],
            })
            this.componentDidMount()
                .then(() => {
                    this.setState({ refreshing: false });
                });
            this.wait(5000).then(() => {
                this.setState({ refreshing: false });
                //Alert message
            });
        }
        else{  
            let formData = new FormData();
                formData.append('userName', this.props.route.params.username);
                formData.append('fileName', this.props.route.params.name);
                formData.append('modCont', this.state.textSumm);                    

            fetch(`http://140.115.81.199:9943/sumUpdate`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                },
                body: formData
            })
            .then(response => {
                console.log("saveSumm"+response.status);
            })
            .catch(error => {
                console.log("error", error)
            })
            this.setState({
                summ: [],
                summ_data: [],
                trans: [],
                trans_data: [],
                textTrans:'',
                textSumm:'',
                isLoading: false,
                routes: [
                    { key: 'trans', title: '逐字稿', icon: 'text-to-speech', color: '#5C9FCC' },
                    { key: 'summ', title: '摘要稿', icon: 'text-short', color: '#296C99' },
                ],
                response: [],
            })
            this.componentDidMount()
                .then(() => {
                    this.setState({ refreshing: false });
                });
            this.wait(5000).then(() => {
                this.setState({ refreshing: false });
                //Alert message
            });
        }   
    }
 
    summ_download = () => {
        // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
        // // create a path you want to write to
        // // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
        // // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
        var date = new Date().getDate(); //To get the Current Date
        var month = new Date().getMonth() + 1; //To get the Current Month
        var year = new Date().getFullYear(); //To get the Current Year
        var hours = new Date().getHours(); //To get the Current Hours
        var min = new Date().getMinutes(); //To get the Current Minutes

        // var path = RNFS.DownloadDirectoryPath + `/summ${this.props.route.params.name}_${year}${month}${date}_${hours}${min}.txt`;
        // console.log(path);
        // // write the file
        // RNFS.writeFile(path, this.state.summ_data, 'utf8')
        //     .then((success) => {
        //         Alert.alert(
        //             "摘要檔案下載",
        //             "成功!",
        //             [
        //                 // {
        //                 //   text: "Cancel",
        //                 //   onPress: () => console.log("Cancel Pressed"),
        //                 //   style: "cancel"
        //                 // },
        //                 { text: "關閉", onPress: () => console.log("Summary Download Success") }
        //             ],
        //             { cancelable: false }
        //         );
        //         console.log('sumFILE WRITTEN!');
        //     })
        //     .catch((err) => {
        //         console.log(err.message);
        //     });
        Share.share({ message: this.state.summ_data, title : `summ${this.props.route.params.name}_${year}/${month}/${date}_${hours}:${min}.txt` })
        //after successful share return result
        .then(result => console.log(result))
        //If any thing goes wrong it comes here
        .catch(errorMsg => console.log(errorMsg));
    }
    


    //forTabScreen
    _handleIndexChange = index => this.setState({ index });
    _renderScene = BottomNavigation.SceneMap({
        trans: this.Transcript,
        summ: this.Summary,
    });

    render() {
        let time = this.state;
        const { navigation } = this.props;
        let { play, pause } = this.state;
        const { isLoading } = this.state; //文件

        // if (this.props.route.params.l) {
            if (this.state.isLoading) {

                return (
                    <View style={{ flex: 1 }}>
                        <Header
                            placement="left"
                            backgroundColor='transparent'
                            containerStyle={{ width: '100%', backgroundColor: '#3488C0', borderBottomWidth: 0 }}
                            leftComponent={{
                                icon: 'close', color: '#fff', underlayColor: '#3488C0', size: 30,
                                onPress: () => this.backAction()
                            }}

                            centerComponent={{
                                text: this.props.route.params.showname,
                                style: {
                                    fontSize: 22,
                                    alignContent: 'space-around',
                                    fontWeight: 'bold',
                                    fontFamily: 'Fonts.Lato',
                                    color: 'white'
                                }
                            }}
                            //rightComponent={{ icon: 'refresh', color: '#fff', underlayColor: '#3488C0', onPress: () => this._onRefresh() }}
                        />

                        <View style={{ flex: 1, backgroundColor: 'white', flexDirection: 'column', justifyContent: 'space-around' }}>
                            {/* time&icon */}
                            <View style={{ flex: 1, paddingTop: 10, marginHorizontal: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                <View>
                                    <Text style={{ fontSize: 18 }}>{time.nowMin}:{time.nowSec}/{time.totalMin}:{time.totalSec}</Text>
                                </View>
                                {/* play&pause icon */}
                                <View>
                                    {
                                        play ?
                                            <Icon name='controller-paus' type='entypo' size={25} color="black" onPress={this._pause} />
                                            :
                                            <Icon name='controller-play' type='entypo' size={30} color="black" onPress={this._play} />
                                    }
                                </View>
                            </View>
                            {/* Slider */}
                            <View style={{ flex: 1, paddingHorizontal: 10, justifyContent: 'space-around' }}>
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

                        <View style={{ flex: 7, backgroundColor: 'white' }}>
                            <BottomNavigation
                                navigationState={this.state}
                                onIndexChange={this._handleIndexChange}
                                renderScene={this._renderScene}
                                shifting={true}
                            />
                        </View>
                    </View>
                );
            }
            else {
                return (
                    < ScrollView refreshControl={
                        < RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />}
                    >
                                <Header
                                    placement="left"
                                    backgroundColor='transparent'
                                    containerStyle={{ width: '100%', backgroundColor: '#3488C0', borderBottomWidth: 0 }}
                                    leftComponent={{
                                        icon: 'close', color: '#fff', underlayColor: '#3488C0', size: 30,
                                        onPress: () => this.backAction()
                                    }}

                                    centerComponent={{
                                        text: this.props.route.params.showname,
                                        style: {
                                            fontSize: 22,
                                            alignContent: 'space-around',
                                            fontWeight: 'bold',
                                            fontFamily: 'Fonts.Lato',
                                            color: 'white'
                                        }
                                    }}
                                    //rightComponent={{ icon: 'refresh', color: '#fff', underlayColor: '#3488C0', onPress: () => this._onRefresh() }}
                                />

                                <View style={{ backgroundColor: 'white', flexDirection: 'column', justifyContent: 'space-around' }}>
                                    {/* time&icon */}
                                    <View style={{ flex: 1, paddingTop: 15, marginHorizontal: 30, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                        <View>
                                            <Text style={{ fontSize: 18 }}>{time.nowMin}:{time.nowSec}/{time.totalMin}:{time.totalSec}</Text>
                                        </View>
                                        {/* play&pause icon */}
                                        <View>
                                            {
                                                play ?
                                                    <Icon name='controller-paus' type='entypo' size={30} color="black" onPress={this._pause} />
                                                    :
                                                    <Icon name='controller-play' type='entypo' size={30} color="black" onPress={this._play} />
                                            }
                                        </View>
                                    </View>
                                    {/* Slider */}
                                    <View style={{ flex: 1, paddingHorizontal: 10, justifyContent: 'space-around' }}>
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

                                <View >
                                    {/* <Text style={{textAlign:'center', fontSize:20, fontWeight:"bold", padding:30}}>Network Error!!!</Text> */}
                                    <Text style={{ textAlign: 'center', margin: 30, fontSize: 15, color: "grey" }}>下拉重新整理</Text>
                                    <Text style={{ textAlign: 'center', fontSize: 18, color: "black", textDecorationLine:"underline"}}> 以下幾點可能造成無法顯示文字稿：</Text>
                                    <View style={{alignSelf:"center",  width:300}}>
                                    <Text style={{ textAlign: 'left', marginTop:15, fontSize: 16, color: "black" }}>1. 音檔尚未上傳{'\n'}2. 網路異常{'\n'}...</Text></View>
                                </View>                               
                  </ ScrollView>
                );
            }
    }

}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        shadowColor: "blue",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 5,
        shadowRadius: 3.84,
        elevation: 100
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 10,
        padding: 10,
        paddingHorizontal:18,
        elevation: 2
    },
    textStyle: {
        fontSize:15,
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
    },
    editBorder: {
        borderColor:"lightblue",
        borderWidth:2,
        fontSize: 16, 
        color:"black"
    },
    noBorder: {
        borderWidth:0,
        fontSize: 16, color:"black"
    },
    transNoBorder: {
        paddingTop:15,
        borderWidth:0,
        fontSize: 16, color:"black"
    },
});
