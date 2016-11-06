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

// import BluetoothSerial from 'react-native-bluetooth-hc05'

import TeddyBluetooth from './TeddyBluetooth'

import ToastError from './ToastError'
var E = new ToastError('Story')

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
      refreshing: true,
      story: null
    }
  }

  getStoryList () {
    this.setState({refreshing: true});
    BL.getStoryList()
      .then((result) => {
        this.setState({
          storyList: result,
          refreshing: false
        })
      })
      .catch((error) => {
        E.short(error, 'getStoryList')
        this.setState({
          refreshing: false
        })
      });
  }

  play (filename) {
    var playNewStory = false
    if (BL.story) {
      if (BL.story === filename) {
        BL.pause_unpause()
        .then((res) => { this.setState({ incommingData: res }) })
        .catch((error) => { E.long(error, 'pause_unpause') });
      } else {
        playNewStory = true
      }
    } else {
      playNewStory = true
    }

    if (playNewStory) {
      BL.play(filename)
      .then((res) => {
        this.setState({ incommingData: res })
        BL.story = filename
      })
      .catch((error) => { E.long(error, 'play') });
      // this.setState({ story: filename })
    }
  }

  downloadFile (filename) {
    BL.downloadFile(filename)
      .then((res) => { this.setState({ incommingData: res }) })
      .catch((error) => { E.long(error, 'downloadFile') });
  }

  removeFile (filename) {
    BL.removeFile(filename)
      .then((res) => {
        this.setState({ incommingData: res })
        this.getStoryList()
      })
      .catch((error) => { E.long(error, 'removeFile') });
  }

  componentWillMount () {}

  componentDidMount () {
    setTimeout(this.getStoryList.bind(this), 500);
  }

  componentWillUnmount () {}

  settingsPress() {
    Actions.settings();
  }

  _onRefresh() {
    this.getStoryList();
  }

  render() {

    const rows = this.state.storyList.map((name, i) => {
      if (name.endsWith('.raw')) {
        return (
          <View
            key={`${name}_${i}`}
            style={styles.listItem} >
            <TouchableOpacity
              style={{width: 100}}              
              onPress={this.play.bind(this, name)}>
                <Text>{`${name}`}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{width: 30, alignSelf: 'flex-end'}}              
              onPress={this.removeFile.bind(this, name)}>
              <Text>DEL</Text>
            </TouchableOpacity>
          </View>
        )
      }
    });

    return (
      <View style={styles.container} >
        <View style={styles.inline}>
          <Text style={styles.heading}>{strings.title}</Text>
          <Button onPress={() => this.settingsPress()}>Wi-Fi</Button>
        </View>
        {/* <View>
          <Text>
             incomming data: {this.state.incommingData || 'nothing'} 
          </Text>
        </View>
        <View>
          <Text>
             send: {this.state.story} 
          </Text> 
        </View> */}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.getStoryList.bind(this)}
              dataSource={this.state.storyList}
              tintColor="#ff0000"
              title="Loading..."
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
            />
          }>
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
      flexDirection: 'row',
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