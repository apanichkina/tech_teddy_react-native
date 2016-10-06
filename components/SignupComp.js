'use strict';

import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import {
    AppRegistry,
    StyleSheet,
    View,
    ScrollView,
    TouchableHighlight,
    Text } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';


var t = require('tcomb-form-native');
var Form = t.form.Form;
// here we are: define your domain model
var Person = t.struct({
    name: t.String,              // a required string
    email: t.String,  // an optional string
    password1: t.String,               // a required number
    password2: t.String        // a boolean
});

var options = {
    fields: {
        name: {
            label: 'Логин:',
            placeholder:'Ваш изумительный логин',
            help: 'от 3 до 16 латинских букв и цифр',
            error: 'Insert a valid email',
            underlineColorAndroid: "transparent"
        },
        email: {
            label: 'Email:',
            placeholder:'Ваша невероятная почта',
            underlineColorAndroid: "transparent"
        },
        password1: {
            label: 'Пароль:',
            placeholder:'Раз пароль',
            secureTextEntry: true,
            help: 'минимум 6 любых символов',
            underlineColorAndroid: "transparent"
        },
        password2: {
            label: 'Подтверждение пароля:',
            placeholder:'Два пароль',
            secureTextEntry: true,
            underlineColorAndroid: "transparent"
        }
    }
};

//function onPress() {
//  // call getValue() to get the values of the form
//  var value = this.refs.form.getValue();
//  if (value) { // if validation fails, value will be null
//    console.log(value); // value here is an instance of Person
//  }
//}
const Loader = React.createClass({
    render: function() {
        return (
            <View>
                <Bars size={10} color='#8e44ad' />
            </View>
        );
    }
});

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {internet:false};

    }
    render() {
        return (
            <View ref='scroll'
                  style={styles.container}
                  viewIsInsideTabBar={true} keyboardShouldPersistTaps={true}>
                { this.state.internet ? <Loader /> : null }
                <Loader />
                <Form
                    ref="form"
                    type={Person}
                    options={options}
                    />


                <TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#99d9f4'>

                    <Text style={styles.buttonText}>Зарегистрироваться</Text>

                </TouchableHighlight>



            </View>



        );
    }
    onPress() {
        // call getValue() to get the values of the form
        var value = this.refs.form.getValue();

        if (value) { // if validation fails, value will be null
            this.setState({
                internet:true
            });
            fetch('http://127.0.0.1:8080/api/user/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: value.name,
                    email: value.email,
                    password1: value.password1,
                    password2: value.password2
                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    //this.setState({
                    //  internet:false
                    //});
                    console.log(responseJson)
                    console.log(responseJson.status)
                    console.log(responseJson.body.email)
                    console.log(responseJson.body.password)
                    console.log(responseJson.body.login)
                })
                .catch((error) => {
                    console.log(error)
                });
        }

    }}

var styles = StyleSheet.create({
    container: {
        marginTop: 50,
        padding: 20,
        backgroundColor: '#ffffff'
    },
    title: {
        fontSize: 30,
        alignSelf: 'center',
        marginBottom: 30
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
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
})

module.exports = SignUp;