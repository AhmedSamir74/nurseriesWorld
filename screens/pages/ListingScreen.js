import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Image, ActivityIndicator, AsyncStorage } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { hideCountryModal, showCountryModal } from '../../store/actions/country';

import ActionButton from 'react-native-action-button';

import countriesJson from '../../Data/countries';

import NurseryItem from '../../components/NurseryItem';
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

import { Button, Overlay, CheckBox } from 'react-native-elements';
import { fetchNurseries, setCountry, resetFilters } from '../../store/actions/nurseries';
import { autoAuthenticate } from '../../store/actions/auth';

const ListingScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const visible = useSelector(state => state.country.isVisible);
    const nurseries = useSelector(state => state.nurseries.nurseries);
    const filterSet = useSelector(state => state.nurseries.filterSet);
    const countries = countriesJson['posts'];
    const [checkedCountry, setCheckedCountry] = useState();

    const [isRefreshing, setIsRefreshing] = useState(false);
    const [start, setStart] = useState(0);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const loadNurseries = useCallback(async (from = start, srtType = null) => {
        setError(null);
        setIsRefreshing(true);
        try {
            let countryId;
            await AsyncStorage.getItem('userCountry', (err, id) => {
                countryId = id;
            });

            await dispatch(fetchNurseries(from, srtType, countryId));
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        setIsLoading(true);
        dispatch(autoAuthenticate());
        AsyncStorage.getItem('userCountry', (err, id) => {
            // console.log("User Country Is " + id);
            if (id == null) {
                dispatch(showCountryModal());
            } else {
                dispatch(setCountry(id));
            }
        });

        loadNurseries(0).then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadNurseries]);

    const onResetFilter = async () => {
        setIsLoading(true);
        await dispatch(resetFilters());
        await loadNurseries(0);
        setIsLoading(false);
    };
    
    return <View style={styles.screen}>
        <Overlay
            isVisible={visible}
            onBackdropPress={() => dispatch(hideCountryModal())}
            windowBackgroundColor="rgba(0,0,0,.4)"
            overlayBackgroundColor="white"
            width="80%"
            height="70%"
        >
            <View style={styles.screen}>
                <FlatList
                    data={countries}
                    renderItem={({ item }) => {
                        return <View style={styles.countriesCont}>
                            <Image source={{ uri: `https://nurseriesworld.com/images/${item.flag}` }} style={styles.countryFlag} />
                            <CheckBox
                                containerStyle={styles.countryCheckbox}
                                title={item.name}
                                checked={item.id == checkedCountry}
                                onPress={() => setCheckedCountry(item.id)}
                            />
                        </View>
                    }}
                    style={styles.flatList}
                />

                <View style={styles.btnContainer}>
                    <Button
                        icon={
                            <MaterialCommunityIcons
                                name='cancel'
                                style={styles.buttonIcon}
                            />
                        }
                        title="Cancel"
                        containerStyle={styles.rowButton}
                        buttonStyle={{ backgroundColor: Colors.danger }}
                        onPress={() => dispatch(hideCountryModal())}
                    />

                    <Button
                        icon={
                            <AntDesign
                                name='checkcircleo'
                                style={styles.buttonIcon}
                            />
                        }
                        title="OK"
                        containerStyle={styles.rowButton}
                        buttonStyle={{ backgroundColor: Colors.success }}
                        onPress={() => {
                            dispatch(hideCountryModal());
                            dispatch(setCountry(checkedCountry));
                        }}
                    />

                </View>
            </View>
        </Overlay>

        {
            (nurseries == undefined || Object.entries(nurseries).length === 0 && nurseries.constructor === Object) && isLoading
                ? <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View> :
                error ?
                    <View style={styles.centered}>
                        <Text style={styles.errorMessage}>{error}!</Text>
                        <Button
                            title="Try again"
                            onPress={loadNurseries}
                            color={Colors.primary}
                        />
                    </View>
                    : <View style={styles.contanier}>
                        <View style={styles.resetFilterCont}>
                            <Button
                                icon={
                                    <AntDesign
                                        name='filter'
                                        size={21}
                                        fontFamily='open-sans-bold'
                                    />
                                }
                                title="Filter"
                                buttonStyle={styles.filterContainer}
                                titleStyle={styles.fliterTitle}
                                onPress={() => navigation.navigate('Filter')}
                            />
                            {
                                filterSet ? <Button
                                    icon={
                                        <MaterialCommunityIcons
                                            name='filter-remove'
                                            size={21}
                                            fontFamily='open-sans'
                                            color='red'
                                        />
                                    }
                                    title="Reset Filters"
                                    buttonStyle={styles.filterContainer}
                                    titleStyle={[styles.fliterTitle, { color: 'red', fontFamily: 'open-sans' }]}
                                    onPress={onResetFilter.bind(this)}
                                /> : null
                            }
                        </View>
                        {Object.entries(nurseries).length != 0 && nurseries.posts[0] != 0 ?
                            <FlatList
                                onRefresh={loadNurseries}
                                keyExtractor={(item, index) => `list-item-${index}`}
                                refreshing={isRefreshing}
                                data={nurseries.posts}
                                key={(item, i) => i}
                                renderItem={({ item }) => {
                                    return <NurseryItem
                                        navigation={navigation}
                                        item={item}
                                        onPress={() => navigation.navigate('Description', { item })}
                                    />
                                }
                                }
                                onEndReachedThreshold={1}
                                onEndReached={({ distanceFromEnd }) => {
                                    if (nurseries.posts.length >= 4) {
                                        const newStart = start + 10;
                                        // console.log(newStart);
                                        setStart(newStart);
                                        loadNurseries(newStart);
                                    }
                                }}
                            /> :
                            <View style={styles.centered}>
                                <Text style={styles.errorMessage}>No Nurseries Found Try Another Filters!</Text>
                            </View>
                        }
                    </View>
        }
        {
            (nurseries != undefined && Object.entries(nurseries).length != 0 && nurseries.constructor == Object) && !isLoading && !error ?
                < ActionButton buttonColor={Colors.primary} renderIcon={() => <View style={styles.sortCont}><MaterialCommunityIcons
                    name='sort'
                    size={23}
                    color='#fff'
                /><Text style={styles.sortTitle}>Sort</Text></View>} >
                    <ActionButton.Item textContainerStyle={{ backgroundColor: "#9C9C9C" }} textStyle={{ color: 'white' }} buttonColor='#3498db'
                        title="Price ASC"
                        onPress={() => {
                            loadNurseries(0, 'avgPrice');
                        }}>
                        <Ionicons name="md-pricetag" style={styles.actionButtonIcon} />
                    </ActionButton.Item>

                    <ActionButton.Item textContainerStyle={{ backgroundColor: "#9C9C9C" }} textStyle={{ color: 'white' }} buttonColor={Colors.accent} title="Price DES"
                        onPress={() => loadNurseries(0, 'avgPrice%20desc')}>
                        <Ionicons name="md-pricetag" style={styles.actionButtonIcon} />
                    </ActionButton.Item>

                    <ActionButton.Item textContainerStyle={{ backgroundColor: "#9C9C9C" }} textStyle={{ color: 'white' }} buttonColor='#9b59b6' title="Rating ASC"
                        onPress={() => loadNurseries(0, 'ratingAverage')}>
                        <AntDesign name="star" style={styles.actionButtonIcon} />
                    </ActionButton.Item>

                    <ActionButton.Item textContainerStyle={{ backgroundColor: "#9C9C9C" }} textStyle={{ color: 'white' }} buttonColor='#1abc9c' title="Rating DES"
                        onPress={() => loadNurseries(0, 'ratingAverage%20desc')}>
                        <AntDesign name="staro" style={styles.actionButtonIcon} />
                    </ActionButton.Item>
                </ActionButton>
                : null
        }
    </View >
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    contanier: {
        // flexDirection: 'row',
        flex: 1,
        padding: 10,
        paddingTop: 0,
    },
    filterContainer: {
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    fliterTitle: {
        color: '#000',
        fontFamily: 'open-sans-bold',
        alignSelf: 'center',
        fontSize: 18,
        marginLeft: 10
    },
    actionButtonIcon: {
        fontSize: 22,
        height: 22,
        color: 'white',
    },
    sortTitle: {
        fontSize: 12,
        color: '#fff'
    },
    sortCont: {
        alignItems: 'center'
    },

    countriesCont: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    countryFlag: {
        width: 30,
        height: 30
    },
    countryCheckbox: {
        flex: 1
    },
    btnContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingTop: 10,
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: 'grey'
    },
    rowButton: {
        flex: 1,
        marginHorizontal: 15,
    },
    buttonIcon: {
        marginRight: 5,
        color: 'white',
        fontSize: 18
    },
    flatList: {
        marginBottom: 15
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
    resetFilterCont: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export { ListingScreen };
