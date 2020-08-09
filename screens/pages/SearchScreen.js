import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Colors from '../../constants/Colors';
import NurseryItem from '../../components/NurseryItem';

const SearchScreen = ({ navigation }) => {
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const countryId = useSelector(state => state.nurseries.slectedCountry);
    const [error, setError] = useState();
    const [nurseries, setNurseries] = useState([]);

    const updateSearch = async searchTerm => {
        setLoading(true);
        setSearchText(searchTerm);
        try {
            const response = await fetch('https://www.nurseriesworld.com/ws.php?type=search&format=json&countryid=' + countryId + '&keyword=' + searchTerm);

            if (!response.ok) {
                console.log('Something went wrong!');
                setError('Something went wrong!');

                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            setLoading(false);
            // console.log(resData);
            setNurseries(resData);
        } catch (err) {
            // send to custom analytics server.
            // console.log(err.message);
            setError(err.message);
            throw err;
        }
    };
    return <View style={styles.screen}>
        <SearchBar
            lightTheme
            round
            showLoading={loading}
            placeholder="Type Here..."
            onChangeText={updateSearch}
            value={searchText}
            inputContainerStyle={styles.searchInputContainer}
            inputStyle={styles.searchInput}
        />
        {
            loading ?
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
                : error ?
                    <View style={styles.centered}>
                        <Text style={styles.errorMessage}>{error}!</Text>
                    </View>
                    : <FlatList
                        keyExtractor={(item, index) => `list-item-${index}`}
                        data={nurseries.posts}
                        key={(item, i) => i}
                        renderItem={({ item }) => <NurseryItem
                            item={item}
                            onPress={() => navigation.navigate('Description', { item })}
                        />}
                    />
        }
    </View>
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        paddingVertical: 10
    },
    searchInput: {
        color: 'black'
    },
    searchInputContainer: {
        backgroundColor: 'white'
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

export { SearchScreen };
