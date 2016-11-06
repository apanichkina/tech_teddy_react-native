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

import TeddyBluetooth from './TeddyBluetooth'
import ToastError from './ToastError'
var E = new ToastError('ClockAlarm')

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
      wifiPassword: '',
      wifiSSID: '',
      wifiIsActive: false
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  setWiFi () {
    BL.setWiFi(this.state.wifiSSID, this.state.wifiPassword)
      .then((res) => { E.long(res, 'setWiFi') })
      .catch((error) => { E.long(error, 'setWiFi') });
  }

  toggleWiFi () {
    BL.toggleWiFi()
      .then((res) => {
        this.setState({ wifiIsActive: (res == 'on') ? true : false })
        E.long(res, 'toggleWiFi')
      })
      .catch((error) => {
        E.long(error, 'toggleWiFi')
      });
  }

  componentWillUnmount () { }

  render() {

      return (
      <View style={styles.container} >
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
            onPress={this.setWiFi.bind(this)}>
            Применить
          </Button>
          <View style={styles.enableInfoWrapper}>
            <Text style={{ fontWeight: 'bold' }}>{strings.checkWifi}</Text>
            <Switch
              onValueChange={this.toggleWiFi.bind(this)}
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