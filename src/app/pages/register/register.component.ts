import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../models/usuario.model';
import { Service } from 'src/app/services/service';
import { Functions } from '../../functions/functions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  usuario = new UsuarioModel();

  constructor(private service: Service,
  private functions: Functions,
  private router: Router) { }

  ngOnInit() {
    this.usuario = new UsuarioModel();
  }

  Registrar(form:NgForm){

    if(form.invalid) { return;}


    this.functions.PopUpAlert('','info','Espere por favor', false, true);
    this.service.nuevoUsuarioLogin(this.usuario).subscribe( resp =>{
      this.usuario.password = this.functions.functionEncryDesc('encriptar',this.usuario.password);
      this.service.RegisterUsuario(this.usuario);
      this.functions.PopUpAlertClose();
      this.functions.PopUpAlertConfirm('','success','Usuario Creado con exito', true, true,false, '/users');
    }, (err) =>{
      this.functions.PopUpAlert('Error al crear','error',err.error.error.message, true, false);
    });


  }

}
