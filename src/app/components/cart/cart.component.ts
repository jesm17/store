import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
    this.getCookie()
    this.TotalPtice()
  }

  products: any = []
  total = 0

  getCookie() {
    this.products = (JSON.parse(this.cookieService.get('product')))
    for (let i = 0; i < this.products.length; i++) {
      this.products[i].total = this.products[i].amount * this.products[i].price

    }

  }

  TotalPtice() {
    let sum = 0
    for (let i = 0; i < this.products.length; i++) {
      sum = (this.products[i].price * this.products[i].amount) + sum
    }
    this.total = sum
  }

  addAmount(product: number) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id == product) {
        this.products[i].amount += 1
      }
    }
    this.TotalPtice()
  }

  removeAmount(product: number) {
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id == product && this.products[i].amount > 1) {
        this.products[i].amount -= 1
      }
    }
    this.TotalPtice()
  }

  colum: string[] = ['TITLE', 'IMAGE', 'PRICE', 'AMOUNT', 'TOTAL']

}
