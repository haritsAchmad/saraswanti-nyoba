import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
    selector: 'app-home',
    standalone:true,
    imports: [],
    template: `
        <h1>Hello, @if(user!=null){ {{user.name}} }</h1>
            <p>It's Running!</p>

            @if(errMessage!=null){<span style="color:red;">{{errMessage}}</span>}
    `,
    styles: ''
})
export class HomeComponent implements OnInit{
    errMessage!: string | null
    user!: any|null

    constructor(
        private svc:AuthService,
        private router:Router
      ) {

      }

    ngOnInit():void{
    this.svc.getUser()
    .subscribe({
      next: res => this.user = res,
      error: err => this.errMessage = err.error.message
    })
  }
}