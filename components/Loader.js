/**
 * Created by anna on 07.10.16.
 */
import React, { Component } from 'react';
import {
    View,
    } from 'react-native'
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
const Loader = React.createClass({
    render: function() {
        return (
            <View>
                <Bars size={10} color='#8e44ad' />
            </View>
        );
    }
});

module.exports = Loader;