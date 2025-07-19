import {createSlice} from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name:'user',
    initialState: {
        user: null
    },
    reducers: {
        setUser: (state, action) => {
            console.log("userSlice - getUser reducer called with payload:", action.payload);
            state.user = action.payload;
            console.log("userSlice - Updated state:", state);
        },
    },
});

export const {setUser} = userSlice.actions;