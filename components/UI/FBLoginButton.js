import React from 'react';
import { View } from 'react-native';
import { LoginButton } from 'react-native-fbsdk';

const FBLoginButton = () => {
    return (
        <View>
            <LoginButton
                publishPermissions={["email"]}
                onLoginFinished={
                    (error, result) => {
                        if (error) {
                            alert("Login failed with error: " + error.message);
                        } else if (result.isCancelled) {
                            alert("Login was cancelled");
                        } else {
                            alert("Login was successful with permissions: " + result.grantedPermissions)
                        }
                    }
                }
                onLogoutFinished={() => alert("User logged out")} />
        </View>
    );
}

export default FBLoginButton;