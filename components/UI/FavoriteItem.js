import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useDispatch } from 'react-redux';
import { handleFav } from '../../store/actions/nurseries';

const FavoriteItem = ({ item, checked }) => {
    const [isChecked, setIsChecked] = useState(checked);
    // console.log(isChecked);
    const dispatch = useDispatch();
    return <View style={styles.countriesCont}>
        <CheckBox
            title={item.name}
            checked={isChecked}
            onPress={async () => {
                await dispatch(handleFav(item.id, isChecked));
                setIsChecked(!isChecked);
                // console.log(newChecked);
                // console.log(checked);

            }}
        />
    </View>;
};

const styles = StyleSheet.create({
    card: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white'
    }
});

export default FavoriteItem;
