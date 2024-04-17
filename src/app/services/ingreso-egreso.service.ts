import { Injectable, inject } from '@angular/core';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {


  constructor(private authService: AuthService,
    private firestore: AngularFirestore,
  ) { }

  crearIngresoEgreso(ingresoEgreso:IngresoEgreso){
    const uid = this.authService.user.uid;

    delete ingresoEgreso.uid;

    return this.firestore.doc(`${ uid }/ingresos-egresos`)
        .collection('items')
        .add({ ...ingresoEgreso });
  }

  initIngresosEgresosListener(uid:string){
    return this.firestore.collection(`${ uid }/ingresos-egresos/items`)
    .snapshotChanges()
    .pipe(
      map( snapshot => snapshot.map( doc => ({
            uid: doc.payload.doc.id,
            ...doc.payload.doc.data() as any
          })
        )
      )
    );
  }
}
