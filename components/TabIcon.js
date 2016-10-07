import React, {
    PropTypes,
    } from 'react';

import { View, Text, StyleSheet, Image } from 'react-native';
const propTypes = {
    selected: PropTypes.bool,
    title: PropTypes.string
};

const TabIcon = (props) => (
    //<Text
    //    style={{ color: props.selected ? 'red' : 'black' }}
    //    >
    //    {props.title}
    //</Text>
    <Image
        style={{ color: props.selected ? 'red' : 'black' }}
source={require(props.title)}
/>
);

TabIcon.propTypes = propTypes;

export default TabIcon;