import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Post } from 'src/app/models/posts.model';
import { AppState } from 'src/app/store/app.state';
import { addPost } from '../state/posts.actions';
import { getPosts } from '../state/posts.selector';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
  postForm:FormGroup;

  constructor(private store:Store<AppState>,private router:Router) { }

  ngOnInit(): void {
    this.initPostForm();
  }

  initPostForm(){
    this.postForm=new FormGroup({
      title:new FormControl(null,[Validators.required,Validators.minLength(6)]),
      desc:new FormControl(null,[Validators.required,Validators.minLength(10)]),
    });
  }

  showDesccriptionError(){
    const descControl=this.postForm.get('desc');
    if(descControl.touched && !descControl.valid){
      if(descControl.errors.minlength){
        return 'Description should be of minmum 10 characters';
      }
      if(descControl.errors.required){
        return 'Description is required';
      }

    }
    return null
  }

  onAddPost(){
    if(!this.postForm.valid){
      return;
    }
    let posts:Post[]=this.getPostsData();
    // let oldid:string=posts[posts.length - 1].id;
    // let id:string= (+oldid + 1).toString();

    const post: Post ={
      // id: (+(posts[posts.length - 1].id)+1).toString(),
      title: this.postForm.value.title,
      description: this.postForm.value.desc
    };

    this.store.dispatch(addPost({post}));
    this.router.navigateByUrl('/posts')
    this.postForm.reset();
  }

  getPostsData():Post[]{
    let dat:Post[];
    this.store.select(getPosts).subscribe((data)=>{
    dat=data;
    });
    return dat;
   }

}
