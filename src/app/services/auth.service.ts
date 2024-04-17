import { Injectable, inject } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { signOut } from 'firebase/auth';
import { Observable, Subscription, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Firestore, collection, collectionData, addDoc, CollectionReference, DocumentReference, setDoc} from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authAction from '../auth/auth.actions';
import { doc, getDoc, getDocs, onSnapshot } from "firebase/firestore";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.action';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: AngularFireAuth = inject(AngularFireAuth,);
  private firestore: AngularFirestore = inject(AngularFirestore);
  userSubscription: Subscription;
  private _user: Usuario;

  get user() {
    return this._user;
  }
  
  constructor(
    private store: Store<AppState>
  ) {
   }

  initAuthListener(){
    this.auth.authState.subscribe( fuser => {
      if ( fuser ) {
        // existe
        this.userSubscription = this.firestore.doc(`${ fuser.uid }/usuario`).valueChanges()
          .subscribe( (firestoreUser: any) => {
          

            const user = Usuario.fromFirebase( firestoreUser );
            this._user = user;
            this.store.dispatch(authAction.setUser({ user }) );
            
          })

      } else {
        // no existe
        this._user = null;
        this.userSubscription.unsubscribe();
        this.store.dispatch( authAction.unSetUser() );
        this.store.dispatch( ingresoEgresoActions.unSetItems() );
      }

    });
  }

  crearUsuario(nombre:string,email:string,password:string){
     // console.log({ nombre, email, password });
     return this.auth.createUserWithEmailAndPassword( email, password )
     .then( ({ user }) => {

       const newUser = new Usuario( user.uid, nombre, user.email );

       return this.firestore.doc(`${ user.uid }/usuario`).set({ ...newUser });

     });

  }

  loginUsuario(email:string,password:string){
    return this.auth.signInWithEmailAndPassword( email, password );  
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
  return this.auth.authState.pipe(
      map( fbUser => fbUser != null )
    );
  }


}
