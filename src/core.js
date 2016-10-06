'use strict';

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  View,
  ScrollView,
  TouchableHighlight,
  Text } from 'react-native'

  const Realm = require('realm');

  import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

  const t = require('tcomb-form-native');

  import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';

  const Form = t.form.Form;

// here we are: define your domain model
const Person = t.struct({
  name: t.String,              // a required string
  email: t.String,  // an optional string
  password1: t.String,               // a required number
  password2: t.String        // a boolean
});

const loginRegexp = "^[a-z0-9_-]{3,16}$"
const realm = new Realm({
     schema: [{name: 'Dog', properties: {name: 'string'}}]
   });

const options = {
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

const Results = React.createClass({
    render: function() {
      return (
      <View>
      <Bubbles size={10} color="#FFF" />
      <Bars size={10} color="#FDAAFF" />
      <Pulse size={10} color="#52AB42" />
      <DoubleBounce size={10} color="#1CAFF6" />
      </View>
      );
    }
  });

  const styles = StyleSheet.create({
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

class AwesomeProject extends Component {

  constructor(props) {
    super(props);
    this.state = {internet:false};
    realm.write(() => {
     realm.create('Dog', {name: 'Rex'});
   });
    var t = require('tcomb-form-native');
    this.Form = t.form.Form;
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
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: value.name,
          email: value.email,
          password1: value.password1,
          password2: value.password2,
        })
      }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          internet:false
        });
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
  }

  render() {
    return (


      <View ref='scroll'
      style={styles.container}
      viewIsInsideTabBar={true} keyboardShouldPersistTaps={true}>
     
      <Form
      ref="form"
      type={Person}
      options={options}
      />

      
      <TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#99d9f4'>

      <Text style={styles.buttonText}>Зарегистрироваться</Text>

      </TouchableHighlight>

      { this.state.internet ? <Results /> : null }
      

      </View>
      );
    }
}

  export default AwesomeProject