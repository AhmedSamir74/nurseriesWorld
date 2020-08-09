import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet, Picker, ActivityIndicator, AsyncStorage, ScrollView } from 'react-native';

import { Text, Button } from 'react-native-elements';
import MultiSelect from 'react-native-multiple-select';

import Colors from '../../constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import { filterNurseries } from '../../store/actions/nurseries';

const FilterScreen = ({ navigation }) => {
    const countryId = useSelector(state => state.nurseries.slectedCountry);
    const sortType = useSelector(state => state.nurseries.sortType);
    const dispatch = useDispatch();
    const [selectedCity, setSelectedCity] = useState();
    const [selectedArea, setSelectedArea] = useState();
    const [selectedPrice, setSelectedPrice] = useState('100-150');
    const [selectedFacilites, setSelectedFacilites] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [cities, setCities] = useState([]);
    const [areas, setAreas] = useState([]);
    const [facilites, setFacilites] = useState([]);
    const [languages, setLanguages] = useState([]);

    async function fetchCities() {
        try {
            const response = await fetch(
                'https://www.nurseriesworld.com/ws.php?type=select_one&format=json&countryid=' + countryId + '&table=cities&columns=*&condition=active=1%20and%20parent=1%20order%20by%20name'
            );

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();

            setCities(resData.posts);

        } catch (err) {
            throw err;
        }
    }

    async function fetchFacilites() {
        try {
            const response = await fetch(
                'https://www.nurseriesworld.com/ws.php?type=select_one&format=json&countryid=' + countryId + '&table=facilities&columns=*&condition=active=1%20order%20by%20id'
            );

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();

            setFacilites(resData.posts);

        } catch (err) {
            throw err;
        }
    }

    async function fetchLanguages() {
        try {
            const response = await fetch(
                'https://www.nurseriesworld.com/ws.php?type=select_one&format=json&countryid=' + countryId + '&table=language&columns=*&condition=active=1%20order%20by%20id'
            );

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();

            setLanguages(resData.posts);

        } catch (err) {
            throw err;
        }
    }

    useEffect(() => {
        fetchCities();
        fetchFacilites();
        fetchLanguages();
    }, [setCities, setFacilites, setLanguages]);
    // console.log(cities);
    const fetchAreas = async (cityId) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                'https://nurseriesworld.com/ws.php?type=areas&cityid=' + cityId + '&format=json'
            );

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();

            setAreas(resData.posts);

        } catch (err) {
            throw err;
        }
        setIsLoading(false);
    };

    const submitFilters = async (countryId) => {
        try {
            await dispatch(filterNurseries(countryId, selectedCity, selectedArea, selectedPrice, selectedFacilites, selectedLanguages, sortType));
            setIsLoading(false);
            navigation.goBack();
        } catch (err) {
            console.log(err.message);
        }
    };

    return <View style={styles.screen}>
        <Text h4 style={styles.title}>Filter By</Text>
        {/* <ScrollView> */}

            {isLoading ? <ActivityIndicator size="large" color={Colors.primary} /> : null}

            <View style={styles.filterContainer}>
                <Text style={styles.filterTitle}>​Facilities</Text>
                <MultiSelect
                    hideTags
                    items={facilites}
                    uniqueKey="id"
                    onSelectedItemsChange={selectedItems => setSelectedFacilites(selectedItems)}
                    selectedItems={selectedFacilites}
                    selectText="Pick Items"
                    searchInputPlaceholderText="Search Items..."
                    onChangeInput={(text) => console.log(text)}
                    displayKey="name"
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor={Colors.primary}
                    submitButtonText="Done"
                    styleMainWrapper={styles.multiselectInput}
                    styleDropdownMenuSubsection={{ borderBottomWidth: 0 }}
                />
            </View>

            <View style={styles.filterContainer}>
                <Text style={styles.filterTitle}>Language</Text>
                <MultiSelect
                    hideTags
                    items={languages}
                    uniqueKey="id"
                    onSelectedItemsChange={selectedItems => setSelectedLanguages(selectedItems)}
                    selectedItems={selectedLanguages}
                    selectText="Pick Languages"
                    searchInputPlaceholderText="Search Items..."
                    onChangeInput={(text) => console.log(text)}
                    displayKey="name"
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor={Colors.primary}
                    submitButtonText="Done"
                    styleMainWrapper={styles.multiselectInput}
                    styleDropdownMenuSubsection={{ borderBottomWidth: 0 }}
                />
            </View>

            <View style={styles.filterContainer}>
                <Text style={styles.filterTitle}>City</Text>
                <Picker
                    mode='dropdown'
                    style={styles.filterInput}
                    selectedValue={selectedCity}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedCity(itemValue);
                        fetchAreas(itemValue);
                    }
                    }>
                    {
                        cities.map((val, key) => {
                            return <Picker.Item key={val.id} label={val.name} value={val.id} />;
                        })
                    }

                </Picker>
            </View>
            <View style={styles.filterContainer}>
                <Text style={styles.filterTitle}>Area</Text>
                <Picker
                    mode='dropdown'
                    style={styles.filterInput}
                    selectedValue={selectedArea}
                    onValueChange={(itemValue, itemIndex) => {
                        setSelectedArea(itemValue)
                    }}>
                    {
                        areas.map((val, key) => {
                            return <Picker.Item key={val.cityID} label={val.area} value={val.area} />;
                        })
                    }
                </Picker>
            </View>

            <View style={styles.filterContainer}>
                <Text style={styles.filterTitle}>Price</Text>
                <Picker
                    mode='dropdown'
                    selectedValue={selectedPrice}
                    style={styles.filterInput}
                    onValueChange={(itemValue, itemIndex) => setSelectedPrice(itemValue)}>
                    <Picker.Item label="100-150 $" value="100-150" />
                    <Picker.Item label="150-200 $" value="150-200" />
                    <Picker.Item label="200-250 $" value="200-250" />
                    <Picker.Item label="300-400 $" value="300-400" />
                    <Picker.Item label="400-500 $" value="400-500" />
                    <Picker.Item label="500-600 $" value="500-600" />
                    <Picker.Item label="600-700 $" value="600-700" />
                    <Picker.Item label="700-800 $" value="700-800" />
                    <Picker.Item label="800-900 $" value="800-900" />
                    <Picker.Item label="900-1000 $" value="900-1000" />
                </Picker>
            </View>

            <Button
                icon={
                    <AntDesign
                        name="checkcircleo"
                        size={20}
                        color="white"
                        style={styles.submitButtonIcon}
                    />
                }
                title="Submit"
                containerStyle={styles.submitButtonCont}
                buttonStyle={styles.submitButton}
                titleStyle={styles.submitButtonTitle}
                onPress={() => {
                    setIsLoading(true);
                    AsyncStorage.getItem('userCountry', (err, id) => {
                        submitFilters(id)
                    })
                }}
            />
        {/* </ScrollView> */}
    </View>
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    title: {
        margin: 10
    },
    filterContainer: {
        marginHorizontal: 20,
        marginVertical: 10,
        borderBottomColor: Colors.primary,
        borderBottomWidth: 1
    },
    filterTitle: {
        fontFamily: 'open-sans-bold',
        fontSize: 16,
        color: 'grey'
    },
    filterInput: {
        fontFamily: 'open-sans',
        width: '100%',
        marginLeft: 15,
    },
    multiselectInput: {
        width: '100%',
        marginTop: 10,
        marginLeft: 15,
    },
    submitButtonCont: {
        width: '50%',
        alignSelf: 'center',
        marginVertical: 20,
        alignContent: 'center'
    },
    submitButton: {
        backgroundColor: Colors.primary,
    },
    submitButtonTitle: {
        fontSize: 18
    },
    submitButtonIcon: {
        marginHorizontal: 10
    },
});

export { FilterScreen };
