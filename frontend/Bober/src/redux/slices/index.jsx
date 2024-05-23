import { combineReducers } from 'redux'
import formsReducer from './formsSlice'

const rootReducer = combineReducers({
  forms: formsReducer,
})

export default rootReducer
