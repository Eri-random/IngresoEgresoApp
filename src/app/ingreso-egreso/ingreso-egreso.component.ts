import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import * as ui from '../shared/ui.actions';
@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.css']
})
export class IngresoEgresoComponent implements OnInit,OnDestroy {

  ingresoForm:FormGroup;
  uiSubscription:Subscription;
  isLoading:boolean=false;
  tipo:string = 'ingreso'

  constructor(private fb: FormBuilder,
    private ingresoEgresoService: IngresoEgresoService,
    private store:Store<AppState>
  ){

  }
  ngOnInit(): void {
    this.ingresoForm = this.fb.group({
      descripcion: ['',Validators.required],
      monto: ['',Validators.required]
    })

    this.uiSubscription = this.store.select('ui')
    .subscribe(ui =>{
      this.isLoading = ui.isLoading;
    });

}

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  guardar(){

    if(this.ingresoForm.invalid) return;

    this.store.dispatch(ui.isLoading())

    console.log(this.ingresoForm.value)
    console.log(this.tipo);

    const {descripcion,monto} = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso(descripcion,monto,this.tipo);

    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
    .then(() =>{
      this.ingresoForm.reset();
      this.store.dispatch(ui.stopLoading())
      Swal.fire('Registro creado', descripcion, 'success');
    }).catch(err =>{
      this.store.dispatch(ui.stopLoading())
      Swal.fire('Error', err.message, 'error');
    })
  }
}
