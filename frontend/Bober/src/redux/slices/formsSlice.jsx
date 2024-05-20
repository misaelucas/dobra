import { createSlice } from '@reduxjs/toolkit'

const formsSlice = createSlice({
  name: 'forms',
  initialState: {
    forms: [],
    totalSum: 0,
    cashSum: 0,
    digitalSum: 0,
    expenses: [],
    expenseSum: 0,
    notification: {
      message: '',
      type: '',
      show: false,
    },
  },
  reducers: {
    setForms: (state, action) => {
      state.forms = action.payload
    },
    setTotalSum: (state, action) => {
      state.totalSum = action.payload
    },
    setCashSum: (state, action) => {
      state.cashSum = action.payload
    },
    setDigitalSum: (state, action) => {
      state.digitalSum = action.payload
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload
    },
    setExpenseSum: (state, action) => {
      state.expenseSum = action.payload
    },
    showNotification: (state, action) => {
      state.notification = { ...action.payload, show: true }
    },
    hideNotification: (state) => {
      state.notification.show = false
    },
  },
})

export const {
  setForms,
  setTotalSum,
  setCashSum,
  setDigitalSum,
  setExpenses,
  setExpenseSum,
  showNotification,
  hideNotification,
} = formsSlice.actions

export default formsSlice.reducer
