'use strict';

import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Button from "react-native-button";
import { Actions } from 'react-native-router-flux';

export default class Launcher extends Component {
    render() {
        return (

            <View style={styles.container}>

                <View style={styles.containerIcon}>
                    <Image
                        style={styles.icon}
                        source={require('../img/baby.png')}
                        />
                </View>
                <Button
                    containerStyle={styles.buttonStyle7}
                    style={styles.textStyle6}
                    onPress={Actions.signup}>
                    Регистрация
                </Button >
                <Button
                    containerStyle={styles.buttonStyle6}
                    style={styles.textStyle}
                    onPress={Actions.signin}>
                    Вход
                </Button>

            </View>
        )
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        padding: 20
    },
    containerIcon: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        tintColor: '#8e44ad',
        width: 120,
        height: 170

    },
    textStyle: {
        color: 'white',
        textAlign: 'center'
    },
    textStyle6: {
        color: '#8e44ad',
        textAlign: 'center'
    },
    buttonStylePressing: {
        borderColor: 'red',
        backgroundColor: 'red'
    },
    buttonStyle6: {
        borderColor: '#8e44ad',
        backgroundColor: '#8e44ad',
        borderRadius: 3,
        borderWidth: 3,
        padding: 10
    },
    buttonStyle7: {
        borderColor: '#8e44ad',
        backgroundColor: '#ffffff',
        borderRadius: 3,
        borderWidth: 3,
        padding: 10,
        marginVertical: 15
    }

});