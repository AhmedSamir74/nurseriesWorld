import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomeHeader from '../../components/UI/CustomeHeader';
import Card from '../../components/UI/Card';

const SupportScreen = ({ navigation }) => {
    return <View style={styles.screen}>
        <CustomeHeader navigation={navigation} />
        <View style={styles.container}>
            <Card style={styles.card}>
                <View style={styles.infoCont}>
                    <Text style={styles.label}>Location</Text>
                    <Text style={styles.description}>Furn El Chebak - Beirut - Lebanon,  Rizkallah Semaan Street , Center Etoile 3rd Floor.</Text>
                </View>

                <View style={styles.infoCont}>
                    <Text style={styles.label}>E-mail</Text>
                    <Text style={styles.description}>info@nurseriesworld.com</Text>
                </View>

                <View style={styles.infoCont}>
                    <Text style={styles.label}>Contact Numbers</Text>
                    <Text style={styles.description}>00961-1-291084</Text>
                    <Text style={styles.description}>00961-3-383646</Text>
                    <Text style={styles.description}>00961-3-755614</Text>
                </View>
            </Card>
        </View>
    </View>
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    card: {
        margin: 20,
        padding: 10,
    },
    infoCont: {
        padding: 15
    },
    label: {
        color: 'grey',
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        paddingVertical: 10
    },
    description: {
        paddingLeft: 15,
        fontFamily: 'open-sans',
        fontSize: 16,
        textAlign: 'justify'
    }
});

export { SupportScreen };
