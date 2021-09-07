import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Post } from 'src/app/models/posts.model';
import { AppState } from 'src/app/store/app.state';
import { deletePost } from '../state/posts.actions';
import { getPosts } from '../state/posts.selector';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  posts:Observable<Post[]>;

  constructor(private store:Store<AppState>) { }

  ngOnInit(): void {
    this.posts=this.store.select(getPosts);
  }

  onDeletePost(id:string){
    if(confirm('are you sure went to delete!')){
      console.log(id);
      this.store.dispatch(deletePost({id}))
    }
  }

}
