import React from 'react';
import { Platform, View, SafeAreaView, Image, AsyncStorage } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Button } from 'react-native-elements';

import CustomeHeaderButton from '../components/UI/HeaderButton';

import COLORS from '../constants/Colors';

import { Ionicons, AntDesign, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import Toast from 'react-native-simple-toast';

import {
    AuthScreen, ListingScreen,
    DescriptionScreen, MapScreen,
    AboutAppScreen, WriteReviewScreen,
    SearchScreen,
    FaqScreen,
    SupportScreen,
    BlogScreen,
    ProfileScreen,
    BlogDetailsScreen,
    FilterScreen,
    Favorites
} from '../screens/index';

import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../store/actions/auth';
import { showCountryModal } from '../store/actions/country';

import LogoComp from '../components/UI/LogoComp';

const defaultNavOptions = ({ navigation }) => {
    return {
        headerStyle: {
            backgroundColor: Platform.OS == 'android' ? COLORS.primary : '',
        },
        headerTintColor: Platform.OS == 'android' ? 'white' : COLORS.primary,
    };
};

const homeNavigationOptions = ({ navigation }) => {
    return {
        headerTitle: <LogoComp navigation={navigation} />,
        headerRight: (
            <CustomeHeaderButton
                title="Search"
                name={Platform.OS === 'android' ? 'md-search' : 'ios-search'}
                onPress={() => {
                    navigation.navigate('Search');
                }}
            />
        ),
    }
};

const tabScreenConfig = {
    Home: {
        screen: ListingScreen,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <AntDesign
                    name='home'
                    size={23}
                    color={tabInfo.tintColor}
                />
            },
            tabBarColor: COLORS.accent
        }
    },
    Map: {
        screen: MapScreen,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <MaterialCommunityIcons
                    name='google-maps'
                    size={23}
                    color={tabInfo.tintColor}
                />
            },
            tabBarColor: COLORS.primary
        }
    },
};

const BottomBarNavigator = Platform.OS == 'android' ?
    createMaterialBottomTabNavigator(tabScreenConfig, {
        activeTintColor: 'white',
        shifting: true
    })
    :
    createBottomTabNavigator({
        tabScreenConfig
    });


const HomeNavigator = createStackNavigator({
    Listing: {
        screen: BottomBarNavigator,
        navigationOptions: ({ navigation }) => {
            return {
                headerLeft: (
                    <CustomeHeaderButton
                        title="Menu"
                        name={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                        onPress={() => {
                            navigation.openDrawer();
                        }}
                    />
                ),
                headerTitle: (
                    <LogoComp navigation={navigation} />
                ),
                headerRight: (
                    <CustomeHeaderButton
                        title="Search"
                        name={Platform.OS === 'android' ? 'md-search' : 'ios-search'}
                        onPress={() => {
                            navigation.navigate('Search');
                        }}
                    />
                )
            }
        },
    },
    Description: {
        screen: DescriptionScreen,
        navigationOptions: homeNavigationOptions
    },
    Writereview: {
        screen: WriteReviewScreen,
        navigationOptions: homeNavigationOptions
    },
    Search: {
        screen: SearchScreen,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: <LogoComp navigation={navigation} />,
            }
        }
    },
    Filter: {
        screen: FilterScreen,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: <LogoComp navigation={navigation} />,
            }
        }
    }
}, {
    defaultNavigationOptions: defaultNavOptions
});

const menuNavigationOptions = ({ navigation }) => {
    return {
        headerLeft: (
            <CustomeHeaderButton
                title="Menu"
                name={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                    navigation.openDrawer();
                }}
            />
        ),
        headerTitle: <LogoComp navigation={navigation} />
    }
};
const BlogNavigator = createStackNavigator({
    Blog: {
        screen: BlogScreen,
        navigationOptions: menuNavigationOptions
    },
    BlogDetails: {
        screen: BlogDetailsScreen,
        navigationOptions: ({ navigation }) => {
            return {
                headerTitle: <LogoComp navigation={navigation} />
            };
        }
    },
}, {
    defaultNavigationOptions: defaultNavOptions
});

