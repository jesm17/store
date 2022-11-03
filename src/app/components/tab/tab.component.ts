
import { Component, OnInit } from '@angular/core';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})
export class TabComponent implements OnInit {
  URL = environment.API_URL
  categories:any=[]
  constructor(private categoriesServices: CategoriesService) { }

  ngOnInit(): void {
    this.getCategories()
  }

  getCategories() {
    this.categoriesServices.getCategories().subscribe(
      res => {
        this.categories=res

      }, err => {
        console.log(err);

      }
    )
  }

}
