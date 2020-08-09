import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import CustomeHeader from '../../components/UI/CustomeHeader';
import { Text } from 'react-native-elements';

import HTML from 'react-native-render-html';

import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';

const FaqScreen = ({ navigation }) => {
    const [faq, setFaq] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    async function fetchData() {
        setLoading(true);

        try {
            const response = await fetch('https://www.nurseriesworld.com/ws.php?type=select_one&format=json&table=faqs&columns=*&condition=active=1');

            if (!response.ok) {
                console.log('Something went wrong!');
                setError('Something went wrong!');
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            // console.log(resData['posts']);
            setLoading(false);
            setFaq(resData.posts);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    useEffect(useCallback(() => {
        fetchData();
    }), []);

    return <View style={{ flex: 1 }}>
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
                    : <View style={{ flex: 1 }}>
                        <Text h3 style={styles.title}>NURSERIES FAQ</Text>
                        <View style={styles.screen}>
                            <FlatList
                                data={faq}
                                renderItem={({ item }) => <Card style={styles.faqItem}>
                                    <Text h4>{item.question}</Text>
                                    <HTML html={item.answer.replace('Arial\g', '')} imagesMaxWidth={Dimensions.get('window').width} />
                                </Card>}
                            />
                        </View>
                    </View>
        }
    </View>
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10,
        paddingBottom: 5
    },
    title: {
        textAlign: 'center',
        margin: 10
    },
    faqItem: {
        backgroundColor: '#efeff4',
        marginVertical: 10,
        padding: 10
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

export { FaqScreen };
