import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';

const Button = ({ onPress, children }) => {
  const { textStyle, buttonStyle } = styles;
  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <View style={textStyle}>{children}</View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    flex:1,
    alignSelf: 'center',
    flexDirection:'row',
    color: 'white',
    paddingTop: 10,
    paddingBottom: 10,
  },
  buttonStyle: {
    width: '40%',
    alignSelf: 'center',
    backgroundColor: Colors.accent,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius:8,
    marginLeft: 5,
    marginRight: 5,
  },
});

export { Button };
