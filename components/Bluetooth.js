import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Button from 'react-native-button';
export default class Bluetooth extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text >This is Bluetooth</Text>

            <Button
        containerStyle={styles.button}
    style = {styles.buttonText}
                onPress={Actions.page}>
Войти
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
    buttonText: {
        fontSize: 18,
        color: '#ffffff',
        alignSelf: 'center'
    },
    preloader: {
        alignSelf: 'center'
    },
    button: {
        height: 36,
        backgroundColor: '#8e44ad',
        borderColor: '#8e44ad',
        borderWidth: 3,
        borderRadius: 3,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    }

});

