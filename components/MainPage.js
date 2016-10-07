import React from 'react';
import {PropTypes} from "react";
import {StyleSheet, Text, View} from "react-native";
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';

const contextTypes = {
    drawer: React.PropTypes.object,
};

const propTypes = {
    name: PropTypes.string,
    sceneStyle: View.propTypes.style,
    title: PropTypes.string,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        borderWidth: 2,
        borderColor: 'red',
    }
});

const Main = (props, context) => {
    const drawer = context.drawer;
    return (
        <View style={[styles.container, props.sceneStyle ]}>
            <Text>Tab {props.title}</Text>

            <Button onPress={Actions.pop}>Back</Button>
            <Button onPress={() => { drawer.close(); Actions.tab3(); }}>Switch to tab3</Button>
            <Button onPress={() => { drawer.close(); Actions.tab4(); }}>Switch to tab4</Button>
            <Button onPress={() => { drawer.close(); Actions.tab5(); }}>Switch to tab5</Button>
            <Button onPress={() => { drawer.close(); Actions.echo(); }}>push new scene</Button>
        </View>
    );
};

Main.contextTypes = contextTypes;
Main.propTypes = propTypes;

export default Main;
//'use strict';
//
//import React, { Component } from 'react';
//import { View, Text, StyleSheet, Image } from 'react-native';
//import Button from "react-native-button";
//import { Actions } from 'react-native-router-flux';
//
//export default class Launcher extends Component {
//    render() {
//        return (
//
//            <View style={styles.container}>
//                <Text>Это главная страничка</Text>
//                {this.props.session &&
//                <Text>{this.props.session}</Text>
//                }
//
//            </View>
//        )
//    }
//
//}
//const styles = StyleSheet.create({
//    container: {
//        flex: 1,
//        justifyContent: 'center',
//        backgroundColor: '#ffffff',
//        padding: 20
//    },
//    containerIcon: {
//        justifyContent: 'center',
//        alignItems: 'center'
//    },
//    icon: {
//        tintColor: '#8e44ad',
//        width: 120,
//        height: 170
//
//    },
//    textStyle: {
//        color: 'white',
//        textAlign: 'center'
//    },
//    textStyle6: {
//        color: '#8e44ad',
//        textAlign: 'center'
//    },
//    buttonStylePressing: {
//        borderColor: 'red',
//        backgroundColor: 'red'
//    },
//    buttonStyle6: {
//        borderColor: '#8e44ad',
//        backgroundColor: '#8e44ad',
//        borderRadius: 3,
//        borderWidth: 3,
//        padding: 10
//    },
//    buttonStyle7: {
//        borderColor: '#8e44ad',
//        backgroundColor: '#ffffff',
//        borderRadius: 3,
//        borderWidth: 3,
//        padding: 10,
//        marginVertical: 15
//    }
//
//});