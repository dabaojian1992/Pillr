import { combineReducers } from 'redux';
import session from './session_reducer';
import errors from './errors_reducer';
import messages from './messages_reducer';
import ui from "./ui_reducer";

const RootReducer = combineReducers({
  session,
  errors,
  messages,
  ui
});

export default RootReducer;