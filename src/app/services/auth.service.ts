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
import { unSetItems } from '../ingreso-egreso/ingreso-egreso.action';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  usersCollection!: CollectionReference;
  private _user: Usuario;

  get user(){
    return this._user;
  }
  
  constructor(
    private store: Store<AppState>
  ) {
   }

  initAuthListener(){
    authState(this.auth).subscribe(async (fuser:any) =>{
      if(fuser){
        try{
          const collectionRef = collection(this.firestore, `${fuser.uid}/usuario/items`);
          const querySnapshot = await getDocs(collectionRef);
          const docSnapshot = querySnapshot.docs[0];
          // Obtener los datos del documento
          const userData:any = docSnapshot.data();
          console.log(userData);
          const user = Usuario.fromFirebase(userData);
          this._user = user;
          this.store.dispatch(authAction.setUser({user}))
        }catch(e){
          console.log(e)
        }
      }else{
        this._user = null;
        this.store.dispatch(unSetItems());
        this.store.dispatch(authAction.unSetUser());
      }
    })
  }

  crearUsuario(nombre:string,email:string,password:string){
    return createUserWithEmailAndPassword(this.auth,email,password)
      .then(({user}) =>{

        const newUser = new Usuario(user.uid,nombre,email);

        const collectionIngresoEgreso = collection(this.firestore, `${user.uid}/usuario/items`);
 
        const documentRef = doc(collectionIngresoEgreso);
     
        return setDoc(documentRef, { ...newUser })

      })
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
