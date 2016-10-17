// import React, {AppRegistry, Navigator, StyleSheet, Text, View} from 'react-native'
// import Launch from './components/Launch'
// import Register from './components/Register'
// import Login from './components/Login'
// import Login2 from './components/Login2'

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
// import Error from './components/Error'
// import Home from './components/Home'
// import TabView from './components/TabView'
import Launcher from './Launcher'
import SignUp from './SignupComp'
import SignIn from './SigninComp'
//import Main from './MainPage'
import NavigationDrawer from './NavigationDrawer'

import TabIcon from './TabIcon'
import WiFi from './WiFi'
import Bluetooth from './Bluetooth'
import Story from './Story'
import ClockAlarm from './ClockAlarm'
import Education from './Education'

const Realm = require('realm');
const realm = new Realm({
    schema: [{name: 'Token', primaryKey: 'name', properties: {name: 'string', token : 'string'}}]
});


const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        // console.log("ACTION:", action);
        return defaultReducer(state, action);
    }
};

export default class HelloPage extends React.Component {
    render() {
        return <Router createReducer={reducerCreate} sceneStyle={{backgroundColor:'#FFFFFF'}}>

        <Scene key="root" hideNavBar={true}>
            <Scene key="launcher"  component={Launcher}  title="Добро пожаловать!" initial />
            <Scene key="signin"  component={SignIn}  title="Логин" />
            <Scene key="signup" component={SignUp} title="Регистрация"/>
            <Scene key="bluetooth" component={Bluetooth} title="Выбери медведя"/>
            <Scene key="tabbar" tabs={true} >
                <Scene key="tab3" component={ClockAlarm} title="clock alarm" icon={TabIcon} hideNavBar={true}/>
                <Scene key="tab4" component={Education} title="education" icon={TabIcon} hideNavBar={true}/>
                <Scene key="tab5" component={Story} title="story" icon={TabIcon} hideNavBar={true} />
            </Scene>
        </Scene>

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