const MenueNavigator = createDrawerNavigator({
    HomeNavigator: {
        screen: HomeNavigator,
        navigationOptions: {
            drawerLabel: 'Home',
            drawerIcon: drawerConfig => (
                <AntDesign
                    name='home'
                    size={25}
                    color={drawerConfig.tintColor}
                />
            )
        }
    },
    AboutNavigator: {
        screen: AboutAppScreen,
        navigationOptions: {
            drawerLabel: 'About The App',
            drawerIcon: drawerConfig => (
                <Ionicons
                    name={Platform.OS === 'android' ? 'md-information-circle-outline' : 'ios-information-circle-outline'}
                    size={25}
                    color='white'
                />
            )
        }
    },
    FaqNavigator: {
        screen: FaqScreen,
        navigationOptions: {
            drawerLabel: 'FAQ',

            drawerIcon: drawerConfig => (
                <Image
                    source={require('../assets/img/faq.png')}
                    style={{ height: 29, width: 29 }}
                />
            )
        }
    },
    SupportNavigator: {
        screen: SupportScreen,
        navigationOptions: {
            drawerLabel: 'Support',

            drawerIcon: drawerConfig => (
                <Image
                    source={require('../assets/img/support.png')}
                    style={{ height: 29, width: 29 }}
                />
            )
        }
    },
    BlogNavigator: {
        screen: BlogNavigator,
        navigationOptions: {
            drawerLabel: 'Blog',

            drawerIcon: drawerConfig => (
                <Image
                    source={require('../assets/img/blog.png')}
                    style={{ height: 29, width: 29 }}
                />
            )
        }
    },
    ProfileNavigator: {
        screen: ProfileScreen,
        navigationOptions: async ({ navigation }) => {
            let userData = null;
            await AsyncStorage.getItem('userData', (err, data) => {
                // console.log("User Country Is " + id);
                userData = data;
            });
            navigation.setParams({ isLoggedIn: userData != null ? true : false });
        }
    },
    Favorites: {
        screen: Favorites,
        navigationOptions: {
            drawerLabel: 'Favorites',
            drawerIcon: drawerConfig => (
                <Ionicons
                    name={Platform.OS === 'android' ? 'md-heart' : 'ios-heart'}
                    size={25}
                    color='white'
                />
            )
        }
    }
}, {
    drawerBackgroundColor: COLORS.primary,
    contentOptions: {
        activeTintColor: 'white',
        activeBackgroundColor: COLORS.primary,
        inactiveTintColor: 'white'
    },
    contentComponent: props => {
        const dispatch = useDispatch();
        const userId = useSelector(state => state.auth.userId);
        // console.log(props);

        return <View style={{ flex: 1, paddingTop: 20, }}>
            <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'alwayes', horizontal: 'never' }}>
                <DrawerItems {...props} />
                <Button
                    icon={
                        <Entypo
                            name='location'
                            size={25}
                            color='#d6cece'
                            style={{ marginLeft: 8, marginRight: 30 }}
                        />
                    }
                    iconLeft
                    title="Change Country"
                    color={COLORS.primary}
                    onPress={() => {
                        dispatch(showCountryModal());
                    }}
                    buttonStyle={{ width: '100%', backgroundColor: COLORS.primary, justifyContent: 'flex-start' }}
                    containerStyle={{
                        flexDirection: 'row',
                        height: 40,
                    }}
                />

                <Button
                    icon={
                        <MaterialCommunityIcons
                            name='logout'
                            size={25}
                            color='white'
                            style={{ marginHorizontal: 15 }}
                        />
                    }
                    iconLeft
                    title={userId != undefined && userId != null ? 'logout' : 'Login'}
                    color={COLORS.primary}
                    onPress={() => {
                        if (userId != undefined && userId != null) {
                            dispatch(logout());
                            props.navigation.closeDrawer();
                            Toast.show('See You Soon');
                        } else {
                            props.navigation.navigate('auth');
                        }
                    }}
                    buttonStyle={{ width: '100%', backgroundColor: COLORS.primary, justifyContent: 'flex-start' }}
                    containerStyle={{
                        position: 'absolute',
                        bottom: 50,
                        flexDirection: 'row',
                        height: 40,
                    }}
                />
            </SafeAreaView>
        </View>
    }
});

const authNavigator = createStackNavigator({
    auth: {
        screen: AuthScreen,
        navigationOptions: ({ navigation }) => {
            return {
                headerLeft: (
                    <CustomeHeaderButton
                        title="back"
                        name={Platform.OS === 'android' ? 'md-arrow-back' : 'ios-arrow-back'}
                        onPress={() => {
                            navigation.navigate('main');
                            // console.log(navigation);
                        }}
                    />
                ),
                headerTitle: "Authenticate",
                headerTitleStyle: { flex: 1, textAlign: 'center' },
            }
        },
    },
}, {
    defaultNavigationOptions: defaultNavOptions
});
const RootNavigator = createSwitchNavigator({
    // startup: StartupScreen,
    main: MenueNavigator,
    auth: authNavigator,
});

export default createAppContainer(RootNavigator);