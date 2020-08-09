import { AsyncStorage, Platform } from 'react-native';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const AUTHENTICATE = 'AUTHENTICATE';

export const autoAuthenticate = () => {

  return async dispatch => {
    await AsyncStorage.getItem('userData', (err, result) => {
      result = JSON.parse(result);
      if (result != null && result != undefined) {
        // console.log('user Id is ' + result.userId);
        dispatch({
          type: AUTHENTICATE,
          payload: {
            userId: result.userId,
            userName: result.userName,
            userPhone: result.userPhone,
            userGender: result.userGender
          }
        });
      };

    });
  }
};

export const authenticate = (userId, userName, userPhone, userGender) => {
  // console.log(userId + " = " + userName + " = " + userPhone + " = " + userGender);

  return {
    type: AUTHENTICATE, payload: {
      userId,
      userName,
      userPhone,
      userGender
    }
  };
};

export const logout = () => {
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
}

export const signup = (name, email, password, phone, gender) => {
  // console.log(name+" = "+email+" = "+password+" = "+phone+" = "+gender);

  return async dispatch => {
    const response = await fetch(
      "https://www.nurseriesworld.com/ws.php?type=select_count&format=json&table=customers&columns=*&condition=email='" + email + "'",
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_EXISTS') {
        message = 'This email exists already!';
      } else {
        if (errorResData.posts[0]['count'] != 0) {
          message = "Your email address already exists in our database please try to login first";
        }
      }
      throw new Error(message);
    }

    const json = await response.json();
    // console.log(json);

    if (json.posts[0]['count'] != 0) {
      let message = "Your email address already exists in our database please try to login first";
      throw new Error(message);
    } else {
      const signupResponse = await fetch(
        'https://www.nurseriesworld.com/ws.php?type=insert&format=json&countryid=' + 1 + '&table=customers&columns=email,password,name,phoneNumber,gender,uuid,platform&values="' + email + '","' + password + '","' + name + '","' + phone + '","' + gender + '","' + 'UUID' + '","' + Platform.OS + '"',
        {
          method: 'GET',
        }
      );

      if (!signupResponse.ok) {
        const signupErrorResData = await signupResponse.json();
        const signupErrorId = signupErrorResData.error.message;
        let message = 'Something went wrong!';
        if (signupErrorId === 'EMAIL_EXISTS') {
          message = 'This email exists already!';
        } else {
          if (errorResData.posts[0]['count'] != 0) {
            message = "Your email address already exists in our database please try to login first";
          }
        }
        throw new Error(message);
      }

      const signupJson = await signupResponse.json();
      // console.log(signupJson);
      const userID = signupJson.posts[0];

      dispatch(authenticate(userID, name, phone, gender));

      saveDataToStorage(userID, name, phone, gender);
    }
  };
};

export const login = (email, password) => {

  return async dispatch => {
    const response = await fetch(
      `https://www.nurseriesworld.com/ws.php?type=login&format=json&countryid=1&condition=email=%27${email}%27%20and%20password=%27${password}%27`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found!';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'This password is not valid!';
      } else {
        message = 'Email Or Password Not Valid';
      }
      throw new Error(message);
    }

    const json = await response.json();
    if (json.posts[0] == 0) {
      let message = 'Email or Password Not Valid';
      throw new Error(message);
    } else {
      // console.log(resData);
      const userData = json.posts[0];
      dispatch(authenticate(userData.id, userData.name, userData.phoneNumber, userData.gender));

      saveDataToStorage(userData.id, userData.name, userData.phoneNumber, userData.gender);
    }
  };
};

export const saveProfile = (userId, name, password, phone, gender) => {
  // console.log(name + " = " + password + " = " + phone + " = " + gender);

  return async dispatch => {
    let URL = 'https://www.nurseriesworld.com/ws.php?type=update&format=json&table=customers&columns=name=%27' + name + '%27,gender=%27' + gender + '%27,phoneNumber=%22' + phone + '%22';
    if (password != "") {
      URL += ',password=%22' + password + '%22';
    }
    URL += '&condition=id=' + userId;

    // console.log(URL);
    dispatch(authenticate(userId, name, phone, gender));

    saveDataToStorage(userId, name, phone, gender);

    const response = await fetch(URL);

    if (!response.ok) {
      throw new Error("Failed To Update Profile");
    }

    const json = await response.json();
    if (json['posts'][0] != 0) {
      dispatch(authenticate(userId, name, phone, gender));

      saveDataToStorage(userId, name, phone, gender);
    }
  }
};

const saveDataToStorage = (userId, userName, userPhone, userGender) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      userId,
      userName,
      userPhone,
      userGender,
    })
  );
};
