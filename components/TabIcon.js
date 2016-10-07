import React, {
    PropTypes,
    } from 'react';

import { View, Text, StyleSheet, Image } from 'react-native';
const propTypes = {
    selected: PropTypes.bool,
    title: PropTypes.string
};

const TabIcon = (props) => (

    <Image
        style={{ width: 35,height: 35, tintColor: props.selected ? '#8e44ad' : '#9E9E9E' }}
source={require('../img/bluetooth_white_24dp.png')}
/>
);

TabIcon.propTypes = propTypes;

export default TabIcon;