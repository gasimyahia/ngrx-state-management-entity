import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Post } from "../models/posts.model";

@Injectable({
  providedIn:'root'
})
export class postsService{
  constructor(private http:HttpClient){}

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
    return this.http.post(`https://state-management-46abf-default-rtdb.firebaseio.com/posts.json`,post);
  }
}
