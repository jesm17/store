import { OnInit } from '@angular/core';

import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  itemDetails:any= {} // array of preview item select
  readonly showScroll$: Observable<boolean> = fromEvent(
    this.document,
    'scroll'
  ).pipe(
    untilDestroyed(this),
    map(() => this.viewport.getScrollPosition()?.[1] > 0)
  );
  constructor(private categoriesServices: CategoriesService,
    private productsService: ProductsService, @Inject(DOCUMENT)
    private readonly document: Document,
    private readonly viewport: ViewportScroller,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.getCategories()
    this.getProducts()
  }

  getCategories() {
    this.categoriesServices.getCategories().subscribe(
      res => {
        this.categories = res
      }, err => {
        console.log(err);
      }
    )
  }

  getProducts() {
    this.counter()
    //this.productsCookie = this.cookieService.get('product')
    // if (this.productsCookie!='') {

    //   this.productsCookie= JSON.parse(this.productsCookie)
    //   console.log(this.productsCookie);
    //   this.addProduct(this.productsCookie)
    // }

    this.productsService.getproducts().subscribe(
      res => {
        this.products = res
        for (let i = 0; i < this.products.length; i++) {
          this.products[i].disable = true
        }
      }, err => {
        console.log(err);
      }
    )
  }

  addProduct(product: any) {
    // console.log(product);
    this.listProducts.push(product)
    const id = product.id
    for (let i = 0; i < this.listProducts.length; i++) {
      this.listProducts[i].amount = 1
      this.listProducts[i].total = this.listProducts[i].amount * this.listProducts[i].price
    }
    for (let j = 0; j < this.products.length; j++) {
      if (this.products[j].id == id) {
        this.products[j].disable = false
      }
    }
    this.cookieService.set('product', JSON.stringify(this.listProducts))
    this.counter()
  }

  counter() {
      this.totalItems = this.listProducts.length
  }

  getCategory(category: string) {
    this.categoriesServices.getCategory(category).subscribe(
      res => {
        console.log(res);
        this.products = res
        for (let i = 0; i < this.products.length; i++) {
          this.products[i].disable = true
        }
      }
    )
  }


  onScrollToTop(): void {
    this.viewport.scrollToPosition([0, 0]);
  }

  viewPreview(item:any){
    // console.log(item);
    this.itemDetails=item;


  }

}
