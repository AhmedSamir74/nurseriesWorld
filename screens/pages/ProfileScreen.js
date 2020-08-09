import React, { useReducer, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
    Picker,
    Text
} from 'react-native';
import Button from "react-native-button";
import Colors from '../../constants/Colors';

import CustomeHeader from '../../components/UI/CustomeHeader';
import Input from '../../components/UI/Input';
import { saveProfile } from '../../store/actions/auth';
import Toast from 'react-native-simple-toast';

import { Ionicons } from '@expo/vector-icons';
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const ProfileScreen = ({ navigation }) => {

    const userId = useSelector(state => state.auth.userId);

    const userName = useSelector(state => state.auth.userName);
    const userPhone = useSelector(state => state.auth.userPhone);
    const userGender = useSelector(state => state.auth.userGender);
    // console.log(userId+" = "+userName+" = "+userPhone+" = "+userGender);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const formReducer = (state, action) => {
        if (action.type === FORM_INPUT_UPDATE) {
            const updatedValues = {
                ...state.inputValues,
                [action.input]: action.value
            };
            const updatedValidities = {
                ...state.inputValidities,
                [action.input]: action.isValid
            };
            let updatedFormIsValid = true;
            for (const key in updatedValidities) {
                updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
            }
            return {
                formIsValid: updatedFormIsValid,
                inputValidities: updatedValidities,
                inputValues: updatedValues
            };
        }
        return state;
    };

    const [signupFormState, signupDispatchFormState] = useReducer(formReducer, {
        inputValues: {
            name: userName,
            password: '',
            confPassword: '',
            phone: userPhone,
            gender: userGender
        },
        inputValidities: {
            name: true,
            password: true,
            confPassword: true,
            phone: true,
            gender: true
        },
        signupFormIsValid: true
    });

    useEffect(() => {
        // if (error) {
        //     Alert.alert('Update Failed!', error, [{ text: 'Okay' }]);
        // }
    }, []);

    const submitProfile = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(saveProfile(
                userId,
                signupFormState.inputValues.name,
                signupFormState.inputValues.password,
                signupFormState.inputValues.phone,
                signupFormState.inputValues.gender,
            ));
            Toast.show('Changes Saved.');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
        Toast.show('Changes Saved.');

    };

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            // console.log(inputIdentifier);
            // console.log(inputValue);
            // console.log(inputValidity);

            signupDispatchFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            })
        },
        [signupDispatchFormState]
    );

    return <View style={styles.screen}>
        <CustomeHeader navigation={navigation} />

        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={50}
            style={styles.screen}
        >
            <ScrollView>
                <View style={styles.container} >
                    <Text style={[styles.title, styles.leftTitle]}>Profile</Text>

                    <Input
                        id="name"
                        placeholder="Name"
                        placeholderTextColor={AppStyles.color.grey}
                        name
                        required
                        autoCapitalize="none"
                        errorText="Please enter a valid name."
                        onInputChange={inputChangeHandler}
                        initialValue={userName}
                        initiallyValid
                    />

                    <Input
                        id="phone"
                        keyboardType="phone-pad"
                        placeholder="Phone Number"
                        placeholderTextColor={AppStyles.color.grey}
                        required
                        phone
                        autoCapitalize="none"
                        errorText="Please enter a valid Phone Number."
                        onInputChange={inputChangeHandler}
                        initialValue={userPhone}
                        initiallyValid
                    />

                    <Input
                        id="password"
                        placeholder="Password"
                        placeholderTextColor={AppStyles.color.grey}
                        keyboardType="default"
                        secureTextEntry
                        minLength={5}
                        autoCapitalize="none"
                        errorText="Please enter a valid password."
                        onInputChange={inputChangeHandler}
                        initialValue=""
                        initiallyValid
                    />

                    <Input
                        id="confPassword"
                        placeholder="Confirem Password"
                        placeholderTextColor={AppStyles.color.grey}
                        keyboardType="default"
                        secureTextEntry
                        minLength={5}
                        confPassword
                        password={signupFormState.inputValues.password}
                        autoCapitalize="none"
                        errorText="the confirm password does not match"
                        onInputChange={inputChangeHandler}
                        initialValue=""
                        initiallyValid
                    />

                    <View style={styles.InputContainer}>
                        <Picker
                            style={styles.body}
                            selectedValue={signupFormState.inputValues.gender}
                            onValueChange={(value, index) => {
                                // console.log(value);
                                signupDispatchFormState({
                                    type: FORM_INPUT_UPDATE,
                                    value: value,
                                    isValid: true,
                                    input: 'gender'
                                })
                            }}>
                            <Picker.Item label="Male" value="male" />
                            <Picker.Item label="Female" value="female" />
                        </Picker>
                    </View>

                    <Button
                        containerStyle={styles.loginContainer}
                        style={styles.loginText}
                        onPress={submitProfile}
                    >Update</Button>
                </View >
            </ScrollView>
        </KeyboardAvoidingView>
    </View>
};

