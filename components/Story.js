import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Button from "react-native-button";
import {
    Buffer
} from 'buffer'

import BluetoothSerial from 'react-native-bluetooth-hc05'
import Toast from '@remobile/react-native-toast'

var strings = {
  title: "Сказки"
}

export default class Story extends Component {

  constructor (props) {
    super(props)
    this.state = {
      incommingData: '',
      connected: true,
      device: props.device
    }

    this.handler = this.handlerLost.bind(this)
    this.read = this.readFunc.bind(this)
  }

  componentWillMount () {
    BluetoothSerial.on('connectionLost', this.handler)

    BluetoothSerial.on('data', this.read);

    this.subscribe('\n');
  }

  readFunc (data) {
    this.setState({ incommingData: data.data })
  }

  handlerLost () {
    /* if (this.state.device) {
      Toast.showLongBottom(`STORY: Connection to device ${this.state.device.name} has been lost`)
    } */
    Toast.showLongBottom(`STORY: Connection has been lost`)
    this.setState({ connected: false })
    Actions.pop();
  }

  componentWillUnmount () {
    this.unsubscribe()
    BluetoothSerial.off('connectionLost', this.handler)
    BluetoothSerial.off('data', this.read);
  }

  unsubscribe () {
    BluetoothSerial.unsubscribe()
    .then((res) => {})
    .catch((err) => {})
  }

  subscribe () {
    BluetoothSerial.subscribe('\n')
    .then((res) => {})
    .catch((err) => {})
  }

  write (message) {
    BluetoothSerial.write(message)
    .then((res) => {})
    .catch((err) => Toast.showLongBottom(err))
  }

  render() {
      return (
      <View style={styles.container}>
        <Text style={styles.heading}>{strings.title}</Text>
        <Button
            containerStyle={styles.buttonStyle7}
            style={styles.textStyle6}
            onPress={this.write.bind(this, 's')}>
            Начать
        </Button >
        <Button
            containerStyle={styles.buttonStyle6}
            style={styles.textStyle}
            onPress={this.write.bind(this, 'p')}>
            Пауза
        </Button>
        <View>
          <Text>
             incomming data: {this.state.incommingData || 'nothing'} 
          </Text> 
        </View> 
      </View> 
      )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20
    },
    heading: {
      fontWeight: 'bold',
      fontSize: 24,
      marginVertical: 10,
      alignSelf: 'center'
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