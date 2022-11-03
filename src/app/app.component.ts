import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component,Inject } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoriesService } from './services/categories/categories.service';
import { ProductsService } from './services/products/products.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs/operators';
@UntilDestroy()

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
 

}
