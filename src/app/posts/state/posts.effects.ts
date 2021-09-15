import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Update } from "@ngrx/entity";
import { RouterNavigatedAction, ROUTER_NAVIGATION } from "@ngrx/router-store";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { filter, map, mergeMap, switchMap, withLatestFrom } from "rxjs/operators";
import { dummyAction } from "src/app/auth/state/auth.actions";
import { Post } from "src/app/models/posts.model";
import { postsService } from "src/app/service/posts.service";
import { setLoadingSpinner } from "src/app/share/component/state/shared.actions";
import { AppState } from "src/app/store/app.state";
import { addPost, addPostSuccess, deletePost, deletePostSuccess, loadPosts, loadPostsSuccess, updatePost, updatePostSuccess } from "./posts.actions";
import { getPosts } from "./posts.selector";

@Injectable()

export class PostsEffects{
  posts:Observable<Post[]>;
  constructor(private actions$:Actions,private postsService:postsService,private store:Store<AppState>){

  }

  loadPosts$=createEffect(()=>{
    return this.actions$.pipe(
      ofType(loadPosts),
      withLatestFrom(this.store.select(getPosts)),
      mergeMap(([action,posts])=>{
        if(!posts.length || posts.length===1){
          return this.postsService.getPosts().pipe(
            map((posts)=>{
              this.store.dispatch(setLoadingSpinner({status:false}));
              return loadPostsSuccess({posts});
            })
          );
        }
        return of(dummyAction());
      })
    );
  }
  );


  addPost$=createEffect(()=>{
    return this.actions$.pipe(
      ofType(addPost),
      mergeMap((action)=>{
        return this.postsService.addPost(action.post).pipe(
          map((data:any)=>{
            const post={...action.post,id:data.name};
            return addPostSuccess({ post} );
          })
        )
      })
    );
  });


  updatePost$=createEffect(()=>{
    return this.actions$.pipe(
      ofType(updatePost),
      switchMap((action)=>{
        return this.postsService.updatePost(action.post).pipe(
          map((data)=>{
            const updatePost:Update<Post>={
              id:action.post.id,
              changes:{
                ...action.post
              }
            }
            return updatePostSuccess({ post:updatePost} );
          })
        )
      })
    );
  });

  deletePost$=createEffect(()=>{
    return this.actions$.pipe(
      ofType(deletePost),
      switchMap((action)=>{
        return this.postsService.deletePost(action.id).pipe(
          map((data)=>{
            return deletePostSuccess({ id:action.id} );
          })
        )
      })
    );
  });


  getSinglePost$=createEffect(()=>{
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((r:RouterNavigatedAction)=>{
        return r.payload.routerState.url.startsWith('/posts/detials');
      }),
      map((r:RouterNavigatedAction)=>{
        return r.payload.routerState['params']['id'];
      }),
      withLatestFrom(this.store.select(getPosts)),
      switchMap(([id,posts])=>{
        // given data  from api when loacal data is empty
        if(!posts.length){
          return this.postsService.getPosts().pipe(
            map((post)=>{
              const postData=[{ ...post,id}];
              return loadPostsSuccess({posts:post});
          }));
        }
        // return nathing
        return of(dummyAction());
      })
    );
  });


}
