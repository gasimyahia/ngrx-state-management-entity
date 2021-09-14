import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/posts.model';
import { AppState } from 'src/app/store/app.state';
import { updatePost } from '../state/posts.actions';
import { getPostById } from '../state/posts.selector';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit , OnDestroy{
  postForm:FormGroup;
  post:Post;
  subscription:Subscription;

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private store:Store<AppState>
  ) { }

  ngOnInit(): void {
    this.initPostForm();
    // using route state params
    this.subscription= this.store.select(getPostById).subscribe((post)=>{
      if(post){
        this.post=post;
        this.postForm.patchValue({
          title:post.title,
          desc:post.description
        });
      }
    });
    // this.route.paramMap.subscribe((params)=>{
    //   const id=params.get('id');
    //   this.subscription= this.store.select(getPostById,{id}).subscribe((data)=>{
    //     this.post=data;
    //     this.initPostForm();
    //   });
    // });
  }

  initPostForm(){
    this.postForm=new FormGroup({
      title:new FormControl(null,[Validators.required,Validators.minLength(6)]),
      desc:new FormControl(null,[Validators.required,Validators.minLength(10)]),
    });
  }

  onUpdatePost(){
    if(!this.postForm.valid){
      return;
    }

    let post:Post={
      id:this.post.id,
      title:this.postForm.value.title,
      description:this.postForm.value.desc
    }

    this.store.dispatch(updatePost({post}));
    this.postForm.reset();
    this.router.navigateByUrl('/posts');
  }

  showTitleError(){
    const descControl=this.postForm.get('title');
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


  ngOnDestroy(){
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
