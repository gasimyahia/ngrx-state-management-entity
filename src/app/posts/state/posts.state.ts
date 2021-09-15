import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Post } from "src/app/models/posts.model";

export interface PostsState extends EntityState<Post>{
  // we can add additinoal data her
  count: number;
}

export const postsAdapter=createEntityAdapter<Post>({
  // adapter can take attribute and function
  sortComparer: sortByName,
});

export const PostInitialState:PostsState=postsAdapter.getInitialState({
  count: 0,
});

export function sortByName(a: Post, b: Post): number {
  const compare= a.title.localeCompare(b.title);
  if(compare>0){
    return -1;
  }

  if(compare<0){
    return 1;
  }

  return compare;
}
