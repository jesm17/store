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
  hidden: boolean = true // hide items if there are no products in the cart
  products: any = [] // list of products
  selectID: any = [] // products selected
  total = 0 // counter for total
  resizeCart: any = [] // update the elements of the product list
  saveAmout: any = [] // stores the quantity of a product
  selectAmout: any = [] // get the quantity of a product
  getProducts() {
    try {
      this.selectID = JSON.parse(this.cookieService.get('product')) // get the id of the product
      this.selectID = this.selectID.sort() // order the ids
      this.selectAmout = JSON.parse(this.cookieService.get('cart')) // get the quantity of the product
      if (this.selectID == "") {
        this.hidden = true // enable element visibility
      } else {
        this.hidden = false
        for (let i = 0; i < this.selectID.length; i++) {
          this.productService.getproduct(this.selectID[i]).subscribe( // get product selected
            (res: any) => {
              this.products.push(res) // add product to list of selected products
              for (let j = 0; j < this.products.length; j++) {
                for (let x = 0; x < this.selectAmout.length; x++) {
                  if (this.products[j].id == this.selectAmout[x].id) { // compare the ids
                    this.products[j].amount = this.selectAmout[x].amount // update product quantity
                  }
                }
              }
              this.products = this.products.sort()
              this.TotalPtice() // get total price
            }
          )
        }
      }
    } catch (error) {
      this.hidden = true; // enable element visibility
    }
  }

  TotalPtice() { // get total price
    let sum = 0
    for (let i = 0; i < this.products.length; i++) {
      sum = (this.products[i].price * this.products[i].amount) + sum // get the total price of the products
    }
    this.total = sum
  }

  addAmount(product: number) { // add a amount
    this.saveAmout.splice(0, this.saveAmout.length) // reset the amount
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id == product) { // add 1 to the selected product
        this.products[i].amount += 1
      }
      this.saveAmout.push({ id: this.products[i].id, amount: this.products[i].amount }); // update the amount of products
    }
    this.cookieService.set('cart', JSON.stringify(this.saveAmout)) // set the quantity for the products

    this.TotalPtice() // get total price
  }

  removeAmount(product: number) { // remove the amount
    this.saveAmout.splice(0, this.saveAmout.length) // reset the amount
    for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id == product && this.products[i].amount > 1) { // remove 1 to the selected product
        this.products[i].amount -= 1
      }
      this.saveAmout.push({ id: this.products[i].id, amount: this.products[i].amount }); // update the amount of products
    }
    this.cookieService.set('cart', JSON.stringify(this.saveAmout))
    this.TotalPtice() // get the total price
  }

  removeItem(id: number) {
    this.resizeCart.splice(0, this.resizeCart.length) // reset the amount of cart items
    this.products = this.products.filter((i: any) => i.id != id) // obtains the products that are different from the selected
    for (let i = 0; i < this.products.length; i++) {
      this.resizeCart.push(this.products[i].id) // update the product list
    }
    if (this.products == "") {
      this.hidden = true // enable visibility of elements
    }
    this.cookieService.set('product', JSON.stringify(this.resizeCart)) // set the new product list
    this.saveAmout = this.saveAmout.filter((i: any) => i.id != id) // obtains the products that are different from the selected
    this.cookieService.set('cart', JSON.stringify(this.saveAmout)) // sets the new amount of products
    this.TotalPtice() // get total price
  }

  clearCart() { // clear all cart data
    if (confirm('Are you sure?')) { // comfirm to clear all cart data
      if (this.products == "") {
        alert('nothing to clear') // if there is nothing in the cart
      } else {
        alert('the cart has been cleared') // alert the user to clear the cart
        this.products.splice(0, this.products.length) // reset the products
        this.cookieService.delete('product') // delete the cookie of products
        this.cookieService.delete('cart') // delete the cookie of cart
        this.hidden = true // enable visibility of elements
        this.TotalPtice() // get total price
      }
    }
  }
}
