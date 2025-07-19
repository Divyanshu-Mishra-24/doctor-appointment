import {configureStore} from '@reduxjs/toolkit'
import { alertSlice } from './features/alertSlice'
import { userSlice } from './features/userSlice'

export default configureStore({
    reducer:{
     alert:alertSlice.reducer ,
     user:userSlice.reducer,
    },
    // devTools: process.env.NODE_ENV !== 'production'
})