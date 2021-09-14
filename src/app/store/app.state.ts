

import { SHARED_STATE_NAME } from "../share/component/state/shared.selector";
import { SharedReducer } from "../share/component/state/share.reducer";
import { SharedState } from "../share/component/state/shared.state";
import { AUTH_STATE_NAME } from "../auth/state/auth.selectors";
import { AuthState } from "../auth/state/auth.state";
import { AuthReducer } from "../auth/state/auth.reducer";
import { routerReducer, RouterReducerState } from "@ngrx/router-store";

export interface AppState{
 [SHARED_STATE_NAME]:SharedState;
 [AUTH_STATE_NAME]:AuthState;
 router:RouterReducerState;
}

export const appReducer={
  [SHARED_STATE_NAME]: SharedReducer,
  [AUTH_STATE_NAME]:AuthReducer,
  router:routerReducer,
}
