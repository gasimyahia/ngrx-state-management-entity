import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "../models/posts.model";
import { getPosts } from "../posts/state/posts.selector";

@Injectable({
  providedIn:'root'
})
export class postsService implements OnInit{
  constructor(private http:HttpClient,private store:Store){}

  ngOnInit() :void{
    console.log(this.getPostsData());
  }

  getPosts():Observable<Post[]>{
    return this.http.get<Post[]>(`https://state-management-46abf-default-rtdb.firebaseio.com/posts.json`).pipe(
      map((data)=>{
        const posts:Post[]=[];
        for(let key in data){
          posts.push({ ...data[key]});
        }
        return posts;
      })
    );
  }


  addPost(post:Post){
     const postData={title:post.title,description:post.description};
    return this.http.post(`https://state-management-46abf-default-rtdb.firebaseio.com/posts.json`,postData);
  }

  updatePost(post:Post){
    const postData={[post.id]:{title:post.title,description:post.description},};
    return this.http.patch(`https://state-management-46abf-default-rtdb.firebaseio.com/posts.json`,postData);
  }

  deletePost(id:string){
    return this.http.delete(`https://state-management-46abf-default-rtdb.firebaseio.com/posts/${id}.json`);
  }

  getPostById(id:any):Observable<Post>{
    return this.http.get<Post>(`https://state-management-46abf-default-rtdb.firebaseio.com/posts/${id}.json`);
  }



  getPostsData():Post[]{
    let dat:Post[];
    this.store.select(getPosts).subscribe((data)=>{
    dat=data;
    });
    return dat;
   }



}
