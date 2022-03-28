import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
//import { Firestore, doc, query, where, collection, getDocs, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';

import {
    AngularFireDatabase,
    AngularFireList,
    AngularFireObject,
} from '@angular/fire/compat/database';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';




@Injectable({
    providedIn: 'root'
})
export class Service {

    userToken: any = "";

    data: AngularFirestoreCollection<UsuarioModel>;

    constructor(private http: HttpClient,
        private router: Router,
        private firestore: AngularFirestore) {
        this.data = firestore.collection('/usuarios');
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

    DataUsuarios(): AngularFirestoreCollection<UsuarioModel> {
        return this.data;
    }

    RegisterUsuario(usuario: any) {
        this.data.add({
            apellidos: usuario.apellidos,
            celular: usuario.celular,
            email: usuario.email,
            identi: usuario.identi,
            nombre: usuario.nombre,
            password: usuario.password,
            rol: usuario.rol,
        });
    }

    ActualizarUsuario(usuario: any, id: string) {
        this.data.doc(id).update({
            apellidos: usuario.apellidos,
            email: usuario.email,
            celular: usuario.celular,
            identi: usuario.identi,
            nombre: usuario.nombre,
            password: usuario.password,
            rol: usuario.rol,
        });
    }

    DeleteUser(id: string) {
        this.data.doc(id).delete();
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

    userTokenPass(usuario: UsuarioModel, oldpass: string) {
        const authData = {
            email: usuario.email,
            password: oldpass,
            returnSecureToken: true
        }
        return this.http.post(`${environment.url}signInWithPassword?key=${environment.apiKey}`, authData).pipe(
            map((resp: any) => {
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


    UpdatePassFire(idtoken: string, pass: string) {

        const authData = {
            idToken: idtoken,
            password: pass,
            returnSecureToken: true
        }
        return this.http.post(`${environment.url}update?key=${environment.apiKey}`, authData).pipe(
            map(resp => {
                return resp;
            })
        );
    }

    DeleteUserAuth(idtoken: string) {

        const authData = {
            idToken: idtoken,
        }
        return this.http.post(`${environment.url}delete?key=${environment.apiKey}`, authData).pipe(
            map(resp => {
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