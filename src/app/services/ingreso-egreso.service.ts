import { Injectable, inject } from '@angular/core';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { Firestore, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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

  initIngresosEgresosListener(uid:string){
    const collectionRef = collection(this.firestore, `${uid}/ingresos-egresos/items`);
    return new Observable<any[]>((observer) => {
      const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
        const modifiedArray = querySnapshot.docChanges().map(({ doc }) => {
          return {
            uid: doc.id,
            ...doc.data()
          };
        });
        observer.next(modifiedArray);
      }, (error) => {
        observer.error(error);
      });
      return () => unsubscribe();
    });
  }
}
