import React from 'react';
import { Platform, TouchableOpacity, TouchableNativeFeedback, Image } from 'react-native';

let TouchableCmp = TouchableOpacity;

if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
}

const LogoComp = ({ navigation }) => {
    return <TouchableCmp onPress={() => navigation.goBack()}>
        <Image style={{ width: 100, height: '70%', flex: 1 }} resizeMode="contain" source={require('../../assets/img/app-logo.jpg')} />
    </TouchableCmp>
};

export default LogoComp;