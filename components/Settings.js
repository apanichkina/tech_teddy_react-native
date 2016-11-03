import React, { Component } from 'react';
import { 
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  RecyclerViewBackedScrollView,
  RefreshControl,
  ScrollView,
  ListView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Button from "react-native-button";
import {
    Buffer
} from 'buffer'

import BluetoothSerial from 'react-native-bluetooth-hc05'
import Toast from '@remobile/react-native-toast'

var strings = {
  title: 'Настройки',
  disconnected: 'Разрыв соединения',
  wifiTitle: 'Wi-Fi',
  passwordTitle: 'Пароль'
}

export default class Settings extends Component {

  constructor (props) {
    super(props)
    this.state = {
      incommingData: '',
      connected: true,
      device: props.device,
      wifiPassword: '',
      wifiSSID: ''
    }

    this.handler = this.handlerLost.bind(this)
    this.read = this.readFunc.bind(this)
  }

  componentWillMount () {
    BluetoothSerial.on('connectionLost', this.handler)
    BluetoothSerial.on('data', this.read);
    this.subscribe('\n');
  }

  componentDidMount () {
    // setTimeout(this.getStoryList.bind(this), 500);
  }

  setWifi () {
    Toast.showLongBottom(this.state.wifiPassword + ' ' + this.state.wifiSSID)
    this.write('c'+this.state.wifiSSID+'\n'+this.state.wifiPassword+'\n');
  }

  readFunc (data) {

    if (this.ls) {
      this.storyList.push(data.data.slice(0,-2))
      this.count++
      this.receivedData += data.data
    }

    if (data.data === 'end\r\n') {
      this.ls = false;
      this.setState({
        end: true,
        storyList: this.storyList,
        refreshing: false
      })
      // this.setState({ incommingData: this.count+': '+this.receivedData })
    }

    this.setState({ incommingData: data.data })
  }

  handlerLost () {
    Toast.showLongBottom(strings.disconnected)
    this.setState({ connected: false })
    Actions.pop();
  }

  componentWillUnmount () {
    this.unsubscribe()
    BluetoothSerial.off('connectionLost', this.handler)
    BluetoothSerial.off('data', this.read);
  }

  unsubscribe () {
    BluetoothSerial.unsubscribe().then((res) => {}).catch((err) => {})
  }

  subscribe () {
    BluetoothSerial.subscribe('\n').then((res) => {}).catch((err) => {})
  }

  write (message) {
    BluetoothSerial.write(message).then((res) => {}).catch((err) => Toast.showLongBottom(err))
  }

  _onRefresh() {
    this.setState({refreshing: true});
  }

  render() {

      return (
      <View style={styles.container} >
        <Text
          style={styles.heading}>
          {strings.title}
        </Text>
        <View>
          <Text>
             incomming data: {this.state.incommingData || 'nothing'} 
          </Text>
          <Text>
             send: {this.state.story} 
          </Text> 
        </View>
        <View>
          <Text
            style={styles.heading}>
            {strings.wifiTitle} 
          </Text>
          <TextInput
            placeholder='имя домашней сети'
            value={this.state.wifiSSID}
            onChangeText={(text) => { this.setState({wifiSSID: text}) }}>
          </TextInput>
          <TextInput
            placeholder='пароль'
            secureTextEntry={true}
            value={this.state.wifiPassword}
            onChangeText={(text) => { this.setState({wifiPassword: text}) }}>
          </TextInput>
          <Button
            style={{alignSelf: 'flex-end'}}
            onPress={this.setWifi.bind(this)}>
            Применить
          </Button>
        </View>
      </View> 
      )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingBottom: 50
    },
    listParent: {
        flex: 1
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#F6F6F6'
    },
    text: {
        flex: 1
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