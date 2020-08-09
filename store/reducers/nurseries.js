import { AsyncStorage } from 'react-native';
import { SET_NURSERIES, SET_COUNTRY, SET_CITY, SET_FILTERS, RESET_FILTERS, HANDLE_FAV } from "../actions/nurseries";

const INITAIL_STATE = {
    nurseries: {},
    sortType: 'name',
    slectedCountry: AsyncStorage.getItem('userCountry', (err, id) => {
        return id
    }),
    city: null,
    area: null,
    facilities: null,
    langauges: null,
    price: null,
    filterSet: false
};

export default nurseriesReducer = (state = INITAIL_STATE, action) => {
    switch (action.type) {
        case SET_NURSERIES:
            // console.log(action.payload.sortType);

            // if the return has a posts array && the new records doesn't equal the saved in redux => append to redux 
            // else return the saved nurseries  

            let nextArray = state.nurseries.posts != undefined ?
                state.nurseries.posts != action.payload.resData.posts ?
                    [
                        ...state.nurseries.posts,
                        ...action.payload.resData.posts,
                    ]
                    : action.payload.resData.posts
                : [
                    ...action.payload.resData.posts
                ];

            if (action.payload.from == 0) {
                nextArray = [
                    ...action.payload.resData.posts
                ];
            }
            return {
                ...state,
                nurseries: { posts: nextArray },
                sortType: action.payload.sortType
            };
        case SET_COUNTRY:
            return {
                ...state,
                slectedCountry: action.payload.id
            }
        case SET_CITY:
            return {
                ...state,
                city: action.payload.resData
            }

        case SET_FILTERS:
            // console.log(action.payload.resData.posts.length);
            return {
                ...state,
                nurseries: { posts: action.payload.resData.posts },
                sortType: action.payload.sortType,
                city: action.payload.city,
                area: action.payload.area,
                price: action.payload.price,
                facilities: action.payload.facilities,
                langauges: action.payload.languages,
                filterSet: true
            };
        case RESET_FILTERS:
            return {
                ...INITAIL_STATE,
                slectedCountry: state.slectedCountry
            }
        case HANDLE_FAV:
            const nurseryIndex = state.nurseries.posts.findIndex(item => item.id == action.payload.nurseryId);
            let updatedNurseries = state.nurseries;
            updatedNurseries.posts[nurseryIndex].infav = !action.payload.infav;

            return {
                ...state,
                nurseries: updatedNurseries
            }
        default:
            return state;
    }
};
