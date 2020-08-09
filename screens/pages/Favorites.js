import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import CustomeHeader from '../../components/UI/CustomeHeader';
import Colors from '../../constants/Colors';
import { useSelector } from 'react-redux';
import FavoriteItem from '../../components/UI/FavoriteItem';

const Favorites = ({ navigation }) => {
    const [nurseries, setNurseries] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const userId = useSelector(state => state.auth.userId);

    async function fetchData() {
        setLoading(true);

        try {
            const response = await fetch('https://www.nurseriesworld.com/ws.php?type=favoriteslist&format=json&customerid=' + userId);

            if (!response.ok) {
                console.log('Something went wrong!');
                setError('Something went wrong!');
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            // console.log(resData);
            setNurseries(resData.posts);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }

    useEffect(useCallback(() => {
        fetchData();
    }), []);

    return <View>
        <CustomeHeader navigation={navigation} />

        <View style={styles.screen}>
            <FlatList
                data={nurseries}
                renderItem={({ item, index }) => {
                    return <FavoriteItem item={item} checked={true} />
                }}
                style={styles.flatList}
            />
        </View>
    </View>
};

const styles = StyleSheet.create({
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

export { Favorites };
