import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import CustomeHeader from '../../components/UI/CustomeHeader';
import { Text } from 'react-native-elements';
import Colors from '../../constants/Colors';
import HTML from 'react-native-render-html';

const AboutAppScreen = ({ navigation }) => {
    const [description, setDescription] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    async function fetchData() {
        setLoading(true);

        try {
            const response = await fetch('https://www.nurseriesworld.com/ws.php?type=select_one&format=json&table=pages&columns=description&condition=id=29');

            if (!response.ok) {
                console.log('Something went wrong!');
                setError('Something went wrong!');
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            setLoading(false);
            setDescription(resData.posts[0].description);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    useEffect(useCallback(() => {
        fetchData();
    }), []);

    return <View style={styles.screen}>
        <CustomeHeader navigation={navigation} />

        {
            loading ?
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
                : error ?
                    <View style={styles.centered}>
                        <Text style={styles.errorMessage}>{error}!</Text>
                    </View>
                    : <View>
                        <Text h3 style={styles.title}>About The App</Text>
                        <View style={styles.description}>
                            <HTML style={styles.description} html={description} imagesMaxWidth={Dimensions.get('window').width} />
                        </View>
                    </View>
        }
    </View>
};

const styles = StyleSheet.create({
    screen:{
        flex:1
    },
    title: {
        textAlign: 'center',
        margin: 10
    },
    description: {
        padding: 22,
        fontFamily: 'open-sans',
        fontSize: 19,
        textAlign: 'justify'
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorMessage: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        margin: 15,
        color: Colors.danger,
        textAlign: 'center'
    },
});

export { AboutAppScreen };
