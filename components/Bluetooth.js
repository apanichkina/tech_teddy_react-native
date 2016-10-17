import React, {
    Component
} from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Switch
} from 'react-native'

import {
    Actions
} from 'react-native-router-flux';

import Toast from '@remobile/react-native-toast'
import BluetoothSerial from 'react-native-bluetooth-hc05'
import {
    Buffer
} from 'buffer'

var strings = {
  knownBears: 'Знакомые мишки',
  connectedTo: ' подключен',
  activateBT: 'Включить Bluetooth',
  title: 'Выбери медведя'
}

global.Buffer = Buffer
const iconv = require('iconv-lite')

const Button = ({ label, onPress }) =>
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={{ color: '#fff' }}>{label}</Text>
  </TouchableOpacity>

export default class Bluetooth extends Component {

  constructor (props) {
    super(props)
    this.state = {
      discovering: false,
      devices: [],
      devicesToShow: [],
      connected: false,
      incommingData: '',
      device: null
    }

    this.handler = this.handlerLost.bind(this)
  }

  handlerLost () {
    /* if (this.state.device) {
      Toast.showLongBottom(`BLUETOOTH: Connection to device ${this.state.device.name} has been lost`)
    } */
    Toast.showLongBottom(`BLUETOOTH: Connection has been lost`)
    this.setState({ connected: false })
  }

  componentWillMount () {
    Promise.all([
      BluetoothSerial.isEnabled(),
      BluetoothSerial.list()
    ])
    .then((values) => {
      const [ isEnabled, devices ] = values
      this.setState({ isEnabled, devices })
    })

    BluetoothSerial.on('bluetoothEnabled', () => {
      Toast.showLongBottom('Bluetooth enabled')
      Promise.all([
        BluetoothSerial.isEnabled(),
        BluetoothSerial.list()
      ])
      .then((values) => {
        const [ isEnabled, devices ] = values
        this.setState({ isEnabled, devices })
      })
    })
    
    BluetoothSerial.on('bluetoothDisabled', () => Toast.showLongBottom('Bluetooth disabled'))
    
    BluetoothSerial.on('connectionLost', this.handler)

    /* BluetoothSerial.on('data', (data) => {
      // Toast.showLongBottom(`data received`)
      BluetoothSerial.read()
      .then((res) => {
        this.setState({ incommingData: res })
      })
      .catch((err) => {
        Toast.showLongBottom(err)
      })
    }) */
  }

  componentWillUnmount () {
    BluetoothSerial.off('connectionLost', this.handler)
    this.disconnect();
    // BluetoothSerial.on('bluetoothEnabled', () => {})
    // BluetoothSerial.on('bluetoothDisabled', () => {})
    // BluetoothSerial.on('connectionLost', () => {})
  }

  enable () {
    BluetoothSerial.enable()
    .then((res) => this.setState({ isEnabled: true }))
    .catch((err) => Toast.showLongBottom(err))
  }

  disable () {
    BluetoothSerial.disable()
    .then((res) => this.setState({ isEnabled: false }))
    .catch((err) => Toast.showLongBottom(err))
  }

  toggleBluetooth (value) {
    if (value === true) {
      this.enable()
    } else {
      this.disable()
    }
  }

  discoverUnpaired () {
    if (this.state.discovering) {
      return false
    } else {
      this.setState({ discovering: true })
      BluetoothSerial.discoverUnpairedDevices()
      .then((unpairedDevices) => {
        const devices = this.state.devices
        const deviceIds = devices.map((d) => d.id)
        unpairedDevices.forEach((device) => {
          if (deviceIds.indexOf(device.id) < 0) {
            devices.push(device)
          }
        })
        this.setState({ devices, discovering: false })
      })
    }
  }

  subscribe () {
    BluetoothSerial.subscribe('\n')
    .then((res) => {})
    .catch((err) => {})
  }

  unsubscribe () {
    BluetoothSerial.unsubscribe()
    .then((res) => {})
    .catch((err) => {})
  }

  /**
   * Connect to bluetooth device by id
   * @param  {Object} device
   */
  connect (device) {
    this.setState({ connecting: true })
    BluetoothSerial.connect(device.id)
    .then((res) => {
      Toast.showLongBottom(`Connected to device ${device.name}`)

      //this.subscribe();
      
      /* devicesToShow = devicesToShow.filter(function(item) {
        return item.id !== device.id;
      }); */
      this.setState({ device, connected: true, connecting: false })
      Actions.tabbar({ device: device });
    })
    .catch((err) => {
      this.setState({ connected: false, connecting: false })
    })
  }

