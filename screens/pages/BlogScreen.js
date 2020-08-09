import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import BlogItem from '../../components/BlogItem';
import { Text } from 'react-native-elements';
import Colors from '../../constants/Colors';

const BlogScreen = ({ navigation }) => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();

    const [from, setFrom] = useState(0);

    const fetchBlogs = useCallback(async (newFrom) => {
        setIsRefreshing(true);
        if (newFrom == null) {
            newFrom = from;
            setFrom(0);
        }
        // console.log(newFrom);

        try {
            const response = await fetch('https://www.nurseriesworld.com/ws.php?type=bloglisting&format=json&limit=' + newFrom + ',100');

            if (!response.ok) {
                console.log('Something went wrong!');
                setError('Something went wrong!');
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            // console.log(resData['posts']);
            if (resData.posts[0] != 0) {
                if (blogs.length != 0) {
                    setBlogs([...blogs, ...resData.posts]);
                } else {
                    setBlogs(resData.posts);
                }
            }
        } catch (err) {
            setError(err.message);
            throw err;
        }
        setIsRefreshing(false);
    }, [setIsRefreshing, setError, setLoading]);

    useEffect(() => {
        setLoading(true);
        fetchBlogs(0).then(() => {
            setLoading(false);
        });
    }, [setLoading]);
    // console.log(blogs);

    return <View style={{ flex: 1 }}>

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
                        <Text h3 style={styles.title}>BLOG NEWS</Text>
                        <View style={styles.screen}>
                            <FlatList
                                refreshing={refreshing}
                                onRefresh={fetchBlogs}
                                data={blogs}
                                keyExtractor={(val, key) => 'item' + key}
                                renderItem={({ item }) => <BlogItem item={item} onPress={() => navigation.navigate('BlogDetails', { item })} />}
                                onEndReachedThreshold={1}
                                onEndReached={({ distanceFromEnd }) => {
                                    // if (blogs.length >= 4) {
                                    //     const newFrom = from + 10;
                                    //     setFrom(newFrom);
                                    //     fetchBlogs(newFrom);
                                    // }
                                }}
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
        marginTop: 10
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

export { BlogScreen };