ProfileScreen.navigationOptions = ({ navigation }) => {
    // console.log(navigation);
    let title = 'Profile';
    let icon = <Ionicons
        name={Platform.OS === 'android' ? 'md-person' : 'ios-person'}
        size={25}
        color='white'
    />;
    if (navigation.state.params) {
        const isLoggedIn = navigation.state.params.isLoggedIn;
        title = isLoggedIn ? title : null;
        icon = isLoggedIn ? icon : null;
        
    }

    return {
        drawerLabel: () => title,
        drawerIcon: icon
    };
};
const AppStyles = {
    color: {
        main: Colors.primary,
        text: "#696969",
        title: "#464646",
        subtitle: "#545454",
        categoryTitle: "#161616",
        tint: Colors.accent,
        description: "#bbbbbb",
        filterTitle: "#8a8a8a",
        starRating: "#2bdf85",
        location: "#a9a9a9",
        white: "white",
        facebook: "#4267b2",
        grey: "grey",
        greenBlue: "#00aea8",
        placeholder: "#a0a0a0",
        background: "#f2f2f2",
        blue: "#3293fe"
    },
    fontSize: {
        title: 30,
        content: 20,
        normal: 16
    },
    buttonWidth: {
        main: "70%"
    },
    textInputWidth: {
        main: "80%"
    },
    fontName: {
        main: "open-sans",
        bold: "open-sans-bold"
    },
    borderRadius: {
        main: 25,
        small: 5
    }
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    container: {
        alignItems: "center"
    },
    title: {
        fontSize: AppStyles.fontSize.title,
        fontWeight: "bold",
        color: AppStyles.color.tint,
        marginTop: 20,
        marginBottom: 20
    },
    leftTitle: {
        alignSelf: "stretch",
        textAlign: "left",
        marginLeft: 20
    },
    content: {
        paddingLeft: 50,
        paddingRight: 50,
        textAlign: "center",
        fontSize: AppStyles.fontSize.content,
        color: AppStyles.color.text
    },
    loginBtnContainer: {
        width: '85%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

    },
    loginContainer: {
        width: '80%',
        backgroundColor: AppStyles.color.main,
        borderRadius: AppStyles.borderRadius.main,
        padding: 10,
        marginTop: 30,
        margin: 10
    },
    SingupContainer: {
        width: '50%',
        backgroundColor: AppStyles.color.main,
        borderRadius: AppStyles.borderRadius.main,
        padding: 10,
        marginTop: 30
    },
    loginText: {
        color: AppStyles.color.white
    },
    placeholder: {
        fontFamily: AppStyles.fontName.text,
        color: "red"
    },
    InputContainer: {
        width: AppStyles.textInputWidth.main,
        marginTop: 30,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: AppStyles.color.grey,
        borderRadius: AppStyles.borderRadius.main
    },
    body: {
        height: 42,
        paddingLeft: 20,
        paddingRight: 20,
        color: AppStyles.color.text
    },
    facebookContainer: {
        flex: 1,
        backgroundColor: AppStyles.color.facebook,
        borderRadius: AppStyles.borderRadius.main,
        padding: 10,
        marginTop: 30,
        margin: 10
    },
    facebookText: {
        color: AppStyles.color.white
    },
    or: {
        fontFamily: AppStyles.fontName.main,
        color: "black",
        marginTop: 40,
        marginBottom: 10
    },
    hint: {
        marginTop: 30,
        marginLeft: 20,
        marginBottom: 5,
        width: AppStyles.textInputWidth.main,
        color: '#E50000'
    }
});

export { ProfileScreen };
