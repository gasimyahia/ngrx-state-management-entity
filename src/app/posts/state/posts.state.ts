import { Post } from "src/app/models/posts.model";

export interface PostsState{
  posts:Post[];
}

export const PostInitialState:PostsState={
  posts:null
}
