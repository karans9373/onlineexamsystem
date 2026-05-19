import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../lib/api'

const savedToken = window.localStorage.getItem('astraexam-token')
const savedUser = window.localStorage.getItem('astraexam-user')

export const loginUser = createAsyncThunk('auth/login', async (payload, thunkApi) => {
  try {
    const { data } = await api.post('/auth/login', payload)
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Login failed')
  }
})

export const registerUser = createAsyncThunk('auth/register', async (payload, thunkApi) => {
  try {
    const { data } = await api.post('/auth/register', payload)
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Registration failed')
  }
})

export const verifyOtp = createAsyncThunk('auth/verifyOtp', async (payload, thunkApi) => {
  try {
    const { data } = await api.post('/auth/verify-email', payload)
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'OTP verification failed')
  }
})

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (payload, thunkApi) => {
  try {
    const { data } = await api.post('/auth/forgot-password', payload)
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Unable to send OTP')
  }
})

export const resetPassword = createAsyncThunk('auth/resetPassword', async (payload, thunkApi) => {
  try {
    const { data } = await api.post('/auth/reset-password', payload)
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Unable to reset password')
  }
})

export const fetchMe = createAsyncThunk('auth/me', async (_, thunkApi) => {
  try {
    const { data } = await api.get('/auth/me')
    return data
  } catch (error) {
    return thunkApi.rejectWithValue(error.response?.data?.detail || 'Session expired')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: savedToken || '',
    user: savedUser ? JSON.parse(savedUser) : null,
    status: 'idle',
    error: '',
    devOtp: '',
    helperMessage: '',
  },
  reducers: {
    logout(state) {
      state.token = ''
      state.user = null
      window.localStorage.removeItem('astraexam-token')
      window.localStorage.removeItem('astraexam-user')
    },
    clearAuthMessage(state) {
      state.error = ''
      state.helperMessage = ''
      state.devOtp = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.access_token
        state.user = action.payload.user
        state.error = ''
        window.localStorage.setItem('astraexam-token', action.payload.access_token)
        window.localStorage.setItem('astraexam-user', JSON.stringify(action.payload.user))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.helperMessage = action.payload.message
        state.devOtp = action.payload.dev_otp || ''
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.helperMessage = action.payload.message
        state.devOtp = ''
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.helperMessage = action.payload.message
        state.devOtp = action.payload.dev_otp || ''
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.helperMessage = action.payload.message
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload
        window.localStorage.setItem('astraexam-user', JSON.stringify(action.payload))
      })
      .addCase(fetchMe.rejected, (state) => {
        state.token = ''
        state.user = null
        window.localStorage.removeItem('astraexam-token')
        window.localStorage.removeItem('astraexam-user')
      })
  },
})

export const { logout, clearAuthMessage } = authSlice.actions
export default authSlice.reducer
