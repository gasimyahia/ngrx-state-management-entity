import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AppState } from 'src/app/store/app.state';
import { getCounter, getText } from '../state/counter.selector';
import { CounterState } from '../state/counter.state';

@Component({
  selector: 'app-counter-output',
  templateUrl: './counter-output.component.html',
  styleUrls: ['./counter-output.component.css']
})
export class CounterOutputComponent implements OnInit ,OnDestroy {
  counter:number;
  text:string;
  text$:Observable<string>;
  counter$: Observable<number>;
  counterSubscription:Subscription;

  constructor(private store:Store<AppState>) { }

  ngOnInit(): void {

    // git state with subscription
    this.counterSubscription = this.store.select(getCounter).subscribe(counter=>{
      this.counter=counter;
    });

    this.counterSubscription = this.store.select(getText).subscribe(text=>{
       this.text=text;
     });
     // git state with observable
    this.counter$=this.store.select(getCounter);
    this.text$=this.store.select(getText);
  }

  ngOnDestroy(){
    if(this.counterSubscription){
      this.counterSubscription.unsubscribe;
    }
  }

}
