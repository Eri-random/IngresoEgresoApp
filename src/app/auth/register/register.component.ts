import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';
import * as action from 'src/app/shared/ui.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy{

  registroForm!:FormGroup;
  uiSubscription: Subscription;
  cargando:boolean = false;


  constructor(private fb:FormBuilder,
    private authService:AuthService,
    private router:Router,
    private store:Store<AppState>){}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre:['',Validators.required],
      correo:['',[Validators.required,Validators.email]],
      password:['',Validators.required]
    });

    this.uiSubscription = this.store.select('ui')
                          .subscribe(ui => {
                            this.cargando = ui.isLoading;
                          })
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(){
    if(this.registroForm.invalid) return;

    // Swal.fire({
    //   title: "Espere por favor!",
    //   didOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

    const {nombre,correo,password} = this.registroForm.value;
    this.authService.crearUsuario(nombre,correo,password)
    .then(credenciales =>{
      // console.log(credenciales);
      // Swal.close();
      this.store.dispatch(action.stopLoading())
      this.router.navigate(['/']);
    })
    .catch(err => {
      this.store.dispatch(action.stopLoading())
      console.log(err);
          Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.message,
        });
    })
  }

}
