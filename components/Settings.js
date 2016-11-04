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
  Switch,
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
  wifiTitle: 'задать Wi-Fi',
  passwordTitle: 'Пароль',
  wifiNamePlaceholder: 'имя сети Wi-Fi',
  checkWifi: 'проверить соединение'
}

// 56762426


export default class Settings extends Component {

  constructor (props) {
    super(props)
    this.state = {
      incommingData: '',
      connected: true,
      device: props.device,
      wifiPassword: '',
      wifiSSID: '',
      wifiIsActive: false
    }

    this.handler = this.handlerLost.bind(this)
    this.read = this.readFunc.bind(this)
  }

  componentWillMount () {
    BluetoothSerial.on('connectionLost', this.handler)
    BluetoothSerial.on('data', this.read);
    BluetoothSerial.subscribe('\n').then((res) => {}).catch((err) => {})
  }

  componentDidMount () {
    // setTimeout(this.getStoryList.bind(this), 500);
  }

  setWifi () {
    Toast.showLongBottom(this.state.wifiPassword + ' ' + this.state.wifiSSID)
    this.write('c'+this.state.wifiSSID+'\n'+this.state.wifiPassword+'\n');
  }

  toggleWifi () {
    this.write('w');
    this.setState({ wifiIsActive: !this.state.wifiIsActive })
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
      Toast.showLongBottom('Settings end')
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
    BluetoothSerial.unsubscribe().then((res) => {}).catch((err) => {})
    Toast.showLongBottom('SETTINGS unsubscribe')
    BluetoothSerial.off('connectionLost', this.handler)
    BluetoothSerial.off('data', this.read);
  }

  write (message) {
    BluetoothSerial.write(message).then((res) => {}).catch((err) => Toast.showLongBottom(err))
  }

  render() {

      return (
      <View style={styles.container} >
        <View>
          <Text style={{backgroundColor: '#ff0000'}}>
             incomming data: {this.state.incommingData || 'nothing'} 
          </Text>
          <Text style={{backgroundColor: '#ff0000'}}>
             send: {this.state.story} 
          </Text> 
        </View>
        <View>
          <View style={styles.inline} >
            <Text
              style={styles.h1}>
              {strings.title}
            </Text>
          </View>
          <Text
            style={styles.h2}>
            {strings.wifiTitle} 
          </Text>
          <TextInput
            placeholder={strings.wifiNamePlaceholder}
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
          <View style={styles.enableInfoWrapper}>
            <Text style={{ fontWeight: 'bold' }}>{strings.checkWifi}</Text>
            <Switch
              onValueChange={this.toggleWifi.bind(this)}
              value={this.state.wifiIsActive} />
          </View>
        </View>
      </View> 
      )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingBottom: 50,
        marginTop: 0
    },
    h1: {
      fontWeight: 'bold',
      fontSize: 24,
      marginVertical: 10,
      alignSelf: 'center'
    },
    h2: {
      fontWeight: 'bold',
      fontSize: 20,
      marginVertical: 5,
      alignSelf: 'flex-start'
    },
    inline: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 40,
      paddingHorizontal: 25,
      alignItems: 'center'
    },
    enableInfoWrapper: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 40,
      paddingHorizontal: 25,
      alignItems: 'center'
    },
});