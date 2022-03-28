import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../models/usuario.model';
import { Service } from 'src/app/services/service';
import { Functions } from '../../functions/functions';
import Swal from 'sweetalert2';

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

  Registrar(form: NgForm) {

    if (form.invalid) { return; }

    this.functions.PopUpAlert('', 'info', 'Espere por favor', false, true);
    this.service.nuevoUsuarioLogin(this.usuario).subscribe(resp => {
      this.usuario.password = this.functions.functionEncryDesc('encriptar', this.usuario.password);
      this.functions.PopUpAlertClose();
      Swal.fire({
        allowOutsideClick: false,
        title: "",
        text: `Usuario Creado con exito`,
        icon: 'success',
        showConfirmButton: true,
        showCancelButton: true
      }).then(resp => {
        if (resp.value) {
          this.service.RegisterUsuario(this.usuario);
          this.router.navigateByUrl('/users');
        }
      });
    }, (err) => {
      this.functions.PopUpAlert('Error al crear', 'error', err.error.error.message, true, false);
    });
  }
}
