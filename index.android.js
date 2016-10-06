'use strict';


import React from 'react'
import {
    AppRegistry,
    StyleSheet,
    View,
    ScrollView,
    TouchableHighlight,
    Text } from 'react-native'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

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

var AwesomeProject = React.createClass({

  onPress: function () {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      console.log(value); // value here is an instance of Person
    }
  },

  render: function() {
    return (
    
     
        <View ref='scroll'
  style={styles.container}
  viewIsInsideTabBar={true} keyboardShouldPersistTaps={true}>
        <Form
          ref="form"
          type={Person}
          options={options}
        />
        <TouchableHighlight style={styles.button} onPress={this.onPress} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Зарегистрироваться</Text>
        </TouchableHighlight>
        
 
      </View>
    

       
    );
  }
});

var styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
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
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  }
});

AppRegistry.registerComponent('techteddy', () => AwesomeProject);