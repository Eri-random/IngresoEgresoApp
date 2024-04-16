import { Injectable, inject } from '@angular/core';
import { collection, doc, setDoc } from 'firebase/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  private firestore: Firestore = inject(Firestore);

  constructor(private authService: AuthService) { }

  crearIngresoEgreso(ingresoEgreso:IngresoEgreso){
    //TODO
    const uid = this.authService.user.uid;

    const collectionIngresoEgreso = collection(this.firestore, `${uid}/ingresos-egresos/items`);
 
    const documentRef = doc(collectionIngresoEgreso);
 
    return setDoc(documentRef, { ...ingresoEgreso })
  }
}
