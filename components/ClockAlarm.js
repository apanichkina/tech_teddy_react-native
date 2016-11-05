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
import BluetoothSerial from 'react-native-bluetooth-hc05'

var strings = {
  days: ['П','В','С','Ч','П','С','В'],
  disconnected: 'LOST'
}

export default class ClockAlarm extends Component {

  constructor (props) {
    super(props)
    this.state = {
      incommingData: '',
      connected: true,
      device: props.device,
      end: false,
      isRefreshing: false,
      isDateTimePickerVisible: false,
      time: this.timeToString(global.alarm.time),
      days: global.alarm.days,
      alarmActive: global.alarm.active,
      lightActive: global.alarm.lightActive,
      vibroActive: global.alarm.vibroActive,
      soundActive: global.alarm.soundActive
    }

    this.handler = this.handlerLost.bind(this)
    this.read = this.readFunc.bind(this)

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
    global.alarm.active = !this.state.alarmActive
    this.setState({ alarmActive: global.alarm.active })
    this.sendTimeToDevice()
  }

  toggleLight () {
    global.alarm.lightActive = !this.state.lightActive
    this.setState({ lightActive: global.alarm.lightActive })
    this.sendTimeToDevice()
  }

  toggleVibro () {
    global.alarm.vibroActive = !this.state.vibroActive
    this.setState({ vibroActive: global.alarm.vibroActive })
    this.sendTimeToDevice()
  }

  toggleSound () {
    global.alarm.soundActive = !this.state.soundActive
    this.setState({ soundActive: global.alarm.soundActive })
    this.sendTimeToDevice()
  }

  getAlarmTime () {
    BluetoothSerial.clear();
    this.write('t\n')
    this.setState({ incommingData: '' })
  }

  sendTimeToDevice () {

    var t = global.alarm.time
    var days = 0;
     
    for (var i = 0; i < 7; ++i) {
      days += (global.alarm.days[i] ? 1 : 0) << i
    }

    var active = (global.alarm.lightActive ? 1 : 0)
    active += (global.alarm.vibroActive ? 1 : 0) << 1
    active += (global.alarm.soundActive ? 1 : 0) << 2
    active += (global.alarm.active ? 1 : 0) << 3

    var h = String.fromCharCode(t.getHours())
    var m = String.fromCharCode(t.getMinutes())
    var d = String.fromCharCode(days)
    var a = String.fromCharCode(active)
    this.write('t'+h+m+d+a+'\n');
  }

  readFunc (data) {
    this.setState({ incommingData: data.data })
    var d = data.data
    var days = d.charCodeAt(3)
    var active = d.charCodeAt(4)
    // Toast.showShortBottom(d.charCodeAt(1) + ' ' + d.charCodeAt(2) + ' ' + d.charCodeAt(3) + ' ' + d.charCodeAt(4))
    for (var i = 0; i < 7; ++i) {
      global.alarm.days[i] = (days >> i) & 0x01
    }

    global.alarm.lightActive = !!((active >> 0) & 0x01)
    global.alarm.vibroActive = !!((active >> 1) & 0x01)
    global.alarm.soundActive = !!((active >> 2) & 0x01)
    global.alarm.active = !!((active >> 3) & 0x01)

    global.alarm.time.setHours(d.charCodeAt(1), d.charCodeAt(2))

    this.setState({
      time: this.timeToString(global.alarm.time),
      alarmActive: global.alarm.active,
      days: global.alarm.days,
      lightActive: global.alarm.lightActive,
      vibroActive: global.alarm.vibroActive,
      soundActive: global.alarm.soundActive
    })
  }

  componentWillMount () {
    BluetoothSerial.on('connectionLost', this.handler)
    BluetoothSerial.on('data', this.read);
    this.subscribe('\n');
  }

  componentDidMount () {
    setTimeout(this.getAlarmTime.bind(this), 500);
  }

  handlerLost () {
    Toast.showLongBottom(strings.disconnected)
    this.setState({ connected: false })
  }

  componentWillUnmount () {
    this.unsubscribe()
    Toast.showLongBottom('ALARM: unsubscribe')
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

  write (data) {
    BluetoothSerial.write(data)
    .then((res) => {})
    .catch((err) => Toast.showLongBottom(err))
  }

  _handleTimePicked (time) {
    // console.log('A date has been picked: ', time)
    this.setState({time: this.timeToString(time)})
    global.alarm.time = time;
    this.sendTimeToDevice()
    this._hideDateTimePicker()
  }

  _changeWeekDay (day) {
    var d = this.state.days
    d[day] = !d[day]
    this.setState({days: d})
    global.alarm.days = d;
    this.sendTimeToDevice()
  }

  render() {
      return (
        <View style={styles.container}>
          <View style={styles.inlineH0} >
            <TouchableOpacity onPress={this._showDateTimePicker}>
              <Text
                style={[styles.time, (this.state.alarmActive) ? styles.active : styles.inactive]}>
                {this.state.time}
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