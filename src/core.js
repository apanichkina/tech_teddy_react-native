import React from 'react'
import {
    AppRegistry,
    StyleSheet,
    View,
    Text } from 'react-native'


import {
    Router,
    Scene} from 'react-native-router-flux'

import {
    Provider} from 'react-redux'


export default function native (platform) {
  let techteddy = React.createClass({
    render () {
      const store = configureStore(getInitialState())

            // configureStore will combine reducers from snowflake and main application
            // it will then create the store based on aggregate state from all reducers
      store.dispatch(setPlatform(platform))
      store.dispatch(setVersion(VERSION))
      store.dispatch(setStore(store))

            // setup the router table with App selected as the initial component
            // note: See https://github.com/aksonov/react-native-router-flux/issues/948
      return (

        <Provider store={store}>
          <Router sceneStyle={{ backgroundColor: 'white' }}>
            <Scene key='root' hideNavBar>
              <Scene key='App'
                component={App}
                type='replace'
                initial />

              <Scene key='InitialLoginForm'
                component={Register}
                type='replace' />

              <Scene key='Login'
                component={Login}
                type='replace' />

              <Scene key='Register'
                component={Register}
                type='replace' />

              <Scene key='ForgotPassword'
                component={ForgotPassword}
                type='replace' />

              <Scene key='Subview'
                component={Subview} />

              <Scene key='Tabbar'
                tabs
                hideNavBar
                tabBarStyle={styles.tabBar}
                default='Main'>

                <Scene key='Logout'
                  title={I18n.t('Snowflake.logout')}
                  icon={TabIcon}
                  iconName={"sign-out"}
                  hideNavBar
                  component={Logout} />

                <Scene key='Main'
                  title={I18n.t('Main')}
                  iconName={"home"}
                  icon={TabIcon}
                  hideNavBar
                  component={Main}
                  initial />

                <Scene key='Profile'
                  title={I18n.t('Profile')}
                  icon={TabIcon}
                  iconName={"gear"}
                  hideNavBar
                  component={Profile} />
              </Scene>
            </Scene>
          </Router>
        </Provider>
      )
    }
  })