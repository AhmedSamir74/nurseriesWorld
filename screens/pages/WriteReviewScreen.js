import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Text, Input, AirbnbRating, Button } from 'react-native-elements';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';

const WriteReviewScreen = ({ navigation }) => {
    const nurseryId = navigation.getParam('id');
    const countryId = useSelector(state => state.nurseries.slectedCountry);
    const userId = useSelector(state => state.auth.userId);

    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState('');
    const [message, setMessage] = useState('');
    const [messageError, setMessageError] = useState('');
    const [rating, setRating] = useState(3);

    const ratingCompleted = (rating) => {
        // console.log("Rating is: " + rating);
        setRating(rating);
    };

    const submitReview = async () => {
        setIsLoading(true);
        if (title == "" || message == "") {
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch('http://www.nurseriesworld.com/ws.php?type=insert&format=json&countryid=' + countryId + '&table=nurseriesreviews&columns=title,message,rate,nurseryID,customerID&values="' + title + '","' + message + '","' + rating + '","' + nurseryId + '","' + userId + '"');

            if (!response.ok) {
                console.log('Something went wrong!');
                // setError('Something went wrong!');
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            // console.log(resData);
            setIsLoading(false);
            navigation.goBack();
        } catch (err) {
            // setError(err.message);
            throw err;
        }
    };

    return (<View style={styles.screen}>
        <Card style={styles.card}>
            <Text style={styles.title} h4> Write Review </Text>
            <View style={styles.formContainer}>
                <Input
                    value={title}
                    onChangeText={text => setTitle(text)}
                    placeholder='Title'
                    leftIcon={
                        <MaterialIcons
                            name='subtitles'
                            size={24}
                            color={Colors.accent}
                            style={styles.inputTitle}
                        />
                    }
                    errorStyle={{ color: 'red' }}
                    errorMessage={titleError}
                    onBlur={() => !title.length ? setTitleError('Enter Valid Title') : setTitleError('')}
                />
                <Input
                    value={message}
                    onChangeText={text => setMessage(text)}
                    placeholder='Message'
                    multiline
                    numberOfLines={6}
                    leftIcon={
                        <MaterialIcons
                            name='message'
                            size={24}
                            color={Colors.accent}
                            style={styles.inputTitle}
                        />
                    }
                    errorStyle={{ color: 'red' }}
                    errorMessage={messageError}
                    onBlur={() => !message.length ? setMessageError('Enter Valid Message') : setMessageError('')}

                />
                <AirbnbRating onFinishRating={ratingCompleted} />
                <Button
                    title="Send Review"
                    loading={isLoading}
                    icon={
                        <MaterialCommunityIcons
                            name="check-circle-outline"
                            size={20}
                            color="white"
                            style={{ marginHorizontal: 5 }}
                        />
                    }
                    iconLeft
                    onPress={() => submitReview()}
                    buttonStyle={styles.button}
                />
            </View>
        </Card>
    </View>);
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
    },
    card: {
        marginHorizontal: 20
    },
    title: {
        textAlign: 'center',
        marginVertical: 20
    },
    inputTitle: {
        marginRight: 10
    },
    formContainer: {
        padding: 20,
    },
    button: {
        backgroundColor: Colors.primary,
        margin: 20,
        width: '50%',
        alignSelf: 'center'
    }
});

export { WriteReviewScreen };
