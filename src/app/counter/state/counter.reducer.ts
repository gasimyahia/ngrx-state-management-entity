
import { state } from "@angular/animations";
import { createReducer,on } from "@ngrx/store";
import { customIncrement, decrement, increment, reset } from "./counter.actions";
import { CounterInitialState } from "./counter.state";

const _counterReducer=createReducer(
  CounterInitialState,on(increment,(state)=>{
    return {
      ...state,
      counter:state.counter + 1 ,
    };
  }
  )
  ,on(decrement,(state)=>{
    return {
      ...state,
      counter:state.counter - 1 ,
    };
  }
  )
  ,on(reset,(state)=>{
    return {
      ...state,
      counter:0 ,
    };
  },
  ),
  on(customIncrement,(state,action)=>{
    console.log(action);
    return{
      ...state,
      counter:state.counter + action.count
    };
  })
);

export function counterReducer(state,action){
  return _counterReducer(state,action);
}
