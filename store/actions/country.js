export const MAKE_VISIBLE = 'make_visible';
export const MAKE_HIDDEN = 'make_hidden';

export const showCountryModal = () =>{
    return{
        type: MAKE_VISIBLE,
        payload: true
    };
};

export const hideCountryModal = () =>{
    return{
        type: MAKE_HIDDEN,
        payload: false
    };
};