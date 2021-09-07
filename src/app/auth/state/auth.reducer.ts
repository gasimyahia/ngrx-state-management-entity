import { createReducer } from "@ngrx/store";
import { authInitialState } from "./auth.state";

const _authReducer=createReducer(authInitialState);

export function AuthReducer(state,action){
  return _authReducer(state,action);
}
