import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../api/axiosClient";
import { getToken, setToken, clearToken } from "../api/tokenStorage";

const extractError = (err) =>
    err?.response?.data?.message || err?.response?.data || err?.message || "Something went wrong";

export const registerUser = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axiosClient.post("/user/register", payload);
        setToken(data.token);
        const { data: profile } = await axiosClient.get("/user/profile");
        return profile;
    } catch (err) {
        return rejectWithValue(extractError(err));
    }
});

export const loginUser = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
    try {
        const { data } = await axiosClient.post("/user/login", payload);
        setToken(data.token);
        const { data: profile } = await axiosClient.get("/user/profile");
        return profile;
    } catch (err) {
        return rejectWithValue(extractError(err));
    }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        await axiosClient.post("/user/logout");
        return null;
    } catch (err) {
        return rejectWithValue(extractError(err));
    } finally {
        // Always clear the local session, even if the server-side blocklist call failed —
        // the user shouldn't be stuck "logged in" in this tab either way.
        clearToken();
    }
});

export const checkAuth = createAsyncThunk("auth/check", async (_, { rejectWithValue }) => {
    if (!getToken()) {
        return rejectWithValue(null);
    }
    try {
        const { data } = await axiosClient.get("/user/profile");
        return data;
    } catch (err) {
        return rejectWithValue(extractError(err));
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isAuthenticated: false,
        authChecked: false,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.authChecked = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.authChecked = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(checkAuth.pending, (state) => { state.loading = true; })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.authChecked = true;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.authChecked = true;
            });
    },
});

export default authSlice.reducer;
