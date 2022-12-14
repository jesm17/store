import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  URL=environment.API_URL
  constructor(private http:HttpClient) { }

  getproducts(){
    return this.http.get(`${this.URL}/products`)
  }
  getproduct(id:number){
    return this.http.get(`${this.URL}/products/${id}`)
  }
}
