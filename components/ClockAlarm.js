import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import DateTimePicker from 'react-native-modal-datetime-picker'
import Toast from '@remobile/react-native-toast'
import Button from "react-native-button";
// import BluetoothSerial from 'react-native-bluetooth-hc05'

import TeddyBluetooth from './TeddyBluetooth'
import ToastError from './ToastError'
var E = new ToastError('ClockAlarm')

var strings = {
  days: ['П','В','С','Ч','П','С','В'],
  disconnected: 'LOST',
  title: 'День & ночь'
}

export default class ClockAlarm extends Component {

  constructor (props) {
    super(props)

    this.alarm = {
      days: [false, false, false, false, false, false, false],
      active: false,
      time: new Date(),
      lightActive: false,
      vibroActive: false,
      soundActive: false
    }

    this.state = {
      incommingData: '',
      connected: true,
      device: props.device,
      end: false,
      isRefreshing: false,
      isDateTimePickerVisible: false,
      timeHHMM: '00:00',
      time: this.alarm.time,
      days: this.alarm.days,
      alarmActive: this.alarm.active,
      lightActive: this.alarm.lightActive,
      vibroActive: this.alarm.vibroActive,
      soundActive: this.alarm.soundActive,
      data: ''
    }

  }

  timeToString (time) {
    return this._checkZero(time.getHours())+':'+this._checkZero(time.getMinutes())
  }

  _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true })

  _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false })

  _checkZero (number) {
    return ((number < 10) ? '0' : '') + number
  }

  toggleAlarm () {
    this.alarm.active = !this.state.alarmActive
    this.setState({ alarmActive: this.alarm.active })
    this.setAlarm()
  }

  toggleLight () {
    this.alarm.lightActive = !this.state.lightActive
    this.setState({ lightActive: this.alarm.lightActive })
    this.setAlarm()
  }

  toggleVibro () {
    this.alarm.vibroActive = !this.state.vibroActive
    this.setState({ vibroActive: this.alarm.vibroActive })
    this.setAlarm()
  }

  toggleSound () {
    this.alarm.soundActive = !this.state.soundActive
    this.setState({ soundActive: this.alarm.soundActive })
    this.setAlarm()
  }

  getAlarmTime () {
    BL.getAlarmTime()
      .then((res) => { this.parseTime(res) })
      .catch((error) => { E.long(error, 'getAlarmTime') });
  }

  parseTime (res) {
    var d = res.charCodeAt(2)
    var days = []
    this.alarm.time.setHours(res.charCodeAt(0), res.charCodeAt(1))
    var active = res.charCodeAt(3)

    for (var i = 0; i < 7; ++i) {
      this.alarm.days[i] = (d >> i) & 0x01
    }

    this.alarm.active = ((active >> 3) & 0x01)
    this.alarm.lightActive = ((active >> 0) & 0x01)
    this.alarm.vibroActive = ((active >> 1) & 0x01)
    this.alarm.soundActive = ((active >> 2) & 0x01)

    this.setState({
      time: this.alarm.time,
      timeHHMM: this.timeToString(this.alarm.time),
      days: this.alarm.days,
      lightActive: this.alarm.lightActive,
      vibroActive: this.alarm.vibroActive,
      soundActive: this.alarm.soundActive,
      alarmActive: this.alarm.active
    })
  }

  setAlarm () {

    var activate = {
      clock: this.alarm.active,
      lightActive: this.alarm.lightActive,
      vibroActive: this.alarm.vibroActive,
      soundActive: this.alarm.soundActive
    }

    BL.setAlarm(this.alarm.time, this.alarm.days, activate)
      .then((res) => { this.parseTime(res) })
      .catch((error) => { E.long(error, 'setAlarm') });
  }

  setTime () {
    BL.setTime()
      .then((res) => { this.setState({data: res}) })
      .catch((error) => { E.long(error, 'setTime') });
  }

  componentWillMount () {
  }

  componentDidMount () {
    setTimeout(this.getAlarmTime.bind(this), 500);
  }

  componentWillUnmount () {
  }

  _handleTimePicked (time) {
    // console.log('A date has been picked: ', time)
    this.alarm.time = time
    this.setState({time: this.alarm.time})
    this.setAlarm()
    this._hideDateTimePicker()
  }

  _changeWeekDay (day) {
    var d = this.state.days
    d[day] = !d[day]
    this.setState({days: d})
    this.alarm.days = d;
    this.setAlarm()
  }

  render() {
      return (
        <View style={styles.container}>
          <View style={styles.inline}>
            <Text style={styles.heading}>{strings.title}</Text>
          </View>
          <View style={styles.inlineH0} >
            <TouchableOpacity onPress={this._showDateTimePicker}>
              <Text
                style={[styles.time, (this.state.alarmActive) ? styles.active : styles.inactive]}>
                {this.state.timeHHMM}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toggleAlarm.bind(this)}>
              <Image
                style={[styles.alarm, (this.state.alarmActive) ? styles.activeImg : styles.inactiveImg]}
                source={require('../img/ic_alarm_white_24dp.png')} />
            </TouchableOpacity>
          </View>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this._handleTimePicked.bind(this)}
            onCancel={this._hideDateTimePicker}
            mode='time'
          />            
          <View style={styles.inline} >
          {this.state.days.map((day, i) => {
              return (
                <Text
                  key={i}
                  onPress={this._changeWeekDay.bind(this, i)}
                  style={[styles.days, (day) ? styles.active : styles.inactive]}>
                    {strings.days[i]}
                  </Text>
              )
            })
          }
          </View>
          <View style={styles.inlineH0} >
            <TouchableOpacity onPress={this.toggleSound.bind(this)}>
              <Image
                style={[styles.alarm, (this.state.soundActive) ? styles.activeImg : styles.inactiveImg]}
                source={require('../img/audiotrack_white_24dp.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toggleVibro.bind(this)}>
              <Image
                style={[styles.alarm, (this.state.vibroActive) ? styles.activeImg : styles.inactiveImg]}
                source={require('../img/vibration_white_24dp.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.toggleLight.bind(this)}>
              <Image
                style={[styles.alarm, (this.state.lightActive) ? styles.activeImg : styles.inactiveImg]}
                source={require('../img/brightness_high_white_24dp.png')} />
            </TouchableOpacity>
          </View>

          <Button onPress={this.setTime.bind(this)} >SYNC</Button>
              <Text>{this.state.data}</Text>

        </View>
      )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        paddingBottom: 50
    },
    inlineH0: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 80,
      paddingHorizontal: 25,
      alignItems: 'center'
    },
    inline: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: 40,
      paddingHorizontal: 25,
      alignItems: 'center'
    },
    heading: {
      fontWeight: 'bold',
      fontSize: 24,
      marginVertical: 10,
      alignSelf: 'center'
    },
    alarm: {
      width: 40,
      height: 40,
    },
    time: {
      fontWeight: 'bold',
      fontSize: 44
    },
    active: {
      color: '#00cc00'
    },
    inactive: {
      color: '#cccccc'
    },
    days: {
      fontWeight: 'bold',
      fontSize: 24
    },
    activeImg: {
      tintColor: '#00cc00'
    },
    inactiveImg: {
      tintColor: '#cccccc'
    }
});