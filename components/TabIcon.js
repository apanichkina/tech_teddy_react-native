import React, {
    PropTypes,
    } from 'react';

import { View, Text, StyleSheet, Image } from 'react-native';
const propTypes = {
    selected: PropTypes.bool,
    title: PropTypes.string
};

const TabIcon = (props) => (

    <View>
        {/*<Image
         style={{ width: 35,height: 35, tintColor: props.selected ? '#8e44ad' : '#9E9E9E' }}
         source={require('../img/accessible_white_24dp.png')}
         /> */}
        {props.title == 'store' &&
        <Image
            style={{ width: 35,height: 35, tintColor: props.selected ? '#8e44ad' : '#9E9E9E' }}
            source={require('../img/shopping_basket_white_24dp.png')}
            />
        }
        {props.title == 'bluetooth' &&
        <Image
            style={{ width: 35,height: 35, tintColor: props.selected ? '#8e44ad' : '#9E9E9E' }}
            source={require('../img/bluetooth_white_24dp.png')}
            />
        }
        {props.title == 'wifi' &&
        <Image
            style={{ width: 35,height: 35, tintColor: props.selected ? '#8e44ad' : '#9E9E9E' }}
            source={require('../img/wifi_white_24dp.png')}
            />
        }
        {props.title == 'story' &&
        <Image
            style={{ width: 35,height: 35, tintColor: props.selected ? '#8e44ad' : '#9E9E9E' }}
            source={require('../img/play_arrow_white_24dp.png')}
            />
        }
        {props.title == 'account' &&
        <Image
            style={{ width: 35,height: 35, tintColor: props.selected ? '#8e44ad' : '#9E9E9E' }}
            source={require('../img/account_white_24dp.png')}
            />
        }

    </View>
)

TabIcon.propTypes = propTypes;

export default TabIcon;