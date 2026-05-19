import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: 'dark',
  },
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload
      window.localStorage.setItem('astraexam-theme', action.payload)
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      window.localStorage.setItem('astraexam-theme', state.theme)
    },
  },
})

export const { setTheme, toggleTheme } = uiSlice.actions
export default uiSlice.reducer
