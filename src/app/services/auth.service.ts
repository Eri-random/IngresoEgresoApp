import { Injectable, OnDestroy, inject } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { signOut } from 'firebase/auth';
import { Subscription, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);
  
  constructor() { }

  initAuthListener(){
    authState(this.auth).subscribe(fuser =>{
      console.log(fuser)
      console.log(fuser?.uid)
      console.log(fuser?.email)
    })
  }

  crearUsuario(nombre:string,email:string,password:string){
    return createUserWithEmailAndPassword(this.auth,email,password);
  }

  loginUsuario(email:string,password:string){
    return signInWithEmailAndPassword(this.auth,email,password)
  }

  logout(){
    return signOut(this.auth);
  }

  isAuth(){
    return authState(this.auth).pipe(
      map(fbUser => fbUser!= null)
    )
  }


}
