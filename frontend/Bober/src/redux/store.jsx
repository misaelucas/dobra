import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './slices' // Import the root reducer

const store = configureStore({
  reducer: rootReducer,
})

export default store
