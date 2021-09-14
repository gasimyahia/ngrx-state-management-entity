import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RouterNavigatedAction, ROUTER_NAVIGATION } from "@ngrx/router-store";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { filter, map, mergeMap, switchMap } from "rxjs/operators";
import { Post } from "src/app/models/posts.model";
import { postsService } from "src/app/service/posts.service";
import { setLoadingSpinner } from "src/app/share/component/state/shared.actions";
import { AppState } from "src/app/store/app.state";
import { addPost, addPostSuccess, deletePost, deletePostSuccess, loadPosts, loadPostsSuccess, updatePost, updatePostSuccess } from "./posts.actions";

@Injectable()

export class PostsEffects{
  posts:Observable<Post[]>;
  constructor(private actions$:Actions,private postsService:postsService,private store:Store<AppState>){

  }

  loadPosts$=createEffect(()=>{
    return this.actions$.pipe(
      ofType(loadPosts),
      mergeMap((action)=>{
        return this.postsService.getPosts().pipe(
          map((posts)=>{
            this.store.dispatch(setLoadingSpinner({status:false}));
            return loadPostsSuccess({posts});
          })
        );
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
            return updatePostSuccess({ post:action.post} );
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
      switchMap((id)=>{
        return this.postsService.getPostById(id).pipe(
          map((post)=>{
            const postData=[{ ...post,id}];
            return loadPostsSuccess({posts:postData});
        }));
      })
    );
  });


}