  /**
   * Disconnect from bluetooth device
   */
  disconnect () {
    BluetoothSerial.disconnect()
    .then(() => {
      // this.setState({ connected: false })
      // this.unsubscribe();
    })
    .catch((err) => Toast.showLongBottom(err))
  }

  /**
   * Toggle connection when we have active device
   * @param  {Boolean} value
   */
  toggleConnect (value) {
    if (value === true && this.state.device) {
      this.connect(this.state.device)
    } else {
      this.disconnect()
    }
  }

  /**
   * Write message to device
   * @param  {String} message
   */
  write (message) {
    if (!this.state.connected) {
      Toast.showLongBottom('You must connect to device first')
      return
    }

    BluetoothSerial.write(message)
    .then((res) => {
      this.setState({ connected: true })
    })
    .catch((err) => Toast.showLongBottom(err))
  }

  writePackets (message, packetSize = 64) {
    const toWrite = iconv.encode(message, 'cp852')
    const writePromises = []
    const packetCount = Math.ceil(toWrite.length / packetSize)

    for (var i = 0; i < packetCount; i++) {
      const packet = new Buffer(packetSize)
      packet.fill(' ')
      toWrite.copy(packet, 0, i * packetSize, (i + 1) * packetSize)
      writePromises.push(BluetoothSerial.write(packet))
    }

    Promise.all(writePromises)
    .then((result) => {
    })
  }

  render () {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>{strings.title}</Text>

        <View>
          <Text>
            incomming data: {this.state.incommingData || 'nothing'}
          </Text> 
        </View> 

        <View style={{ backgroundColor: '#eee' }}>
          {Platform.OS === 'android'
          ? (
            <View style={styles.enableInfoWrapper}>
              <Text style={{ fontWeight: 'bold' }}>{strings.activateBT}</Text>
              <Switch
                onValueChange={this.toggleBluetooth.bind(this)}
                value={this.state.isEnabled} />
            </View>
          ) : null}
        </View>

        <View style={styles.connectionInfoWrapper}>
          <View>
            <Switch
              onValueChange={this.toggleConnect.bind(this)}
              disabled={!this.state.device}
              value={this.state.connected || this.state.connecting} />
          </View>
          <View>
            {this.state.connected
            ? (
              <Text style={styles.connectionInfo}>
                ✓ {this.state.device.name}{strings.connectedTo}
              </Text>
            ) : (
              <Text style={[styles.connectionInfo, { color: '#ff6523' }]}>
                ✗ Not connected to any device
              </Text>
            )}
          </View>
        </View>
        <Text style={styles.listTitle}>{strings.knownBears}</Text>
        <View style={styles.listContainer}>
          {this.state.devices.map((device, i) => {
            if (device.name.startsWith('HC-')) {
              return (
                <TouchableOpacity key={`${device.id}_${i}`} style={styles.listItem} onPress={this.connect.bind(this, device)}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold' }}>{device.name}</Text>
                    <Text>{`<${device.id}>`}</Text>
                  </View>
                </TouchableOpacity>
              )
            }
          })}
        </View>
        
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          {/* {Platform.OS === 'android'
          ? (
            <Button
              label={this.state.discovering ? '... Discovering' : 'Discover devices'}
              onPress={this.discoverUnpaired.bind(this)} />
          ) : null} */}
          <Button
            label='Write to device'
            onPress={this.write.bind(this, 'test')} />
        </View>
        
      </View> 
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 0
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 24,
    marginVertical: 10,
    alignSelf: 'center'
  },
  enableInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: 25,
    alignItems: 'center'
  },
  connectionInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25
  },
  connectionInfo: {
    fontWeight: 'bold',
    alignSelf: 'center',
    fontSize: 18,
    marginVertical: 10,
    color: '#238923'
  },
  listContainer: {
    marginTop: 5,
    borderColor: '#ccc',
    borderTopWidth: 0.5
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    paddingHorizontal: 25,
    borderColor: '#ccc',
    borderTopWidth: 0.5
  },
  listItem: {
    flex: 1,
    padding: 25,
    borderColor: '#ccc',
    borderBottomWidth: 0.5
  },
  button: {
    margin: 5,
    padding: 25,
    backgroundColor: '#4C4C4C'
  }
});
