import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import rubricsReducer from "../features/rubrics/rubricsSlice";
import bbsReducer from "../features/bbs/bbsSlice";
import servicesReducer from "../features/services/servicesSlice";
import themeReducer from "../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    rubrics: rubricsReducer,
    bbs: bbsReducer,
    services: servicesReducer,
    theme: themeReducer,
  },
  devTools: true,
});
