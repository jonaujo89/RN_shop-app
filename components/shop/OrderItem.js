import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Colors from '../../constants/Colors';

import CartItem from './CartItem';

const OrderItem = ({ date, amount, items }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <View style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.total}>{amount.toFixed(2)} </Text>
                <Text style={styles.date}>{date}</Text>
            </View>
            <Button
                color={Colors.primary}
                title={showDetails ? 'Hide Details' : 'Show Details'}
                onPress={() => {
                    setShowDetails(prevState => !prevState);
                }}
            />
            {/*js if showDetails true then next will be true too => display  */}
            {showDetails && <View style={styles.detailItem}>
                {items.map(item => 
                    <CartItem
                        key={item.productId}
                        quantity={item.quantity}
                        amount={item.sum}
                        title={item.productTitle}
                    />
                )}
            </View>}
        </View>
    );
};

const styles = StyleSheet.create({
    orderItem: {
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 10,
        elevation: 7,
        borderRadius: 15,
        backgroundColor: 'white',
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
    },
    total: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    date: {
        fontFamily: 'open-sans',
        fontSize: 18,
        color: '#888'
    },
    detailItem: {
        width: '100%',
        marginTop: 10
    }
});

export default OrderItem;