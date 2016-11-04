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
  title: 'Сказки',
  disconnected: 'Разрыв соединения'
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
      isRefreshing: false,
      story: null
    }

    this.ls = false
    this.storyList = []
    this.count = 0
    this.receivedData = ''

    this.handler = this.handlerLost.bind(this)
    this.read = this.readFunc.bind(this)
  }

  getStoryList () {
    this.storyList = []
    BluetoothSerial.clear();
    this.write('l')
    this.ls = true
    this.setState({ incommingData: '' })
    this.receivedData = ''
    this.count = 0
  }

  play (filename) {
    if (this.state.story) {
      if (this.state.story === filename) {
        this.write('p\n');
      } else {
        this.write('s'+filename+'\n');
        this.setState({ story: filename })
      }
    } else {
      this.write('s'+filename+'\n');
      this.setState({ story: filename })
    }
  }

  downloadFile (filename) {
    this.write('y'+filename+'\n');
  }

  removeFile (filename) {
    this.write('r'+filename+'\n');
  }

  componentWillMount () {
    BluetoothSerial.on('connectionLost', this.handler)
    BluetoothSerial.on('data', this.read);
    this.subscribe('\n');
  }

  componentDidMount () {
    setTimeout(this.getStoryList.bind(this), 500);
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
    /* if (this.state.device) {
      Toast.showLongBottom(`STORY: Connection to device ${this.state.device.name} has been lost`)
    } */
    Toast.showLongBottom(strings.disconnected)
    this.setState({ connected: false })
    //Actions.pop();
  }

  componentWillUnmount () {
    this.unsubscribe()
    Toast.showLongBottom('STORY: unsubscribe')
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

  settingsPress() {
    Actions.settings();
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.getStoryList();
  }

  render() {

    const rows = this.state.storyList.map((name, i) => {
      if (name.endsWith('.raw')) {
        return (
          <TouchableOpacity
            key={`${name}_${i}`}
            style={styles.listItem}
            onPress={this.play.bind(this, name)}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>{`<${name}>`}</Text>
            </View>
          </TouchableOpacity>
        )
      }
    });

      return (
      <View style={styles.container} >
        <View style={styles.inline}>
          <Text style={styles.heading}>{strings.title}</Text>
          <Button onPress={() => this.settingsPress()}>Wi-Fi</Button>
        </View>
        {/* <Button
            containerStyle={styles.buttonStyle7}
            style={styles.textStyle6}
            onPress={this.getStoryList.bind(this)}>
            Список
        </Button> */}
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
        {/* <View style={styles.listContainer}>
          {this.state.storyList.map((name, i) => {
            if (name.endsWith('.raw')) {
              return (
                <TouchableOpacity
                  key={`${name}_${i}`}
                  style={styles.listItem}
                  onPress={this.play.bind(this, name)}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{`<${name}>`}</Text>
                  </View>
                </TouchableOpacity>
              )
            }
          })}
        </View> */}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
              dataSource={this.state.storyList}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
            />
          }
        >
          {rows}
        </ScrollView>
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
    inline: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40,
        paddingHorizontal: 25,
        alignItems: 'center'
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