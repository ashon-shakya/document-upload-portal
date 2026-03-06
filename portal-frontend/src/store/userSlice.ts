import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { UserData } from '../interfaces/UserData';

import type { UserState } from '../interfaces/UserState';

const initialState: UserState = {
    userData: null,
    isCheckingAuth: true,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserData: (state, action: PayloadAction<UserData>) => {
            state.userData = action.payload;
        },
        clearUserData: (state) => {
            state.userData = null;
        },
        setIsCheckingAuth: (state, action: PayloadAction<boolean>) => {
            state.isCheckingAuth = action.payload;
        }
    },
});

export const { setUserData, clearUserData, setIsCheckingAuth } = userSlice.actions;

export default userSlice.reducer;
