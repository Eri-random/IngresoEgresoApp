import { Injectable, OnDestroy, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { signOut } from 'firebase/auth';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);
  
  constructor() { }

  crearUsuario(nombre:string,email:string,password:string){
    return createUserWithEmailAndPassword(this.auth,email,password);
  }

  loginUsuario(email:string,password:string){
    return signInWithEmailAndPassword(this.auth,email,password)
  }

  logout(){
    return signOut(this.auth);
  }


}
