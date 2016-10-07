/**
 * Created by anna on 07.10.16.
 */
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
const Loader = React.createClass({
    render: function() {
        return (
            <View style={styles.container}>
                <Bars size={10} color='#8e44ad' />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    loader: {
        flex: 1,
        justifyContent: 'center'
    }
});

module.exports = Loader;