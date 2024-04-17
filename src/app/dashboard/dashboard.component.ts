import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { Subscription, filter } from 'rxjs';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

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
      .subscribe(async ({user}) =>{
        try {
          const resultado = await this.ingresoEgresoService.initIngresosEgresosListener(user.uid);
          console.log(resultado);
        } catch (error) {
          console.error("Error al obtener ingresos y egresos:", error);
        }
      });
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }


}
