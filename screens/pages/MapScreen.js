import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView, { Marker } from 'react-native-maps';
import { Colors } from 'react-native-paper';

const MapScreen = ({ navigation }) => {
    const [pickedLocation, setPickedLocation] = useState();
    const [markers, setMarkers] = useState();
    const nurseries = useSelector(state => state.nurseries.nurseries).posts;

    const [mapRegion, setMapRegion] = useState({
        latitude: 37.78,
        longitude: -122.43,
        latitudeDelta: 1,
        longitudeDelta: 1
    });

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.LOCATION);
        if (result.status !== 'granted') {
            Alert.alert(
                'Insufficient permissions!',
                'You need to grant location permissions to use this app.',
                [{ text: 'Okay' }]
            );
            return false;
        }
        return true;
    };

    const getLocationHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }

        try {
            const location = await Location.getCurrentPositionAsync({
                timeout: 5000
            });
            setPickedLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude
            });
            setMapRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05
            });
        } catch (err) {
            Alert.alert(
                'Could not fetch location!',
                'Please try again later or pick a location on the map.',
                [{ text: 'Okay' }]
            );
        }
    };

    // const [selectedLocation, setSelectedLocation] = useState();

    // const selectLocationHandler = event => {
    //     setSelectedLocation({
    //         lat: event.nativeEvent.coordinate.latitude,
    //         lng: event.nativeEvent.coordinate.longitude
    //     });
    // };

    let markerCoordinates;

    // if (selectedLocation) {
    //     markerCoordinates = {
    //         latitude: selectedLocation.lat,
    //         longitude: selectedLocation.lng
    //     };
    // }

    useEffect(() => {
        getLocationHandler();
        // const mrkrs = loadMarkers();
        // setMarkers(mrkrs);
    }, []);

    // console.log(nurseries);
    const loadMarkers = () => {
        return nurseries.map((val, key) => {
            const lat = val.mapCoordinates.split(',')[0] != undefined ? val.mapCoordinates.split(',')[0].trim().toString() : null;
            const lng = val.mapCoordinates.split(',')[1] != undefined ? val.mapCoordinates.split(',')[1].trim().toString() : null;

            if (lat != undefined && lat != null && lng != undefined && lng != null) {
                return <Marker key={`map-${key}`} title={val.name} coordinate={{
                    latitude: lat,
                    longitude: lng
                }} onPress={() => navigation.navigate('Description', { item: val })} />
            }
        })
    };
    return <View style={styles.screen}>
        {pickedLocation ?
            <MapView
                style={styles.map}
                region={mapRegion}
            >
                {
                    nurseries.map((val, key) => {
                        const lat = val.mapCoordinates.split(',')[0] != undefined ? parseFloat(val.mapCoordinates.split(',')[0].trim()) : null;
                        const lng = val.mapCoordinates.split(',')[1] != undefined ? parseFloat(val.mapCoordinates.split(',')[1].trim()) : null;

                        if (lat != undefined && lat != null && lng != undefined && lng != null) {
                            return <Marker key={`map-${key}`} title={val.name} coordinate={{
                                latitude: lat,
                                longitude: lng
                            }} onCalloutPress={() => navigation.navigate('Description', { item: val })} />
                        }
                    })
                }
            </MapView>
            : <ActivityIndicator size="large" color={Colors.primary} />}
    </View>
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    map: {
        flex: 1
    }
});

export { MapScreen };
