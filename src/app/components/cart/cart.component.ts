import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private cookieService: CookieService, private productService: ProductsService) { }

  ngOnInit(): void {
    this.getProducts()
    this.TotalPtice()
  }
  hidden: boolean = true
  products: any = []
  productsCookie: any = []
  selectID: any = []
  total = 0
  resizeCart: any = []
  saveAmout: any = []
  selectAmout: any = []
  getProducts() {
    try {
      this.selectID = JSON.parse(this.cookieService.get('product'))
      this.selectID = this.selectID.sort()

      this.selectAmout = JSON.parse(this.cookieService.get('cart'))
      if (this.selectID == "") {
        this.hidden = true
      } else {
        this.hidden = false
        for (let i = 0; i < this.selectID.length; i++) {
          this.productService.getproduct(this.selectID[i]).subscribe(
            (res: any) => {
              this.products.push(res)
              for (let j = 0; j < this.products.length; j++) {
                for (let x = 0; x < this.selectAmout.length; x++) {
                  if (this.products[j].id == this.selectAmout[x].id) {
                    this.products[j].amount = this.selectAmout[x].amount
                  }
                }
              }
              this.products = this.products.sort()
              this.TotalPtice()
            }
          )
        }

      }
    } catch (error) {
      console.log('no producs found');
      this.hidden = true;
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
    this.saveAmout.splice(0, this.saveAmout.length)

    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id == product) {
        this.products[i].amount += 1
      }
      this.saveAmout.push({ id: this.products[i].id, amount: this.products[i].amount });
    }
    this.cookieService.set('cart', JSON.stringify(this.saveAmout))

    this.TotalPtice()
  }

  removeAmount(product: number) {
    this.saveAmout.splice(0, this.saveAmout.length)
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id == product && this.products[i].amount > 1) {
        this.products[i].amount -= 1
      }
      this.saveAmout.push({ id: this.products[i].id, amount: this.products[i].amount });
    }
    this.cookieService.set('cart', JSON.stringify(this.saveAmout))
    this.TotalPtice()
  }

  removeItem(id: number) {
    this.resizeCart.splice(0, this.resizeCart.length)
    this.products = this.products.filter((i: any) => i.id != id)
    for (let i = 0; i < this.products.length; i++) {
      this.resizeCart.push(this.products[i].id)
    }

    if (this.products == "") {
      this.hidden = true
    }
    this.cookieService.set('product', JSON.stringify(this.resizeCart))
    this.saveAmout = this.saveAmout.filter((i: any) => i.id != id)

    this.cookieService.set('cart', JSON.stringify(this.saveAmout))
    this.TotalPtice()
  }

  clearCart() {
    if (confirm('Are you sure?')) {
      if (this.products == "") {
        alert('nothing to clear')
      } else {
        alert('the cart has been cleared')
        this.products.splice(0, this.products.length)

        this.cookieService.delete('product')
        this.cookieService.delete('cart')
        this.hidden = true
        this.TotalPtice()
      }
    }
  }


}
