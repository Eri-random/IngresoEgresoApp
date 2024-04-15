import { Injectable, inject } from '@angular/core';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { signOut } from 'firebase/auth';
import { Subscription, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Firestore, collection, collectionData, addDoc, CollectionReference, DocumentReference, doc, setDoc} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  usersCollection!: CollectionReference;

  
  constructor(
  ) {
   }

  initAuthListener(){
    authState(this.auth).subscribe(fuser =>{
      console.log(fuser)
      console.log(fuser?.uid)
      console.log(fuser?.email)
    })
  }

  crearUsuario(nombre:string,email:string,password:string){
    return createUserWithEmailAndPassword(this.auth,email,password)
      .then(({user}) =>{

        const newUser = new Usuario(user.uid,nombre,email);

        const collectionIngresoEgreso = collection(this.firestore, `${user.uid}/usuario`);
 
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
