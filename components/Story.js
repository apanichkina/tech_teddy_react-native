import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
      device: props.device,
      storyList: [],
      end: false,
      story: null
    }

    this.ls = false
    this.storyList = []

    this.handler = this.handlerLost.bind(this)
    this.read = this.readFunc.bind(this)
  }

  getStoryList () {
    this.storyList = [];
    this.write('l')
    this.ls = true
  }

  play (filename) {
    if (this.state.story === filename) {
      this.write('s\n');
      this.setState({ story: null })
    } else {
      this.write('s'+filename+'\n');
      this.setState({ story: filename })
    }
  }

  componentWillMount () {
    BluetoothSerial.on('connectionLost', this.handler)

    BluetoothSerial.on('data', this.read);

    this.subscribe('\r\n');
  }

  componentDidMount () {
    this.getStoryList();
  }

  readFunc (data) {
    if (this.ls) {
      this.storyList.push(data.data.slice(0,-2));
    }
    if (data.data === 'end\r\n') {
      this.ls = false;
      this.setState({ storyList: this.storyList })
      this.setState({ end: true })
    }

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
            onPress={this.getStoryList.bind(this)}>
            Список
        </Button>
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
        <View>
          <Text>
             send: {this.state.story} 
          </Text> 
        </View>
        <View style={styles.listContainer}>
          {this.state.storyList.map((name, i) => {
            if (name.endsWith('.raw')) {
              return (
                <TouchableOpacity key={`${name}_${i}`} style={styles.listItem} onPress={this.play.bind(this, name)}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{`<${name}>`}</Text>
                  </View>
                </TouchableOpacity>
              )
            }
          })}
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
    listContainer: {
      marginTop: 5,
      borderColor: '#ccc',
      borderTopWidth: 0.5
    },
    listItem: {
      flex: 1,
      padding: 25,
      borderColor: '#ccc',
      borderBottomWidth: 0.5
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