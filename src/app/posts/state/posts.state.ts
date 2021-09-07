import { Post } from "src/app/models/posts.model";

export interface PostsState{
  posts:Post[];
}

export const PostInitialState:PostsState={
  posts:[
    {id:'1',title:'Sample Title 1',desc:'sample Description 1'},
    {id:'2',title:'Sample Title 2',desc:'sample Description 2'},
  ]
}
