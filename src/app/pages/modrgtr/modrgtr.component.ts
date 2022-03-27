import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Service } from 'src/app/services/service';
import { UsuarioModel } from '../../models/usuario.model';
import { Functions } from '../../functions/functions';

@Component({
  selector: 'app-modrgtr',
  templateUrl: './modrgtr.component.html',
  styleUrls: ['./modrgtr.component.css']
})
export class ModrgtrComponent implements OnInit {

  usuario= new UsuarioModel();
  id: string = "";
  oldpass: string =  "";

  constructor(private service: Service,
    private router: Router,
    private functions: Functions) { }

  ngOnInit(){
    this.service.DataUsuario(localStorage.getItem('email')|| '').then(data =>{
      this.usuario = data[0];
      this.id = data[1];
      localStorage.setItem('oldpass',this.usuario.password);
      this.usuario.password = this.functions.functionEncryDesc('desencriptar',this.usuario.password);
    });
  }

  Actualizar(form:NgForm){

    if(form.invalid) { return;}

    this.functions.PopUpAlert('','info','Espere por favor', false, true);
    this.oldpass = localStorage.getItem('oldpass') || '';
    this.oldpass = this.functions.functionEncryDesc('desencriptar',this.oldpass);
    this.service.userTokenPass(this.usuario,this.oldpass).subscribe( tokenpas =>{
      this.service.UpdatePassFire(tokenpas,this.usuario.password).subscribe( resp =>{
        this.usuario.password = this.functions.functionEncryDesc('encriptar',this.usuario.password);
        this.service.ActualizarUsuario(this.usuario, this.id);
        this.functions.PopUpAlertClose();
        this.functions.PopUpAlertConfirm('','info','Usuario Actualizado', true, true,false, '/users');
      },(error) =>{
        this.functions.PopUpAlert('Error al Actualizar','error',error.error.error.message, true, false);
      });
   },(error) =>{
      this.functions.PopUpAlert('Error de autenticacion','error',error.error.error.message, true, false);
  });
  }

}
