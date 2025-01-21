import {applyMiddleware, createStore} from 'redux';
import {thunk} from 'redux-thunk';
import rootReducer from '../auth/rootReducer';

let middleware = [thunk];
middleware = [...middleware];

const store = createStore(rootReducer, applyMiddleware(...middleware));

export {store};
