import { Injectable, inject } from '@angular/core';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { Firestore, onSnapshot } from '@angular/fire/firestore';

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

  async initIngresosEgresosListener(uid:string){
    return new Promise((resolve, reject) => {
      const collectionRef = collection(this.firestore, `${uid}/ingresos-egresos/items`);
      onSnapshot(collectionRef, (querySnapshot) => {
        const modifiedArray = querySnapshot.docChanges().map(({doc}) => {
          return {
            uid: doc.id,
            ...doc.data()
          };
        });
  
        resolve(modifiedArray); // Resuelve la promesa con el arreglo modificado
      }, (error) => {
        reject(error); // Rechaza la promesa en caso de error
      });
    });
  }
}
