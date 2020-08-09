import React from 'react';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import COLORS from '../../constants/Colors';

import { HeaderButtons, Item, HeaderButton } from 'react-navigation-header-buttons';

const CustomsubButton = props => {
  return (
    <HeaderButton
      {...props}
      IconComponent={Ionicons}
      iconSize={23}
      color={Platform.OS === 'android' ? 'white' : COLORS.primary}
    />
  );
};

const CustomeHeaderButton = ({title, name, onPress}) => {
  return <HeaderButtons HeaderButtonComponent={CustomsubButton}>
    <Item
      title = {title}
      iconName = {name}
      onPress = {onPress}
    />
  </HeaderButtons>
};

export default CustomeHeaderButton;
