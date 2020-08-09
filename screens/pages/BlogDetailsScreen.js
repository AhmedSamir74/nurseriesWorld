import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions, ScrollView, Share } from 'react-native';
import { Text, Image } from 'react-native-elements';
import { AntDesign, EvilIcons } from '@expo/vector-icons';
import { Button } from '../../components/UI/Button';

import {useSelector} from 'react-redux';

import HTML from 'react-native-render-html';
import Card from '../../components/UI/Card';
import Prompt from 'react-native-prompt';
import Toast from 'react-native-simple-toast';

import Colors from '../../constants/Colors';

const BlogDetailsScreen = ({ navigation }) => {
    const blog = navigation.getParam('item');
    // console.log(blog);
    const [promptVisible, sePromptVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    const countryId = useSelector(state => state.nurseries.selectedCountry);
    const userId = useSelector(state => state.auth.userId);

    const renderComments = (reviews) => {
        return reviews.map((element, key) => {
            return (<View key={key}>
                <View style={styles.reviewCont}>
                    <Text style={styles.reviewTitle}>{element.name}</Text>
                    <Text style={styles.reviewDesc}>{element.comment}</Text>
                    <View style={styles.reviewRateDate}>
                        <View>
                            <Text>{element.date}</Text>
                        </View>
                    </View>
                </View>
            </View>);
        })
    };
    const onShare = async () => {
        try {
            const URL = 'http://nurseriesworld.com/blog_' + blog.id + "_";
            const result = await Share.share({
                title: 'Pick an app',
                message: URL,
                url: URL
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };
    const onComment = () => {
        sePromptVisible(true);
    };

    if (loading || blog == undefined) {
        return <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>;
    }

    if (error) {
        return <View style={styles.centered}>
            <Text style={styles.errorMessage}>{error}!</Text>
        </View>;
    }
    return <ScrollView style={styles.screen}>
        <View style={styles.screen}>
            <Prompt
                title="Say Something"
                placeholder="Your Comment"
                visible={promptVisible}
                onCancel={() => { sePromptVisible(false); }}
                onSubmit={async (value) => {
                    sePromptVisible(false);
                    console.log(value);
                    const URL = 'https://www.nurseriesworld.com/ws.php?type=insert&format=json&countryid=' + countryId + '&table=comments&columns=articleid,customerid,comment&values=' + blog.id + ',' + userId + ',"' + value + '"';
                    try {
                        const response = await fetch(URL);

                        if (!response.ok) {
                            console.log('Something went wrong!');
                            setError('Something went wrong!');
                            throw new Error('Something went wrong!');
                        }
                        const resData = await response.json();
                        if(resData.posts[0]!=0){
                            Toast.show('Thanks for your comment.');
                        }
                    } catch (err) {
                        setError(err.message);
                        throw err;
                    }
                }} />
            <Text style={styles.title} h3>{blog.title}</Text>
            <Text style={styles.date}>Date : {blog.date}</Text>
            <Image
                source={{ uri: `http://nurseriesworld.com/cmsadmin/upload/blog/${blog.image}` }}
                style={styles.image}
                PlaceholderContent={<ActivityIndicator />}
            />
            <Text style={styles.brief}>{blog.brief}</Text>
            <HTML html={blog.description.replace('Arial\g', '')} imagesMaxWidth={Dimensions.get('window').width} />
            {
                blog.comments[0] != 0 ? <View style={styles.reviewsCont}>
                    <Card style={styles.card}>
                        <Text style={styles.reviewsTitle}>Comments</Text>
                        {
                            renderComments(blog.comments)
                        }
                    </Card>
                </View> : null
            }
            <View style={styles.btnContainer}>
                <Button onPress={onComment}>
                    <EvilIcons
                        name='comment'
                        style={{ ...styles.shareText, fontSize: 23 }}
                    />
                    <Text style={styles.shareText}>Comment</Text>
                </Button>
                <Button onPress={() => { onShare() }}>
                    <AntDesign
                        name='sharealt'
                        style={{ ...styles.shareText, fontSize: 22 }}
                    />
                    <Text style={styles.shareText}>Share</Text>
                </Button>
            </View>
        </View>
    </ScrollView>
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10
    },
    title: {
        marginBottom: 20,
    },
    date: {
        fontFamily: 'open-sans',
        fontSize: 15,
        color: 'grey',
        marginBottom: 15
    },
    image: {
        width: '100%',
        height: 200,
    },
    brief: {
        marginVertical: 15,
        fontFamily: 'open-sans',
        fontSize: 18,
    },
    btnContainer: {
        flexDirection: 'row',
        width: '100%',
        marginVertical: 15,
        justifyContent: 'space-around'
    },
    shareText: {
        alignSelf: 'center',
        marginHorizontal: 5,
        color: 'white',
        fontSize: 18
    },
    reviewsCont: {
        marginVertical: 10,
    },
    card: {
        padding: 10
    },
    reviewCont: {
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        padding: 10
    },
    reviewsTitle: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        flex: 1,
        textAlign: 'center',
        padding: 5
    },
    reviewTitle: {
        fontSize: 18,
        flex: 1,
        textAlign: 'center',
        fontWeight: '800'
    },
    reviewDesc: {
        fontSize: 15,
        color: 'grey',
        minHeight: 70
    },
    reviewRateDate: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    reviewRate: {
        flexDirection: 'row'
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

export { BlogDetailsScreen };
