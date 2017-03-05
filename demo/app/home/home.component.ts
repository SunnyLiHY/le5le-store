import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {HomeService} from "./home.service";

@Component({
  selector: 'home',
  templateUrl: "home.component.html",
  providers: [ HomeService]
})
export class HomeComponent implements OnInit{

  constructor(private _homeService: HomeService, private _router: Router) {
  }

  ngOnInit() {
  }

}
