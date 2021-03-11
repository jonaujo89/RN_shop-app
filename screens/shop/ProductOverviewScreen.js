import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, FlatList, Button, Platform, ActivityIndicator, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import ProductItem from '../../components/shop/ProductItem';
import CustomHeaderButton from '../../components/UI/HeaderButton';

import * as CartActions from '../../store/actions/cart';
import { fetchProducts } from '../../store/actions/products';

import Colors from '../../constants/Colors';

const ProductOverViewScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    //can't use useEffect as async, so created wrapper function
    const loadProducts = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(fetchProducts());
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setError, setIsLoading]);

    useEffect(() => {
        loadProducts();
    }, [dispatch, loadProducts]);

    const selectItemHandler = (id, title) => {
        navigation.navigate('ProductDetail', {
            productId: id,
            productTitle: title
        });
    };

    if (error) {
        return <View style={styles.centered}>
            <Text>An error occurred!</Text>
            <Button
                tytle='Try Again'
                onPress={loadProducts}
                color={Colors.primary}
            />
        </View>
    }

    if (isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator
                size='large'
                color={Colors.primary}
            />
        </View>
    }

    if (!isLoading && products.length === 0) {
        return <View style={styles.centered}>
            <Text>No products found. Maybe start adding some</Text>
        </View>
    }

    return (
        <FlatList
            data={products}
            keyExtractor={item => item.id}
            renderItem={({ item }) =>
                <ProductItem
                    imageUrl={item.imageUrl}
                    title={item.title}
                    price={item.price}
                    onSelect={() => {
                        selectItemHandler(item.id, item.title);
                    }}
                >
                    <Button
                        color={Colors.primary}
                        title='View Details'
                        onPress={() => {
                            selectItemHandler(item.id, item.title);
                        }}
                    />
                    <Button
                        color={Colors.primary}
                        title='To Cart'
                        onPress={() => {
                            dispatch(CartActions.addToCart(item));
                        }}
                    />
                </ProductItem>
            }
        />
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

ProductOverViewScreen.navigationOptions = navData => ({
    headerTitle: 'All Products',
    headerLeft: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
            title='Menu'
            iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
            onPress={() => {
                navData.navigation.toggleDrawer();
            }}
        />
    </HeaderButtons>,
    headerRight: () => <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
            title='Cart'
            iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
            onPress={() => {
                navData.navigation.navigate('Cart');
            }}
        />
    </HeaderButtons>
});

export default ProductOverViewScreen;