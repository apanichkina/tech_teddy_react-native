import React from 'react';
import {PropTypes} from "react";
import {StyleSheet, Text, View} from "react-native";
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';

const contextTypes = {
    drawer: React.PropTypes.object
};

const propTypes = {
    name: PropTypes.string,
    sceneStyle: View.propTypes.style,
    title: PropTypes.string
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    }
});

const TabView = (props, context) => {
    const drawer = context.drawer;
    return (
        <View style={[styles.container, props.sceneStyle ]}>
            <View style={styles.container}>
                             <Text>Это главная страничка</Text>
                               {props.session &&
                <Text>{props.session}</Text>
                }

            </View>

        </View>
    );
};

TabView.contextTypes = contextTypes;
TabView.propTypes = propTypes;

export default TabView;