import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Platform, TouchableNativeFeedback, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../components/UI/Card';
import Colors from '../constants/Colors';
import { handleFav } from '../store/actions/nurseries';

const showRate = (rate, id) => {
    let rates = [];
    let havehalf = false;
    for (let i = 0; i < rate; i++) {
        rates.push(<Ionicons style={{ marginRight: 5 }} key={Math.random() * 1} name="ios-star" size={23} color={Colors.accent} />);
    }

    if (rate % 1 <= 5 && rate % 1 > 0) {
        havehalf = true;
        rates.push(<Ionicons style={{ marginRight: 5 }} key={Math.random() * 2} name="ios-star-half" size={23} color={Colors.accent} />);
    }
    for (let i = havehalf ? 5 - parseInt(rate) - 1 : 5 - parseInt(rate); i > 0; i--) {
        rates.push(<Ionicons style={{ marginRight: 5 }} key={Math.random() * 3} name="ios-star-outline" size={23} color={Colors.accent} />);
    }
    // console.log(rates);

    return rates;
};

const NurseryItem = ({ navigation, item, onPress, style }) => {

    const dispatch = useDispatch();
    const userId = useSelector(state => state.auth.userId);
    const [inFav, setInFav] = useState(item.infav);  
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    const logoPath = 'https://www.nurseriesworld.com/cmsadmin/upload/nurseries/' + item.logo;
    const onFavorite = async () => {
        if (userId == null) {
            Alert.alert(
                'Authentication',
                'you have to login in order to add this nursery you to favorite list',
                [
                    {
                        text: 'Login',
                        onPress: () => navigation.navigate('auth'),
                        style: 'cancel',
                    },
                ],
                { cancelable: false },
            );
        } else {
            // is fav ==0 => not in fav list so add
            // console.log(item.id+" = "+inFav);
            const newInFav = inFav == 0 ? true : false;

            await dispatch(handleFav(item.id, inFav));
            await setInFav(newInFav);
        }
    };

    useEffect(() => {
        const newInFav = item.infav
        setInFav(newInFav);
    }, [setInFav, item.infav]);

    return (
        <Card style={{ ...style, ...styles.card }}>
            <View style={styles.touchable}>
                <TouchableCmp onPress={onPress} useForeground>
                    <View style={styles.cardContainer}>
                        <Image source={{ uri: logoPath }} style={styles.logo} />
                        <View style={styles.textContainer}>
                            <View style={styles.titleContainer}>
                                <View style={styles.title}>
                                    <Text style={{ fontFamily: 'open-sans-bold', fontSize: 16 }}>{item.name}</Text>
                                </View>
                                <TouchableCmp onPress={onFavorite}>
                                    <Ionicons
                                        name={Platform.OS == "android" ? (inFav ? 'md-heart' : 'md-heart-empty') : (inFav ? 'ios-heart' : 'ios-heart-empty')}
                                        size={23}
                                        color={Colors.accent}
                                    />
                                </TouchableCmp>
                            </View>
                            <View style={{ marginBottom: 5 }}>
                                <Text style={styles.textTitle}>Address:</Text>
                                <Text style={styles.textContent}>{item.address}</Text>
                            </View>
                            <View style={{ marginBottom: 5 }}>
                                <Text style={styles.textTitle}>Languages:</Text>
                                <Text style={styles.textContent}>{item.languagedesc != undefined ? item.languagedesc : item.languages}</Text>
                            </View>
                            <View style={styles.ratingCont}>
                                {showRate(item.ratingAverage != undefined ? item.ratingAverage : item.rating, item.id)}
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
        width: '45%',
        height: 140,
        borderRadius: 10,
        marginRight: 10,
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
        // flexDirection:'row',
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 5
    },
    title: {
        textAlign: "center",
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    textTitle: {
        fontFamily: 'open-sans-bold',
    },
    textContent: {
        flexDirection: 'row',
        flex: 1,
        fontFamily: 'open-sans'
    },
    ratingCont: {
        flexDirection: 'row',
    },
    cardContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    }
});
export default NurseryItem;
