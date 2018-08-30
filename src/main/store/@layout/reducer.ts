import { Reducer } from 'redux';
import { LayoutState, LayoutActionTypes } from './types';

// Type-safe initialState!
const initialState: LayoutState = {
  anchor: 'left',
  menuDrawer: false,
  additionalDrawer: false,
  accountShow: false,
  topDrawer: false,
  bottomDrawer: false,
  menuItems: [],
  active: {
    menuUid: '',
    title: 'Home',
    subTitle: 'The home page'
  },
  user: null
};

// Thanks to Redux 4's much simpler typings, we can take away a lot of typings on the reducer side,
// everything will remain type-safe.
const reducer: Reducer<LayoutState> = (state = initialState, action) => {
  switch (action.type) {
    case LayoutActionTypes.SET_ANCHOR: {
      return { 
        ...state, 
        anchor: action.payload 
      };
    }
    case LayoutActionTypes.SET_MENU_DRAWER: {
      return { 
        ...state, 
        menuDrawer: action.payload 
      };
    }
    case LayoutActionTypes.SET_ADDITIONAL_DRAWER: {
      return { 
        ...state, 
        additionalDrawer: action.payload 
      };
    }
    case LayoutActionTypes.SET_ACCOUNT_SHOW: {
      return { 
        ...state, 
        accountShow: action.payload 
      };
    }
    case LayoutActionTypes.SET_TOP_DRAWER: {
      return { 
        ...state, 
        topDrawer: action.payload 
      };
    }
    case LayoutActionTypes.SET_BOTTOM_DRAWER: {
      return { 
        ...state, 
        bottomDrawer: action.payload 
      };
    }
    case LayoutActionTypes.SET_MENU_ITEMS: {
      return { 
        ...state, 
        menuItems: action.payload 
      };
    }
    case LayoutActionTypes.SET_ACTIVE: {
      return { 
        ...state, 
        active: action.payload 
      };
    }
    case LayoutActionTypes.SET_USER: {
      return { 
        ...state, 
        user: action.payload 
      };
    }
    default: {
      return state;
    }
  }
};

// Instead of using default export, we use named exports. That way we can group these exports
// inside the `index.js` folder.
export { reducer as layoutReducer };