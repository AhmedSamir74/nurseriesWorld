import React from 'react';
import { View, Text, StyleSheet, Image, Platform, TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import Card from '../components/UI/Card';

const BlogItem = ({ item, onPress, style }) => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    const logoPath = 'https://www.nurseriesworld.com/cmsadmin/upload/blog/' + item.image;
    return (
        <Card style={{ ...style, ...styles.card }}>
            <View style={styles.touchable}>
                <TouchableCmp onPress={onPress} useForeground>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <Image source={{ uri: logoPath }} style={styles.logo} />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>{item.title}</Text>
                            <View style={{ marginBottom: 5 }}>
                                <Text style={styles.date}>{item.publish_date}</Text>
                            </View>
                            <View style={{ marginBottom: 5 }}>
                                <Text style={styles.textContent}>{item.brief}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableCmp>
            </View>
        </Card>
    );
};
const styles = StyleSheet.create({
    logo: {
        width: '30%',
        height: 100,
        borderRadius: 10,
        marginRight: 5,
    },
    touchable: {
        borderRadius: 10,
        overflow: 'hidden'
    },
    card: {
        marginVertical: 8,
        padding: 8
    },
    textContainer: {
        flex: 1,
        paddingLeft: 5
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    date:{
        color:'grey',
        fontFamily: 'open-sans',
    },
    textContent: {
        fontFamily: 'open-sans',
        height:60,
        overflow: 'hidden',
    },
});
export default BlogItem;
