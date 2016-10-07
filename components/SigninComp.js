'use strict';

import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
    AppRegistry,
    StyleSheet,
    View,
    TouchableHighlight} from 'react-native'

import SmartScrollView from 'react-native-smart-scroll-view';
import Button from 'react-native-button';
import Loader from './Loader.js'

var t = require('tcomb-form-native');
var Form = t.form.Form;

var regExpLogin = new RegExp("^[a-z0-9_-]{3,16}$", 'i');

var Name = t.refinement(t.String, function (str) { return str.length >= 3 &&  str.length <= 16 && regExpLogin.test(str)});
Name.getValidationErrorMessage = function (value, path, context) {
    return 'неверный формат логина';
};
var Password = t.refinement(t.String, function (str) { return str.length >= 6});
Password.getValidationErrorMessage = function (value, path, context) {
    return 'слишком мало символов';
};

var Person = t.struct({
    name: Name,
    password: Password
});

var options = {

    fields: {
        name: {
            label: 'Логин:',
            placeholder:'Логин',
            underlineColorAndroid: "transparent"
        },
        password: {
            label: 'Пароль:',
            placeholder:'Пароль',
            secureTextEntry: true,
            underlineColorAndroid: "transparent"
        }
    }
};

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {internet:false};

    }

    onChange(value) {
        this.setState({ value });
    }
    render() {
        return (

            <SmartScrollView
                contentContainerStyle = { styles.contentContainerStyle }
                forceFocusField       = { this.state.focusField }
                scrollPadding         = { 10 }
                >
                <Form
                    ref="form"
                    type={Person}
                    options={options}
                    value={this.state.value}
                    onChange={this.onChange.bind(this)}
                    />

                <View>
                    {(this.state.internet
                        ? <Loader style={styles.preloader}></Loader>
                        :  <Button
                        containerStyle={styles.button}
                        style = {styles.buttonText}
                        onPress={this.onPress.bind(this)}
                        >
                        Войти
                    </Button>
                    )}
                </View>
            </SmartScrollView>


        );
    }
    onPress() {
        // call getValue() to get the values of the form
        var value = this.refs.form.getValue();

        if (value) { // if validation fails, value will be null
            this.setState({
                internet:true
            });
            fetch('http://hardteddy.ru/api/user/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: value.name,
                    password: value.password
                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    this.setState({
                        internet:false
                    });
                    console.log('response: '+ responseJson);
                    console.log('status: '+ responseJson.status);
                    console.log('irissessionid: '+ responseJson.body.irissessionid);
                    console.log('body.request: ' + responseJson.body.request);
                })
                .catch((error) => {
                    this.setState({
                        internet:false
                    });
                    console.log(error)
                });
        }
    }
}

var styles = StyleSheet.create({
    title: {
        fontSize: 30,
        alignSelf: 'center',
        marginBottom: 30
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
    },
    contentContainerStyle: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
        alignItems: 'stretch'
    }
});

module.exports = SignIn;