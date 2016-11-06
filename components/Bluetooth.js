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

import BluetoothSerial from 'react-native-bluetooth-hc05'
import TeddyBluetooth from './TeddyBluetooth'

import ToastError from './ToastError'
var E = new ToastError('Bluetooth')

import {
    Buffer
    } from 'buffer'

var strings = {
    knownBears: 'Знакомые мишки',
    connectedTo: ' подключен',
    noConnection: '✗ не подключен',
    connecting: 'пытаюсь…',
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

        this.expectDisconnect = false;

        this.handler = this.handlerLost.bind(this)

        BL = TeddyBluetooth.getInstance();
    }

    handlerLost () {
      if (!this.expectDisconnect) {
        // Toast.showLongBottom(`BLUETOOTH: lost`)
      } else {
        this.expectDisconnect = false;
      }

      this.setState({ connected: false })
    }

    componentWillMount () {
        Promise.all([
            BluetoothSerial.isEnabled(),
            BluetoothSerial.list(),
            BluetoothSerial.isConnected()
        ])
            .then((values) => {
                const [ isEnabled, devices, connected ] = values
                this.setState({ isEnabled, devices, connected })
            })

        if (global.device) {
            this.setState({device: global.device});
        }

        BluetoothSerial.on('bluetoothEnabled', () => {
            E.short('enabled')
            Promise.all([
                BluetoothSerial.isEnabled(),
                BluetoothSerial.list()
            ])
                .then((values) => {
                    const [ isEnabled, devices ] = values
                    this.setState({ isEnabled, devices })
                })
        })

        BluetoothSerial.on('bluetoothDisabled', () => E.short('disabled'))

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
      BL.enable()
      .then((res) => this.setState({ isEnabled: true }))
      .catch((err) => E.short(err))
    }

    disable () {
      this.expectDisconnect = true;
      BL.disable()
        .then((res) => this.setState({ isEnabled: false }))
        .catch((err) => E.short(err))
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
            BL.discoverUnpairedDevices()
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

    connect (device) {
      this.setState({ connecting: true })
      BL.connect(device.id)
        .then((res) => {
          // E.short(`Connected ${device.name}`)
          this.setState({ device, connected: true, connecting: false })
          global.device = device;
          Actions.mishka({ device: device });
        })
        .catch((err) => {
          this.setState({ connected: false, connecting: false })
        })
    }

    disconnect () {
      this.expectDisconnect = true;
      BL.disconnect()
      .then(() => {
        this.expectDisconnect = false;
      })
      .catch((err) => {
        this.expectDisconnect = false;
        E.short(err)
      })
    }

    toggleConnect (value) {
        if (value === true && this.state.device) {
            this.connect(this.state.device)
        } else {
            this.disconnect()
        }
    }

    isConnected () {
      BL.isConnected()
      .then((d) => { this.setState(connected: d)})
      .catch((err) => E.short(err))
    }

    render () {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>{strings.title}</Text>
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
                                ✓ {this.state.device.name} {strings.connectedTo}
                            </Text>
                        ) : this.state.connecting ? (
                            <Text style={[styles.connectionInfo, { color: '#ff6523' }]}>
                                {strings.connecting}
                            </Text>
                        ) : (
                            <Text style={[styles.connectionInfo, { color: '#ff6523' }]}>
                                {strings.noConnection}
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
                    {/* <Button
                     label='Write to device'
                     onPress={this.write.bind(this, 'test')} /> */}
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
