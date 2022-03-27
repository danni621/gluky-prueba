import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Firestore, doc, query, where, collection, getDocs, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';



@Injectable({
    providedIn: 'root'
})
export class Service {

    userToken: any = "";

    data: any[] = [];

    constructor(private http: HttpClient,
        private router: Router,
        private firestore: Firestore) {
        this.leerToken();
    }


    loginSigner(usuario: UsuarioModel) {
        const authData = {
            email: usuario.email,
            password: usuario.password,
            returnSecureToken: true
        }

        return this.http.post(`${environment.url}signInWithPassword?key=${environment.apiKey}`, authData).pipe(
            map((resp: any) => {
                this.guardarToken(resp['idToken']);
                return resp;
            })
        );
    }

    DataUsuarios() {
        this.data = [];
        return new Promise<any>((resolve, reject) => {
            const querySnapshot = getDocs(collection(this.firestore, "usuarios")).then(resp => {
                resp.forEach((doc) => {
                    this.data.push(doc.data());
                });

                resolve(this.data);
            })
        });
    }

    DataUsuario(email: string) {
        this.data = [];
        return new Promise<any>((resolve, reject) => {
            const q = query(collection(this.firestore, "usuarios"), where("email", "==", email));
            const querySnapshot = getDocs(q).then(resp => {
                resp.forEach((doc) => {
                    this.data.push(doc.data());
                    this.data.push(doc.id);
                });

                resolve(this.data);
            })
        });
    }

    async RegisterUsuario(usuario: UsuarioModel) {

        const docRef = await addDoc(collection(this.firestore, "usuarios"), {
            apellidos: usuario.apellidos,
            celular: usuario.celular,
            email: usuario.email,
            identi: usuario.identi,
            nombre: usuario.nombre,
            password: usuario.password,
            rol: usuario.rol,
        });
    }

    async ActualizarUsuario(usuario: UsuarioModel, id: string) {

        const dataupdate = doc(this.firestore, "usuarios", id);

        await updateDoc(dataupdate, {
            apellidos: usuario.apellidos,
            email: usuario.email,
            celular: usuario.celular,
            identi: usuario.identi,
            nombre: usuario.nombre,
            password: usuario.password,
            rol: usuario.rol,
        });

    }

    async DeleteUser(id: string) {

        const dataupdate = doc(this.firestore, "usuarios", id);

        await deleteDoc(dataupdate);

    }


    nuevoUsuarioLogin(usuario: UsuarioModel) {
        const authData = {
            email: usuario.email,
            password: usuario.password,
            returnSecureToken: true
        }

        return this.http.post(`${environment.url}signUp?key=${environment.apiKey}`, authData).pipe(
            map(resp => {
                return resp;
            })
        );
    }

    userTokenPass(usuario:UsuarioModel, oldpass:string){
        const authData = {
          email: usuario.email,
          password: oldpass,
          returnSecureToken: true
        }
        return this.http.post(`${environment.url}signInWithPassword?key=${environment.apiKey}`,authData).pipe(
          map((resp: any)=>{
            return resp['idToken'];
          })
        );
      }

    private guardarToken(idToken: string) {
        this.userToken = idToken;
        localStorage.setItem('token', idToken);

        let hoy = new Date();
        hoy.setSeconds(600);
        localStorage.setItem("expira", hoy.getTime().toString());
    }


  UpdatePassFire(idtoken:string,pass:string){

    const authData = {
      idToken: idtoken,
      password: pass,
      returnSecureToken: true
    }
    return this.http.post(`${environment.url}update?key=${environment.apiKey}`,authData).pipe(
      map( resp =>{
        return resp;
      })
    );
  }

  DeleteUserAuth(idtoken:string){

    const authData = {
      idToken: idtoken,
    }
    return this.http.post(`${environment.url}delete?key=${environment.apiKey}`,authData).pipe(
      map( resp =>{
        return resp;
      })
    );
  }


    leerToken() {
        if (localStorage.getItem('token')) {
            this.userToken = localStorage.getItem('token');
        } else {
            this.userToken = '';
        }

        return this.userToken;
    }

    estaAutenticado(): boolean {

        if (this.userToken.length < 2) {
            return false;
        }
        const expira = Number(localStorage.getItem('expira'));
        const expiraDate = new Date();
        expiraDate.setTime(expira);

        if (expiraDate > new Date()) {
            return true;
        } else {
            return false;
        }
    }

}