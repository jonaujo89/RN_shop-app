import CartItem from "../../models/cart-item";
import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cart";
import { ADD_ORDER } from "../actions/orders";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
    items: {},
    totalAmount: 0
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.payload;
            const productPrice = addedProduct.price;
            const productTitle = addedProduct.title;
            const pushToken = addedProduct.pushToken;
            let updatedNewCartItem;
            //items key - id
            if (state.items[addedProduct.id]) {
                updatedNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    productPrice,
                    productTitle,
                    pushToken,
                    state.items[addedProduct.id].sum + productPrice
                );
            } else {
                updatedNewCartItem = new CartItem(
                    1,
                    productPrice,
                    productTitle,
                    pushToken,
                    productPrice
                );
            }
            return {
                ...state,
                items: { ...state.items, [addedProduct.id]: updatedNewCartItem },
                totalAmount: state.totalAmount + productPrice
            };
        case REMOVE_FROM_CART:
            const selectedCartItem = state.items[action.payload];
            const currentQty = selectedCartItem.quantity;
            let updatedCartItems;
            if (currentQty > 1) {
                const updatedCartItem = new CartItem(
                    selectedCartItem.quantity - 1,
                    selectedCartItem.productPrice,
                    selectedCartItem.productTitle,
                    selectedCartItem.sum - selectedCartItem.productPrice
                );
                updatedCartItems = { ...state.items, [action.payload]: updatedCartItem };
            } else {
                updatedCartItems = { ...state.items };
                //delete JS method
                delete updatedCartItems[action.payload];
            }
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - selectedCartItem.productPrice
            };
        case ADD_ORDER:
            return initialState;
        case DELETE_PRODUCT:
            if (!state.items[action.payload]) {
                return state;
            }
            const updatedItems = { ...state.items };
            const itemTotal = state.items[action.payload].sum;
            delete updatedItems[action.payload];
            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal
            };
    }
    return state;
};