import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription, filter, subscribeOn } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit,OnDestroy{

  user:string;
  userSubs:Subscription;

  constructor(private authService:AuthService,
    private router:Router,
    private store:Store<AppState>){

  }

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
      .pipe(
        filter(({user}) => user != null)
      )
      .subscribe(({user}) =>{
        this.user = user.nombre
      })
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }

  logout(){
    this.authService.logout().then(() =>{
      this.router.navigate(['/login'])
    });
  }

}
