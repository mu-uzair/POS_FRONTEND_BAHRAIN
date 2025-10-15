import {configureStore} from '@reduxjs/toolkit';
import customerSlice from './slice/customerSlice'
import cartSlice from './slice/cartSlice'
import userSlice from './slice/userSlice'
import editOrderSlice from './slice/editOrderSlice'

const store = configureStore({

    reducer:{
        customer : customerSlice,
        cart : cartSlice,
        user : userSlice,
        editOrder : editOrderSlice
    },
    devTools: import.meta.env.NODE_ENV !== "production",

});
export default store;