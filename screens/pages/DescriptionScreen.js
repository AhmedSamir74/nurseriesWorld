import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, ActivityIndicator, TouchableOpacity, Image, TouchableNativeFeedback, Platform, Share } from 'react-native';
import NurseryItem from '../../components/NurseryItem';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, Entypo, AntDesign } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { Button } from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import ActionButton from 'react-native-action-button';
import Swiper from 'react-native-swiper';
import { useSelector } from 'react-redux';

const DescriptionScreen = ({ navigation }) => {
    // console.log(navigation);
    const id = navigation.getParam('item').id;
    // console.log(id);

    const [nursery, setNursery] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const countryId = useSelector(state => state.nurseries.selectedCountry);
    const userId = useSelector(state => state.auth.userId);

    // nurseryDescription['posts'][0];

    async function fetchData() {
        setLoading(true);
        const URL = 'https://www.nurseriesworld.com/ws.php?type=nurserydescription&format=json&customerid=' + userId + '&nurseryid=' + id;
        // console.log(URL);

        try {
            const response = await fetch(URL);

            if (!response.ok) {
                console.log('Something went wrong!');
                setError('Something went wrong!');
                throw new Error('Something went wrong!');
            }
            const resData = await response.json();
            setNursery(resData.posts[0]);
        } catch (err) {
            setError(err.message);
            throw err;
        }
        setLoading(false);
    }

    useEffect(useCallback(() => {
        fetchData();
    }), []);

    const onShare = async () => {
        try {
            const URL = 'https://www.nurseriesworld.com/' + nursery.name.replace(/\s/g, '') + '/nurseries/' + nursery.id + '/';
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
    const showRate = (rate) => {
        let rates = [];
        let havehalf = false;
        for (let i = 0; i < parseInt(rate); i++) {
            rates.push(<Ionicons key={Math.random() * 1} name="ios-star" size={20} color={Colors.accent} />);
        }
        if (rate % 1 <= 5 && rate % 1 > 0) {
            havehalf = true;
            rates.push(<Ionicons key={Math.random() * 2} name="ios-star-half" size={20} color={Colors.accent} />);
        }
        for (let i = havehalf ? 5 - parseInt(rate) - 1 : 5 - parseInt(rate); i > 0; i--) {
            rates.push(<Ionicons key={Math.random() * 3} name="ios-star-outline" size={20} color={Colors.accent} />);
        }
        // console.log(rates);
        return rates;
    };
    const renderReviews = (reviews) => {
        return reviews.map((element, key) => {
            return (<View key={key}>
                <View style={styles.reviewCont}>
                    <Text style={styles.reviewTitle}>{element.title}</Text>
                    <Text style={styles.reviewDesc}>{element.message}</Text>
                    <View style={styles.reviewRateDate}>
                        <View style={styles.reviewRate}>
                            {showRate(element.rate)}
                        </View>
                        <View>
                            <Text>{element.datetime}</Text>
                        </View>
                    </View>
                </View>
            </View>);
        })
    };

    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    const openLink = (link) => {
        Linking.canOpenURL(link).then(supported => {
            if (supported) {
                Linking.openURL(link);
            } else {
                console.log("Don't know how to open URI: " + link);
            }
        });
    };
    const ifAndroid = (android, ios) => {
        return Platform.OS == "android" ? android : ios;
    };
    if (loading || nursery == undefined) {
        return <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>;
    }

    if (error) {
        return <View style={styles.centered}>
            <Text style={styles.errorMessage}>{error}!</Text>
        </View>;
    }
    // console.log(JSON.stringify(nursery,null,4));
    const he = require('he');
    const description = he.decode(nursery.description.replace(/<[^>]+>/g, ''));
    return <View style={styles.screen}>
        <ScrollView scrollsToTop>
            {nursery.photos.length != 0 ? <View>
                <Swiper style={styles.wrapper} autoplay autoplayTimeout={2.5} autoplayDirection showsButtons={true}>
                    {nursery.photos.map((photo, key) => {
                        return <Image key={key} resizeMode="contain" source={{ uri: `http://nurseriesworld.com/cmsadmin/uploads/${photo.image}` }} style={styles.slide} />
                    })
                    }
                </Swiper>
            </View> : null}
            <NurseryItem
                item={nursery}
                onPress={() => { }}
                style={styles.overviewCard}
            />
            <View>
                <Text style={styles.description}>
                    {description}
                </Text>
            </View>
            <View style={styles.mapLinksCont}>
                <View style={styles.linksCont}>
                    {
                        nursery.website != "" ? <TouchableCmp onPress={openLink.bind(this, nursery.website)}>
                            <View style={styles.linkCont}>
                                <MaterialCommunityIcons
                                    name='web'
                                    size={18}
                                    color={Colors.accent}
                                />
                                <Text style={styles.linkText}>{nursery.website}</Text>
                            </View>
                        </TouchableCmp> : null
                    }
                    {
                        nursery.facebook != "" ? <TouchableCmp onPress={openLink.bind(this, nursery.facebook)}>
                            <View style={styles.linkCont}>
                                <Ionicons
                                    name='logo-facebook'
                                    size={18}
                                    color={Colors.accent}
                                />
                                <Text style={styles.linkText}>{nursery.facebook}</Text>
                            </View>
                        </TouchableCmp> : null
                    }
                    {
                        nursery.twitter != "" ? <TouchableCmp onPress={openLink.bind(this, nursery.twitter)}>
                            <View style={styles.linkCont}>
                                <Ionicons
                                    name='logo-twitter'
                                    size={18}
                                    color={Colors.accent}
                                />
                                <Text style={styles.linkText}>{nursery.twitter}</Text>
                            </View>
                        </TouchableCmp> : null
                    }
                </View>
                {
                    nursery.map != "" ? <TouchableCmp onPress={openLink.bind(this, `https://www.google.com/maps?q=${nursery.map.split(',')[0]}, ${nursery.map.split(',')[1]}&z=17&hl=en`)}>
                        <View style={styles.checkLocation}>
                            <MaterialCommunityIcons
                                name='google-maps'
                                size={40}
                                color={Colors.accent}
                            />
                            <Text>Check Location</Text>
                        </View>
                    </TouchableCmp> : null
                }
            </View>
            <View style={styles.featuresCont}>
                {
                    nursery.phone != "" ? <TouchableCmp onPress={openLink.bind(this, `tel:${nursery.phone.split(',')[0]}`)}>
                        <View style={styles.featureCont}>
                            <View style={styles.featureTitle}>
                                <MaterialIcons
                                    name='phone'
                                    size={23}
                                    color={Colors.accent}
                                />
                                <Text style={styles.featureText}>Phone : </Text>
                            </View>
                            <Text style={styles.featurevalue}>{nursery.phone}</Text>
                        </View>
                    </TouchableCmp>
                        : null
                }
                {
                    nursery.mobile != "" ?
                        <TouchableCmp onPress={openLink.bind(this, `tel:${nursery.mobile.split(',')[0]}`)}>
                            <View style={styles.featureCont}>
                                <View style={styles.featureTitle}>
                                    <Ionicons
                                        name={ifAndroid('md-phone-portrait', 'ios-phone-portrait')}
                                        size={23}
                                        color={Colors.accent}
                                    />
                                    <Text style={styles.featureText}>Mobile : </Text>
                                </View>
                                <Text style={styles.featurevalue}>{nursery.mobile}</Text>
                            </View>
                        </TouchableCmp>
                        : null
                }
                {
                    nursery.branches ?
                        nursery.branches.forEach(element => {
                            <TouchableCmp >
                                <View style={styles.featureCont}>
                                    <View style={styles.featureTitle}>
                                        <Entypo
                                            name='location-pin'
                                            size={23}
                                            color={Colors.accent}
                                        />
                                        <Text style={styles.featureText}>{element.country + " - " + element.city + " - " + element.address}</Text>
                                    </View>
                                    <Text style={styles.featurevalue}>{element.phone}</Text>
                                </View>
                            </TouchableCmp>
                        })
                        : null
                }
                {
                    nursery.wdays ?
                        <View style={styles.featureCont}>
                            <View style={styles.featureTitle}>
                                <Ionicons
                                    name={ifAndroid('md-calendar', 'ios-calendar')}
                                    size={23}
                                    color={Colors.accent}
                                />
                                <Text style={styles.featureText}>Working days : </Text>
                            </View>
                            <Text style={styles.featurevalue}>{nursery.wdays}</Text>
                        </View>
                        : null
                }
                {
                    nursery.space ?
                        <View style={styles.featureCont}>
                            <View style={styles.featureTitle}>
                                <MaterialIcons
                                    name="panorama-wide-angle"
                                    size={23}
                                    color={Colors.accent}
                                />
                                <Text style={styles.featureText}>Space : </Text>
                            </View>
                            <Text style={styles.featurevalue}>{nursery.space}</Text>
                        </View>
                        : null
                }
                {
                    nursery.activities ?
                        <View style={styles.featureCont}>
                            <View style={styles.featureTitle}>
                                <MaterialIcons
                                    name="local-activity"
                                    size={23}
                                    color={Colors.accent}
                                />
                                <Text style={styles.featureText}>Activities : </Text>
                            </View>
                            <Text style={styles.featurevalue}>{nursery.activities}</Text>
                        </View>
                        : null
                }
                {
                    nursery.ages ?
                        <View style={styles.featureCont}>
                            <View style={styles.featureTitle}>
                                <MaterialCommunityIcons
                                    name="human-female-boy"
                                    size={23}
                                    color={Colors.accent}
                                />
                                <Text style={styles.featureText}>Ages : </Text>
                            </View>
                            <Text style={styles.featurevalue}>{nursery.ages}</Text>
                        </View>
                        : null
                }
            </View>
            <View>
                <Button onPress={() => onShare()}>
                    <AntDesign
                        name='sharealt'
                        style={{ ...styles.shareText, fontSize: 22 }}
                    />
                    <Text style={styles.shareText}>Share</Text>
                </Button>
            </View>
            {
                nursery.reviews.length > 0 ? <View style={styles.reviewsCont}>
                    <Card style={styles.card}>
                        <Text style={styles.reviewsTitle}>what parents said about it</Text>
                        {
                            renderReviews(nursery.reviews)
                        }
                    </Card>
                </View> : null
            }
        </ScrollView>
        <ActionButton buttonColor={Colors.primary}>
            <ActionButton.Item buttonColor='#3498db' title="Favourite" onPress={() => { }}>
                <Ionicons name="md-heart-empty" style={styles.actionButtonIcon} />
            </ActionButton.Item>

            <ActionButton.Item buttonColor='#9b59b6' title="Write Review" onPress={() => navigation.navigate('Writereview', { id: nursery.id })}>
                <Ionicons name="md-create" style={styles.actionButtonIcon} />
            </ActionButton.Item>

            <ActionButton.Item buttonColor='#1abc9c' title="Call Us" onPress={openLink.bind(this, `tel:${nursery.mobile.split(',')[0] != "" ? nursery.mobile.split(',')[0] : nursery.phone.split(',')[0]}`)}>
                <MaterialIcons name="local-phone" style={styles.actionButtonIcon} />
            </ActionButton.Item>
        </ActionButton>
    </View>
};
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 10
    },
    description: {
        fontFamily: 'open-sans',
    },
    linkCont: {
        flexDirection: 'row',
        margin: 5
    },
    linkText: {
        marginHorizontal: 5
    },
    mapLinksCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        overflow: 'hidden'
    },
    linksCont: {
        width: '65%',
        borderRightWidth: 1,
        borderRightColor: Colors.accent
    },
    checkLocation: {
        width: '35%',
        paddingLeft: 10,
        alignItems: 'center'
    },
    featureCont: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: 'grey',
        borderBottomWidth: 0.5,
        paddingVertical: 10,
    },
    featuresCont: {
        padding: 10,
    },
    featureTitle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    featureText: {
        marginHorizontal: 5
    },
    featurevalue: {
        fontFamily: 'open-sans-bold',
        fontSize: 15,
        paddingTop: 2,
    },
    shareText: {
        alignSelf: 'center',
        marginHorizontal: 5,
        color: 'white',
        fontSize: 20
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
    actionButtonIcon: {
        fontSize: 20,
        height: 22,
        color: 'white',
    },
    wrapper: {
        flex: 1,
        height: 200,
    },
    slide: {
        flex: 1
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
export { DescriptionScreen };
