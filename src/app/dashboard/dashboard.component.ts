import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription, filter } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.action';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy{

  userSubs:Subscription;

  constructor(private store:Store<AppState>,
    private ingresoEgresoService:IngresoEgresoService
  ){}

  ngOnInit(): void {
    this.userSubs = this.store.select('user')
      .pipe(
        filter(auth => auth.user != null)
      )
      .subscribe(({user}) =>{
          this.ingresoEgresoService.initIngresosEgresosListener(user.uid).subscribe((items:IngresoEgreso[]) =>{
            this.store.dispatch(ingresoEgresoActions.setItems({items}))
          });
      });
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }


}
