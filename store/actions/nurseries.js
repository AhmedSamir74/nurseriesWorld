import { AsyncStorage } from 'react-native';

export const SET_NURSERIES = 'set_nurseries';
export const SET_FILTERS = 'set_filters';
export const RESET_FILTERS = 'reset_filters';
export const SET_COUNTRY = 'set_country';
export const HANDLE_FAV = 'handle_fav';

export const fetchNurseries = (from, sortType, countryId) => {

    if (typeof from != "number") {
        from = 0;
    }
    return async (dispatch, getState) => {
        const currentSortType = getState().nurseries.sortType;
        const currentSlectedCountry = getState().nurseries.slectedCountry;
        const currentCity = getState().nurseries.city;
        const currentArea = getState().nurseries.area;
        const currentFacilities = getState().nurseries.facilities;
        const currentLangauges = getState().nurseries.langauges;
        const currentPrice = getState().nurseries.price;
        const userId = getState().auth.userId;
        // console.log(userId);

        // console.log(currentSlectedCountry);

        // console.log(currentCity + " = " + currentArea + " = " + currentFacilities + " = " + currentLangauges + " = " + currentPrice);

        if (sortType == null) {
            sortType = currentSortType;
        }

        let URL = 'https://www.nurseriesworld.com/ws.php?type=nurserieslist&format=json&limit=' + from + ',10&sortby=' + sortType;
        // any async code you want!
        if (userId != null) {
            URL += '&customerId=' + userId;
        }
        if (currentSlectedCountry != null && typeof currentSlectedCountry == "number") {
            URL += '&countryid=' + currentSlectedCountry;
        } else if (countryId != null) {
            URL += '&countryid=' + countryId;
        }
        if (currentCity != null) {
            URL += '&cityid=' + currentCity;
        }
        if (currentArea != null) {
            URL += '&areaid=' + currentArea;
        }
        if (currentFacilities != null) {
            URL += '&facilities=' + currentFacilities.join(',');
        }
        if (currentLangauges != null) {
            URL += '&languages=' + currentLangauges.join(',');
        }
        if (currentPrice != null) {
            URL += '&price=' + currentPrice;
        }

        try {
            const response = await fetch(URL);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();

            if (resData.posts[0] != 0) {
                dispatch({ type: SET_NURSERIES, payload: { resData, from, sortType } });
            }
        } catch (err) {
            throw err;
        }
    };
};

export const setCountry = (id) => {
    AsyncStorage.setItem('userCountry', id);

    return {
        type: SET_COUNTRY,
        payload: {
            id
        }
    };
};

export const filterNurseries = (countryId, city, area, price, facilities, languages, sortType) => {

    return async dispatch => {

        // any async code you want!
        try {
            const response = await fetch(
                'https://www.nurseriesworld.com/ws.php?type=nurserieslist&format=json&countryid=' + countryId + '&languages=' + languages.join(',') + '&facilities=' + facilities.join(',') + '&cityid=' + city + '&areaid=' + area + '&price=' + price + '&sortby=' + sortType
            );

            if (!response.ok) {
                console.log('Something went wrong!');

                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            // console.log("Fetch nurseries Action Called");
            // console.log(resData.posts.length);

            dispatch({ type: SET_FILTERS, payload: { resData, countryId, city, area, price, facilities, languages, sortType } });
        } catch (err) {
            // send to custom analytics server.
            // console.log(err.message);

            throw err;
        }
    };
};

export const resetFilters = () => {

    return dispatch => {
        dispatch({ type: RESET_FILTERS });
    };
};

export const handleFav = (nurseryId, infav) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        const countryId = getState().nurseries.slectedCountry;
        let URL;
        if (infav) {
            console.log("Removed TO Fav");

            URL = 'http://www.nurseriesworld.com/ws.php?type=delete&format=json&countryid=' + countryId + '&table=favourites&condition=customerID="' + userId + '" and nurseryID="' + nurseryId + '"';
        } else {
            console.log("Added TO Fav");

            URL = 'http://www.nurseriesworld.com/ws.php?type=insert&format=json&countryid=' + countryId + '&table=favourites&columns=nurseryID,customerID&values="' + nurseryId + '","' + userId + '"';
        }
        try {
            const response = await fetch(URL);

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();

            if (resData.posts[0] != 0) {

                dispatch({ type: HANDLE_FAV, payload: { nurseryId, infav } });
            }
        } catch (err) {
            throw err;
        }

    };
}