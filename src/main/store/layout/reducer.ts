import { Reducer } from 'redux';
import { LayoutState, LayoutActionTypes } from './types';

// Type-safe initialState!
const initialState: LayoutState = {
  anchor: 'left'
};

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<LayoutState> = (state = initialState, action) => {
  switch (action.type) {
    case LayoutActionTypes.SET_ANCHOR: {
      return { ...state, anchor: action.payload };
    }
    default: {
      return state;
    }
  }
};

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { reducer as layoutReducer };