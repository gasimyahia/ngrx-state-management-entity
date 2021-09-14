import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/posts.model';
import { AppState } from 'src/app/store/app.state';
import { getPostById } from '../state/posts.selector';

@Component({
  selector: 'app-post-detials',
  templateUrl: './post-detials.component.html',
  styleUrls: ['./post-detials.component.css']
})
export class PostDetialsComponent implements OnInit {
  post:Observable<Post>;

  constructor(private store:Store<AppState>) { }

  ngOnInit(): void {
    this.post=this.store.select(getPostById);
  }

}
