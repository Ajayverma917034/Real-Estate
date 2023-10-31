import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
     reducers:{
        signInStart: (state)=>{
            state.loading = true;
        },
        signInSuccess: (state, action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action)=>{
            state.error = action.payload;
            state.loading = false;
        },
        updateUserStart: (state)=>{
            state.loading = true;
        },
        updateUserSuccess: (state, action)=>{
            state.currentUser = action.payload;
            state.loading = false;
            state.error= null;
        },
        updateUserFailure: (state, action)=>{
            state.error = action.payload;
            state.loading = false;
        },
        deleteUserStart:(state)=>{
            state.loading = true;
        },
        deleteUserSuccess: (state)=>{
            state.loading = false;
            state.error = false;
            state.currentUser = null;
        },
        deleteUserFalilure: (state,action)=>{
            state.loading = false;
            state.error = action.payload;
        }
        
     }
})

export const {signInStart, signInSuccess, signInFailure, updateUserFailure, updateUserStart, updateUserSuccess, deleteUserFalilure, deleteUserStart, deleteUserSuccess} = userSlice.actions

export default userSlice.reducer;