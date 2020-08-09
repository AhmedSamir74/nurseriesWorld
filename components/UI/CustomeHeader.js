import React from 'react';
import { Platform } from 'react-native';
import { Header } from 'react-native-elements';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import LogoComp from './LogoComp';

const CustomeHeader = ({ navigation }) => {
    return <Header
        leftComponent={<Ionicons
            title="Menu"
            size={23}
            color='#fff'
            name={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
            onPress={() => {
                navigation.toggleDrawer();
            }}
        />}
        centerComponent={<LogoComp navigation={navigation} />}
        rightComponent={{ icon: 'home', color: '#fff', onPress: () => navigation.goBack() }}
        containerStyle={{
            backgroundColor: Platform.OS == 'android' ? Colors.primary : '',
            justifyContent: 'space-around',
        }}
    />;
};

export default CustomeHeader;
