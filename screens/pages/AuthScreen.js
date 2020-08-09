import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    StyleSheet,
    Alert,
    Text,
    ActivityIndicator,
    Picker
} from 'react-native';

import Input from '../../components/UI/Input';
import Button from "react-native-button";
import { useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

const FBSDK = require("react-native-fbsdk");
const { LoginManager, AccessToken } = FBSDK;
import Toast from 'react-native-simple-toast';
import Prompt from 'react-native-prompt';

import FBLoginButton from '../../components/UI/FBLoginButton';


const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const onPressFacebook = () => {
    LoginManager.logInWithPermissions([
        "public_profile",
        "user_friends",
        "email"
    ]).then(
        result => {
            if (result.isCancelled) {
                alert("Whoops!", "You cancelled the sign in.");
            } else {
                AccessToken.getCurrentAccessToken().then(data => {
                    const credential = firebase.auth.FacebookAuthProvider.credential(
                        data.accessToken
                    );
                    const accessToken = data.accessToken;
                    var user = result.user;
                    console.log(user);

                });
            }
        },
        error => {
            Alert.alert("Sign in error", error);
        }
    );
};

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


const AuthScreen = ({ navigation }) => {
    const [promptVisible, sePromptVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    });

    const [signuFormState, signupDispatchFormState] = useReducer(formReducer, {
        inputValues: {
            name: '',
            email: '',
            password: '',
            confPassword: '',
            phone: '',
            gender: 'male'
        },
        inputValidities: {
            nmae: false,
            email: false,
            password: false,
            confPassword: false,
            phone: false,
            gender: true
        },
        signupFormIsValid: false
    });
    const onForgetPassword = () => {
        sePromptVisible(true);
    };
    useEffect(() => {
        if (error) {
            Alert.alert('Authentication Failed!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    const authHandler = async () => {
        let action;
        if (isSignup) {
            action = authActions.signup(
                signuFormState.inputValues.name,
                signuFormState.inputValues.email,
                signuFormState.inputValues.password,
                signuFormState.inputValues.phone,
                signuFormState.inputValues.gender,
            );
        } else {
            action = authActions.login(
                formState.inputValues.email,
                formState.inputValues.password
            );
        }
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(action);
            setIsLoading(false);
            Toast.show('Welcome Back.');
            navigation.navigate('main');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            isSignup ?
                signupDispatchFormState({
                    type: FORM_INPUT_UPDATE,
                    value: inputValue,
                    isValid: inputValidity,
                    input: inputIdentifier
                }) :
                dispatchFormState({
                    type: FORM_INPUT_UPDATE,
                    value: inputValue,
                    isValid: inputValidity,
                    input: inputIdentifier
                });
        },
        [isSignup ? signupDispatchFormState : dispatchFormState]
    );
    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>;
    }
    return isSignup ?
        (
            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={50}
                style={styles.screen}
            >
                <ScrollView>
                    <View style={styles.container} >
                        <Text style={[styles.title, styles.leftTitle]}>Create new account</Text>

                        <Input
                            id="name"
                            placeholder="Name"
                            placeholderTextColor={AppStyles.color.grey}
                            required
                            name
                            autoCapitalize="none"
                            errorText="Please enter a valid name."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />

                        <Input
                            id="email"
                            keyboardType="email-address"
                            placeholder="E-mail"
                            placeholderTextColor={AppStyles.color.grey}
                            required
                            email
                            autoCapitalize="none"
                            errorText="Please enter a valid email address."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />

                        <Input
                            id="password"
                            placeholder="Password"
                            placeholderTextColor={AppStyles.color.grey}
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize="none"
                            errorText="Please enter a valid password."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />

                        <Input
                            id="confPassword"
                            placeholder="Confirem Password"
                            placeholderTextColor={AppStyles.color.grey}
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={5}
                            confPassword
                            password={signuFormState.inputValues.password}
                            autoCapitalize="none"
                            errorText="the confirm password does not match"
                            onInputChange={inputChangeHandler}
                            initialValue=""
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
                            initialValue=""
                        />

                        <View style={styles.InputContainer}>
                            <Picker
                                style={styles.body}
                                selectedValue={signuFormState.inputValues.gender}
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

                        <View style={styles.loginBtnContainer}>
                            <Button
                                containerStyle={styles.loginContainer}
                                style={styles.facebookText}
                                onPress={authHandler}
                            >Register</Button>

                            <Button
                                containerStyle={[styles.loginContainer, { backgroundColor: AppStyles.color.main }]}
                                style={styles.loginText}
                                onPress={() => setIsSignup(false)}
                            >Login</Button>
                        </View>
                    </View >
                </ScrollView>
            </KeyboardAvoidingView>
        )
        :
        (
            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={100}
                style={styles.screen}
            >
                <ScrollView>
                    <View style={styles.container}>
                        <Prompt
                            title="Your Email"
                            placeholder="example@gmail.com"
                            visible={promptVisible}
                            onCancel={() => { sePromptVisible(false); }}
                            onSubmit={async (value) => {
                                setIsLoading(true);
                                sePromptVisible(false);
                                console.log(value);
                                if (value == "") {
                                    Alert.alert('wrong email!', 'Please Enter Valid Email', [{ text: 'Okay' }]);
                                    setIsLoading(false);
                                    return;
                                }
                                const URL = 'https://www.nurseriesworld.com/ws.php?type=forgetpassword&format=json&email=' + value;
                                try {
                                    const response = await fetch(URL);

                                    if (!response.ok) {
                                        console.log('Something went wrong!');
                                        setError('Something went wrong!');
                                        throw new Error('Something went wrong!');
                                    }
                                    const resData = await response.json();
                                    if (resData.posts[0] != 0) {
                                        Toast.show('Please check your email for the password.');
                                    }
                                } catch (err) {
                                    setError(err.message);
                                    throw err;
                                }
                                setIsLoading(false);
                            }} />
                        <Text style={[styles.title, styles.leftTitle]}>Sign In</Text>
                        <Input
                            id="email"
                            label="E-Mail"
                            keyboardType="email-address"
                            placeholder="E-mail or phone number"
                            placeholderTextColor={AppStyles.color.grey}
                            required
                            email
                            autoCapitalize="none"
                            errorText="Please enter a valid email address."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <Input
                            id="password"
                            placeholder="Password"
                            placeholderTextColor={AppStyles.color.grey}
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize="none"
                            errorText="Please enter a valid password."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <View style={styles.loginBtnContainer}>
                            <Button
                                containerStyle={styles.loginContainer}
                                style={styles.loginText}
                                onPress={authHandler}
                            > Log in </Button>
                            {/* <Button
                                containerStyle={styles.facebookContainer}
                                style={styles.facebookText}
                                onPress={() => onPressFacebook()}
                            > Facebook </Button> */}
                            <Button
                                containerStyle={[styles.facebookContainer, { backgroundColor: AppStyles.color.main }]}
                                style={styles.loginText}
                                onPress={() => setIsSignup(true)}
                            > Sign Up </Button>
                        </View>
                        <Text style={styles.or}>OR</Text>
                        <Button
                            containerStyle={[styles.SingupContainer, { backgroundColor: AppStyles.color.facebook }]}
                            style={styles.loginText}
                            onPress={onForgetPassword}
                        > Forget Password ? </Button>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )
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
        flex: 1,
        backgroundColor: AppStyles.color.tint,
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
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export { AuthScreen };
