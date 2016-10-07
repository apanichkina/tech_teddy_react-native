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
import TabView from './TabView'
import TabIcon from './TabIcon'
import WiFi from './WiFi'
import Bluetooth from './Bluetooth'
import Story from './Story'

const Realm = require('realm');
const realm = new Realm({
    schema: [{name: 'Dog', properties: {name: 'string'}}]
});


//class TabIcon extends React.Component {
//    render(){
//        return (
//            <Text style={{color: this.props.selected ? 'red' :'black'}}>{this.props.title}</Text>
//            );
//    }
//}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'transparent', justifyContent: 'center',
        alignItems: 'center'
    },
    tabBarStyle: {
        backgroundColor: '#eee'
    },
    tabBarSelectedItemStyle: {
        backgroundColor: '#ddd'
    }
});
const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        // console.log("ACTION:", action);
        return defaultReducer(state, action);
    }
};

//class TabIcon extends React.Component {
//    render(){
//        return (
//            <Text style={{color: this.props.selected ? 'red' :'black'}}>{this.props.title}</Text>
//        );
//    }
//}



export default class HelloPage extends React.Component {
    render() {
        return <Router createReducer={reducerCreate} sceneStyle={{backgroundColor:'#F7F7F7'}}>

        <Scene key="root" hideNavBar={true}>
        <Scene key="launcher"  component={Launcher}  title="Добро пожаловать!" initial />
        <Scene key="signin"  component={SignIn}  title="Логин" />
        <Scene key="signup" component={SignUp} title="Регистрация"/>
            <Scene key="tabbar" tabs={true} >

                <Scene key="tab3" component={Bluetooth} title="Tab #1" icon={TabIcon}/>
                <Scene key="tab4" component={WiFi} title="Tab #2" icon={TabIcon}/>
                <Scene key="tab5" component={Story} title="Tab #3" icon={TabIcon} />
            </Scene>





        </Scene>

        </Router>;
    }

    componentDidMount() {
        FCM.requestPermissions(); // for iOS
        FCM.getFCMToken().then(token => {
            console.log(token);
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
            realm.write(() => {
                realm.create('Dog', {name: 'Rex'});
            });
            FCM.presentLocalNotification({
            id: "UNIQ_ID_STRING",                               // (optional for instant notification)
            title: notif.sum,                     // as FCM payload
            body: notif.msg})
        });
    }
}