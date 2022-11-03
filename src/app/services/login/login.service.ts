import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import login from 'src/app/models/login';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  URL=environment.API_URL
  constructor(private htpp:HttpClient) { }
  getLogin(user:login){
    return this.htpp.post(`${this.URL}/auth/login`,user)
  }
}
