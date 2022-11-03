import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import login from 'src/app/models/login';
import { LoginService } from 'src/app/services/login/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[CookieService]
})

export class LoginComponent implements OnInit {
  login: login = {
    username: "",
    password: "",
  }

  hidden: boolean = false
  msg: string = "Usuario o contraseña no validas"
  constructor(private loginService: LoginService, private cookie: CookieService, private router: Router) { }
  ngOnInit(): void {

  }

  getLogin() {
    this.loginService.getLogin(this.login).subscribe(
      (res: any) => {
        const { token } = res;

        this.cookie.set('token', token, {
          expires: 1,
          sameSite:'Strict',
          secure:true,
         
        }
        )
        this.router.navigateByUrl('/products')
      }, err => {
        console.log(err.status);
        this.hidden = true
      }
    )
  }
}
