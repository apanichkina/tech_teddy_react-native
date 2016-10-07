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
    var MessageBarAlert = require('react-native-message-bar').MessageBar;
    var MessageBarManager = require('react-native-message-bar').MessageBarManager;
    import SmartScrollView from 'react-native-smart-scroll-view';
    import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
    import Button from 'react-native-button';
    import Loader from './Loader.js'
    const dismissKeyboard = require('dismissKeyboard')
    var t = require('tcomb-form-native');

    var Form = t.form.Form;

    //var tv = require('tcomb-validation');
    //var validate = tv.validate;

    var regExpLogin = new RegExp("^[a-z0-9_-]{3,16}$", 'i');
    var regExpEmail = new RegExp(/.+@.+\..+/i);
    var regExpPassword = new RegExp("^.{6,}$", 'i');

    var Name = t.refinement(t.String, function (str) { return str.length >= 3 &&  str.length <= 16 && regExpLogin.test(str)});
    Name.getValidationErrorMessage = function (value, path, context) {
        return 'неверный формат логина';
    };
    var Email = t.refinement(t.String, function (str) { return regExpEmail.test(str)});
    Email.getValidationErrorMessage = function (value, path, context) {
        return 'неверный формат почты';
    };
    var Password = t.refinement(t.String, function (str) { return str.length >= 6});
    Password.getValidationErrorMessage = function (value, path, context) {
        return 'слишком мало символов';
    };
    var Password2 = t.refinement(t.String, function (str) { return str == Form.password1});
    Password2.getValidationErrorMessage = function (value, path, context) {
        return 'пароли должны совпадать';
    };


// here we are: define your domain model
var Person = t.struct({
    name: Name,              // a required string
    email: Email,  // an optional string
    password1: Password,               // a required number
    password2: Password
});


function samePasswords(x) {
  return x.password1 === x.password2;
}
var Type = t.subtype(Person, samePasswords);
Type.getValidationErrorMessage = function (value) {
  if (!samePasswords(value)) {
    return 'Пароли должны совпадать';
}
};


var options = {

    fields: {
        name: {
            label: 'Логин:',
            placeholder:'Ваш изумительный логин',
            help: 'от 3 до 16 латинских букв и цифр',
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





class SignUp extends Component {
componentDidMount() {
    MessageBarManager.registerMessageBar(this.refs.alert);
}
componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
}

constructor(props) {
    super(props);
    this.state = {internet:false, options:options};

}

onChange(value) {
    this.setState({ value });
}
render() {
    return (
      <View>
      <SmartScrollView
      contentContainerStyle = { styles.contentContainerStyle }
      forceFocusField       = { this.state.focusField }
      scrollPadding         = { 10 }
      >

      <Form
      ref="form"
      type={Type}
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
        onPress={this.onPress.bind(this)}>
        Зарегистрироваться
        </Button>
        )}
      </View>

      </SmartScrollView>
      <MessageBarAlert ref="alert" />
      </View>


      );
}
onPress() {
    dismissKeyboard()
        // call getValue() to get the values of the form
        this.setState({options:options})
        var value = this.refs.form.getValue();

        if (value) {

            this.setState({
                internet:true
            });
            fetch('http://hardteddy.ru/api/user/register', {
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
                console.log(responseJson)
                console.log(responseJson.status)
                console.log(responseJson.body.email)
                console.log(responseJson.body.password)
                console.log(responseJson.body.login)
                if (responseJson.status == 0){
                    Actions.launcher({isAuthorized: true, text: 'Залогинился!'});
                    MessageBarManager.showAlert({
                      title: 'Your alert title goes here',
                      message: 'Your alert message goes here',
                      alertType: 'success'

                  });
                }
                else{
                    var msg;
                    if (responseJson.body.login.includes(1)){
                        msg = "Логин уже занят :("
                    }
                    else{
                        msg = "Неизвестная ошибка"
                    }
                    MessageBarManager.showAlert({
                      title: 'Вот так дела!',
                      message: msg,
                      alertType: 'error'

                  });
                }
                this.setState({
                 internet:false
             });
            }).catch((error) => {
                this.setState({
                 internet:false
             });
                if (error.message == "Network request failed")
                {
                    MessageBarManager.showAlert({
                        title: 'У вас был интернет, Ииии... его нет',
                        message: 'Проблемы с интернетом',
                        alertType: 'error',

                    });
                }
                else{
                    MessageBarManager.showAlert({
                        title: 'OMGWTFBBQ',
                        message: 'неизвестная ошибка',
                        alertType: 'error',

                    });
                }
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
        alignSelf: 'stretch'
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
        padding: 20,
        marginBottom:20,
        paddingBottom:20,
        backgroundColor: '#ffffff',
        alignItems: 'stretch',
        justifyContent: 'space-around'
    },
    help: {
        color: 'blue'
    },
    error: {
        color: 'blue'
    }
});


module.exports = SignUp;