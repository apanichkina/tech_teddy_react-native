
import React, {
  Component,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FCM from 'react-native-fcm';
import { Scene, Router, TabBar, Modal, Schema, Actions, Reducer, ActionConst } from 'react-native-router-flux'
import Launcher from './Launcher'
import SignUp from './SignupComp'
import SignIn from './SigninComp'
import NavigationDrawer from './NavigationDrawer'
import TabIcon from './TabIcon'
import WiFi from './WiFi'
import Bluetooth from './Bluetooth'
import Story from './Story'
import ClockAlarm from './ClockAlarm'
import Education from './Education'
import Settings from './Settings'

import Store from './StoryStore'
import Account from './Account'
import Page from './Page'

import BluetoothSerial from 'react-native-bluetooth-hc05'
import Toast from '@remobile/react-native-toast'

const Realm = require('realm');
const realm = new Realm({
    schema: [{
        name: 'Token',
        primaryKey: 'name',
        properties: {
            name: 'string',
            token : 'string'
        }
    }]
});

const device = new Realm({
    schema: [{
        name: 'Device',
        primaryKey: 'name',
        properties: {
            name: 'string',
            id: 'string',
            token : 'string'
        }
    }]
});

global.device = false;
global.alarm = {
    days: [false, false, false, false, false, false, false],
    active: false,
    time: new Date(),
    lightActive: false,
    vibroActive: false,
    soundActive: false
}

const strings = {
  title: 'Сказки',
  disconnected: 'Разрыв соединения'
}

const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        // console.log("ACTION:", action);
        return defaultReducer(state, action);
    }
};

export default class HelloPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {isAuth: false};
        let tokens = realm.objects('Token');
        let bearToken = tokens.filtered('name = "bearToken"');
        let bearStr = "";
        if (bearToken.length == 1){
                this.state = {isAuth: true};
        }
        console.log(this.state.isAuth)

        // BLUETOOTH
        this.handler = this.handlerLost.bind(this)
    }

    componentWillMount() {
        BluetoothSerial.on('connectionLost', this.handler)
    }

    componentWIllUnmount() {
        BluetoothSerial.off('connectionLost', this.handler)
    }

    handlerLost () {
        // Toast.showLongBottom('ROUTER: '+strings.disconnected)
        this.setState({ connected: false })
        global.device = false;
        // Actions.pop();
    }

    render() {
        return <Router createReducer={reducerCreate} sceneStyle={{backgroundColor:'#FFFFFF'}}>
        <Scene key="root" hideNavBar={true}>
        <Scene key="launcher"  component={Launcher}  title="Добро пожаловать!" initial={!this.state.isAuth ? true : false} />
        <Scene key="signin"  component={SignIn}  title="Логин" />
        <Scene key="signup" component={SignUp} title="Регистрация"/>
        <Scene key="tab4" component={WiFi} title="wifi" icon={TabIcon} hideNavBar={true} />
        <Scene key="mishka" tabs={true}>
            <Scene key="story" component={Story} title="story" icon={TabIcon} hideNavBar={true} />
            <Scene key="education" component={Education} title="education" icon={TabIcon} hideNavBar={true} />        
            <Scene key="clockalarm" component={ClockAlarm} title="clockalarm" icon={TabIcon} hideNavBar={true} />
        </Scene>
        <Scene key="main" type={ActionConst.RESET} initial={this.state.isAuth ? true : false}>
            <Scene key="tabbar" tabs={true}>
                <Scene key="tab3" component={Bluetooth} title="bluetooth" icon={TabIcon} hideNavBar={true} />                
                <Scene key="store" component={Store} title="store" icon={TabIcon} hideNavBar={true} />
                <Scene key="account" component={Account} title="account" icon={TabIcon} hideNavBar={true} />
            </Scene>
        </Scene>
        <Scene key="page" component={Page} title="stortty" hideNavBar={true} />
        </Scene>
        <Scene key="settings"  component={Settings}  title="Настройки" />
        </Router>;
    }

    componentDidMount() {
        let tokens = realm.objects('Token');
        let FCMToken = tokens.filtered('name = "FCM"');
        console.log(FCMToken.length);
        FCM.requestPermissions(); // for iOS
        FCM.getFCMToken().then(token => {
            console.log(token);
            if (FCMToken.length == 0)
            {
            realm.write(() => {
                realm.create('Token', {name: 'FCM', token:token});
            });
        }
            // store fcm token in your server
        });
        FCM.getInitialNotification().then(notif=>{
            console.log("getInitialNotification:");
            console.log(notif)
        }
        );
        FCM.on('notification', (notif) => {
            console.log("on notification:");
            console.log(notif);
            FCM.presentLocalNotification({
            id: "UNIQ_ID_STRING",                               // (optional for instant notification)
            title: notif.sum,                     // as FCM payload
            body: notif.msg})
        });
    }
}