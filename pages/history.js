import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import RNFS from 'react-native-fs';
import { AudioUtils } from 'react-native-audio';

//import WordFile from'./WordFile';


export default class history extends Component {


    // 读取目录
    async readDir() {
        // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
        //"data/user/0/com.helloworld2/files"
        //音檔
        var reg = new RegExp("^.*aac.*$");

        const res = await RNFS.readDir(AudioUtils.DocumentDirectoryPath)
            .then((result) => {

                if (result && result.length > 0) {
                    result = result.filter(item => item.isFile());
                    for (let i = 0, len = result.length; i < len; i++) {
                        // resP[i] = RNFS.readFile(result[i].path, 'utf8')
                        //resP[i] = this.readFile(result[i].path, result[i].name);
                        if (reg.test(result[i].name)) {
                            console.log(result[i].name + "大小" + result[i].size);
                        }

                    }
                }


                // stat the first file
                return Promise.all([RNFS.stat(result[0].path), result[0].path]);
            })
            .then((statResult) => {
                if (statResult[0].isFile()) {
                    // if we have a file, read it
                    return RNFS.readFile(statResult[1], 'utf8');
                }

                return 'no file';
            })
            .then((contents) => {
                // log the file contents
                console.log(contents);
            })
            .catch((err) => {
                console.log(err.message, err.code);
            });
        //     .then((result) => {

        //         const resP = [];
        //         if (result && result.length > 0) {
        //             result = result.filter(item => item.isFile());
        //             for (let i = 0, len = result.length; i < len; i++) {
        //                 // resP[i] = RNFS.readFile(result[i].path, 'utf8')
        //                 resP[i] = this.readFile(result[i].path, result[i].name);
        //             }
        //         }
        //         return Promise.all(resP);
        //     })
        //     .then((statResult) => {
        //         return statResult;
        //     })
        //     .catch((err) => {
        //         console.log(err.message, err.code);
        //     });

        // console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++')
        // console.log(res, 'end of read')
        // return res;
    }

    // // 读取目录
    // readDir1() {
    //     RNFS.readDir(defaultPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
    //         .then((result) =& gt; {
    //         console.log('GOT RESULT', result);
    //         console.log('++++++++++++++++++++++++++++++++++++++++')
    //         console.log(result.length)
    //         console.log('================================================')

    //         // stat the first file
    //         return Promise.all([RNFS.stat(result[0].path), result[0].path]);
    //     })
    //             .then((statResult) =& gt; {
    //         console.log(statResult)
    //         if (statResult[0].isFile()) {
    //             // if we have a file, read it
    //             return RNFS.readFile(statResult[1], 'utf8');
    //         }

    //         return 'no file';
    //     })
    //             .then((contents) =& gt; {
    //         // log the file contents
    //         console.log('=======================================================')
    //         console.log(contents, 'content');
    //     })
    //             .catch ((err) =& gt; {
    //         console.log(err.message, err.code);
    //     });
    // }
    // 删除文件
    async deleteFile(filePath) {
        const path = AudioUtils.DocumentDirectoryPath;
        const res = await RNFS.unlink(path)
            .then(() => {
                console.log('FILE DELETED');
            })
            .catch((err) => {
                console.log(err.message);
            })
        return res;
    }
    getPath() {
        return 'file://'.concat(destPath);
    }
    // 判断文件路径是否存在
    isFilePathExists(successCallback) {
        RNFS.exists(destPath)
            .then((value) => {
                successCallback(value);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    /*创建目录*/
    //     async mkDir() {
    //         const options = {
    //             NSURLIsExcludedFromBackupKey: true, // iOS only
    //         };

    //         return await RNFS.mkdir(defaultPath, options)
    //             .then((res) =& gt; {
    //             console.log('MKDIR success', res);
    //             return true;
    //         }).catch ((err) =& gt; {
    //             console.log('err', err);
    //         });
    //     }
    // }


    render() {

        // let time = this.state;
        // const { navigation } = this.props;
        // let { play, pause } = this.state;

        return (
            <View>
                <Text>FGHNFGNFGNFG</Text>
                <Button title="read"
                    onPress={() => this.readDir()} />
            </View>
        )
    }

}
