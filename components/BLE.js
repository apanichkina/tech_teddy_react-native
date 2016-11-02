import React, {
    Component
    } from 'react';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Platform,
    Switch,
    NativeAppEventEmitter
    } from 'react-native'

import {
    Actions
    } from 'react-native-router-flux';

import Toast from '@remobile/react-native-toast'
import BleManager from 'react-native-ble-manager'
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

export default class BleExample extends Component {
 
    constructor(){
        super()
 
        this.state = {
            ble:null,
            scanning:false,
            devices: [{id: 1, name: 'harry'}]
        }
    }
 
    componentDidMount() {
        BleManager.start({showAlert: false});


        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        this.handleUpdateState = this.handleUpdateState.bind(this);
        this.handleDisconnected = this.handleDisconnected.bind(this);
        this.handleUpdateCharacterisics = this.handleUpdateCharacterisics.bind(this);
 
        NativeAppEventEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
        NativeAppEventEmitter.addListener('BleManagerDidUpdateState', this.handleUpdateState );
        NativeAppEventEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnected );
        NativeAppEventEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateCharacterisics );

    }

    handleUpdateCharacterisics (deviceID, char, value) {
        Toast.showLongBottom(deviceID);
        Toast.showLongBottom(char);
        Toast.showLongBottom(value);
    }

    handleUpdateState (args) {
        if (args.state === 'off') {
            Toast.showLongBottom('BLE is unavailable')
        } else if (args.state === 'on') {
            Toast.showLongBottom('BLE is ready')
        } else {
            Toast.showLongBottom('handleUpdateState: UNKNOWN')
        }
    }

    handleDisconnected (deviceID) {
        if (deviceID === global.device.id) {
            Toast.showLongBottom(global.device.name+'disconnected')
        }
    }
 
    handleScan() {
        BleManager.scan([], 5, true)
            .then((results) => {} );
    }
 
    connect (device) {
        BleManager.connect(device.id)
          .then(() => {
                Toast.showLongBottom(`Connected to device ${device.name}`)
                this.setState({ device, connected: true, connecting: false })
                global.device = device;
                this.write();
                this.read();
                // Actions.mishka({ device: device });
          })
          .catch((error) => {
            // Failure code 
            this.setState({ connected: false, connecting: false })
          });

        this.setState({ connecting: true });
    }

    toggleScanning(bool){
        if (bool) {
            this.setState({scanning:true})
            this.scanning = setInterval( ()=> this.handleScan(), 1000);
        } else{
            this.setState({scanning:false, ble: null})
            clearInterval(this.scanning);
        }
    }

    write () {
        var data = 'MTIzNDU2Nzg5MA==';
        BleManager.write(global.device.id, '0000ffe0-0000-1000-8000-00805f9b34fb', '0000ffe1-0000-1000-8000-00805f9b34fb', data)
        .then(() => {
        // Success code 
            Toast.showLongBottom('Success')
        })
        .catch((error) => {
        // Failure code 
            Toast.showLongBottom('error')
        });
    }

    read () {
        setInterval(()=>{
            BleManager.read(global.device.id, '0000ffe0-0000-1000-8000-00805f9b34fb', '0000ffe1-0000-1000-8000-00805f9b34fb')
            .then((readData) => {
                // Success code 
                Toast.showLongBottom(readData)
            })
            .catch((error) => {
                // Failure code 
                console.log(error);
            });
        }, 100);
    }
 
    handleDiscoverPeripheral(data){
        // console.log('Got ble data', data);
        // Toast.showLongBottom('Data'+data)
        const devices = this.state.devices
        const deviceIds = devices.map((d) => d.id)
        if (deviceIds.indexOf(data.id) < 0) {
            devices.push(data)
        }
        this.setState({ ble: data, devices })
    }
 
    render() {
 
        const container = {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5FCFF',
        }
 
        const bleList = this.state.ble
            ? <Text> Device found: {this.state.ble.name} </Text>
            : <Text>no devices nearby</Text>
 
        return (
            <View style={container}>
                <TouchableOpacity
                    style={{padding:20, backgroundColor:'#ccc'}}
                    onPress={() => this.toggleScanning(!this.state.scanning) }>
                    <Text>Scan Bluetooth ({this.state.scanning ? 'on' : 'off'})</Text>
                </TouchableOpacity>
 
                {bleList}
                <View>
                {this.state.devices.map((device, i) => {
                            return (
                                <TouchableOpacity
                                    key={`${device.id}_${i}`}
                                    onPress={this.connect.bind(this, device)}>
                                    <View>
                                        <Text>{device.name || 'unknown'} {`<${device.id}>`}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View>
            </View>
        );
    }
}