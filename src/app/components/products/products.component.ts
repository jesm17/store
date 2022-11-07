import { OnInit } from '@angular/core';

import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
@UntilDestroy()
export class ProductsComponent implements OnInit {

  categories: any = [] // array of categories
  products: any = [] // array of products of de service
  productsCookie: any = [] // array of productsCookie
  listProducts: any = [] // array of products for the cart
  totalItems: number = 0 // count of products for the baged
  itemDetails: any = {} // array of preview item select
  cookieLength: any = []
  selectAmout: any = []
  readonly showScroll$: Observable<boolean> = fromEvent(
    this.document,
    'scroll'
  ).pipe(
    untilDestroyed(this),
    map(() => this.viewport.getScrollPosition()?.[1] > 0)
  ); // Auto scroll to top of page
  constructor(private categoriesServices: CategoriesService,
    private productsService: ProductsService, @Inject(DOCUMENT)
    private readonly document: Document,
    private readonly viewport: ViewportScroller,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.getCategories() // get categories
    this.getProducts() // get products
  }

  getCategories() {
    this.counter()
    this.categoriesServices.getCategories().subscribe(
      res => {
        this.categories = res // categories
      }, err => {
        console.log(err);
      }
    )
  }

  getProducts() {
    this.productsService.getproducts().subscribe(
      res => {
        this.products = res // products
        try {
          this.productsCookie = JSON.parse(this.cookieService.get('product'));
          if (this.productsCookie == "") {
            for (let i = 0; i < this.products.length; i++) {
              this.products[i].disable = true // add to the products the attribute disable the add button if does not exist in the local store
            }
          } else {
            for (let i = 0; i < this.products.length; i++) {
              for (let j = 0; j < this.productsCookie.length; j++) {
                if (this.products[i].id === this.productsCookie[j]) {
                  this.products[i].disable = false // add to the products the attribute disable the add button
                } else {
                  if (this.products[i].disable === false) {
                    this.products[i].disable = false // add to the products the attribute disable the add button
                  } else {
                    this.products[i].disable = true // add to the products the attribute disable the add button
                  }
                }
              }
            }
          }

        } catch (error) {
          for (let i = 0; i < this.products.length; i++) {
            this.products[i].disable = true // add to the products the attribute disable the add button if does not exist in the local store
          }
        }
      }, err => {
        console.log(err);
      }
    )
  }

  addProduct(product: any) {
    this.selectAmout.splice(0, this.selectAmout.length)
    try {
      this.listProducts = this.productsCookie
    } catch (error) {
    }
    this.listProducts.push(product)
    const id = product
    for (let j = 0; j < this.products.length; j++) {
      if (this.products[j].id == id) {
        this.products[j].disable = false
      }
    }
    this.cookieService.set('product', JSON.stringify(this.listProducts), { sameSite: 'Strict', secure: false, expires: 0.5 }) // create a new cookie with the list of products for the cart
    for (let x = 0; x < this.listProducts.length; x++) {
      this.selectAmout.push({id:this.listProducts[x], amount:1})
    }
    this.cookieService.set('cart', JSON.stringify(this.selectAmout  ), { sameSite: 'Strict', secure: false, expires: 0.5 })
    console.log(this.selectAmout);

    this.counter() // update the counter
  }

  counter() {
    try {
      this.cookieLength = JSON.parse(this.cookieService.get('product'))
      this.totalItems = this.cookieLength.length // count the total items for the cart in the cookie
    } catch (err) {
      this.totalItems = this.listProducts.length // count the total items for the cart
    }
  }

  getCategory(category: string) {
    this.categoriesServices.getCategory(category).subscribe(
      res => {
        this.products = res // get the products of the category selected
        for (let i = 0; i < this.products.length; i++) {
          this.products[i].disable = true
        }
      }
    )
  }

  onScrollToTop(): void {
    this.viewport.scrollToPosition([0, 0]); // scroll to top
  }

  viewPreview(item: any) {
    this.itemDetails = item; // get the details of the item selected
  }

  clearCart() {
    console.log(this.listProducts);


      if (confirm('Are you sure?')) {

        alert('the cart has been cleared')
        this.listProducts.splice(0, this.listProducts.length)
        this.cookieService.delete('product')
        this.cookieService.delete('cart')
        this.counter()
        for (let j = 0; j < this.products.length; j++) {
          this.products[j].disable = true
        }
      }
    
  }

}
