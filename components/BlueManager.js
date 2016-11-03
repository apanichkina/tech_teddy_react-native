import {
  React,
  Component
} from 'react'
import Actions from 'react-native-router-flux'
import Buffer from 'buffer'
import BluetoothSerial from 'react-native-bluetooth-hc05'
import Toast from '@remobile/react-native-toast'

export default class BlueManager {

  static instance = null;

  constructor (props) {

    if (BlueManager.instance) {
      return BlueManager.instance
    }

    BlueManager.instance = this;

    this.s = {}

    this.s.incommingData = ''
    this.s.connected = true
    this.s.device = ''
    this.s.storyList = []
    this.s.end = false
    this.s.isRefreshing = false
    this.s.story = null

    this.ls = false
    this.storyList = []
    this.count = 0
    this.receivedData = ''

    this.handler = this.handlerLost.bind(this)
    this.read = this.readFunc.bind(this)

    BluetoothSerial.on('connectionLost', this.handler)
    BluetoothSerial.on('data', this.read);
    this.subscribe('\n');

    this.myname = '11111'

    this.promise = undefined


  }

  getStoryList () {
    return new Promise((resolve, reject) => {
      // resolve(['1.raw','2.raw','3.raw','4.raw'])
    // });

      this.promise = resolve;
      this.myname = 'test';

      this.storyList = []
      BluetoothSerial.clear()
      this.write('l')
      this.ls = true
      this.receivedData = ''
      this.count = 0

      // this.promise = resolve;

      // resolve(['load.raw']);

      // this.resolveMyPromise = resolve;
      // this.rejectMyPromise = reject;
    });
  }

  listDone () {

  }

  play (filename) {
    if (this.s.story) {
      if (this.s.story === filename) {
        this.write('p\n');
      } else {
        this.write('s'+filename+'\n');
        this.s.story = filename
      }
    } else {
      this.write('s'+filename+'\n');
      this.s.story = filename
    }
  }

  downloadFile (filename) {
    this.write('y'+filename+'\n');
  }

  removeFile (filename) {
    this.write('r'+filename+'\n');
  }

  readFunc (data) {
    // Toast.showLongBottom(data.data);
    Toast.showLongBottom(this.myname + 'wew');
    if (this.promise === undefined) return;
    this.promise(['test']);
    if (this.ls) {
      this.storyList.push(data.data.slice(0,-2))
      
    }
    if (data.data === 'end\r\n') {
      this.ls = false
      this.promise(this.storyList)
      // this.resolveMyPromise(this.storyList);
      // this.rejectMyPromise('erorr');
      // return Promise.resolve(this.storyList);
    }
  }

  handlerLost () {
    /* if (this.state.device) {
      Toast.showLongBottom(`STORY: Connection to device ${this.state.device.name} has been lost`)
    } */
    Toast.showLongBottom('BLEU MANAGERDisconnected')
    this.s.connected = false
    //Actions.pop();
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

}