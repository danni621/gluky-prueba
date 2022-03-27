import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../models/usuario.model';
import { Functions } from '../../functions/functions';
import { Service } from 'src/app/services/service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario = new UsuarioModel();

  constructor(
    private service: Service,
    private router: Router,
    private functions: Functions) { }

  ngOnInit() {
    localStorage.clear();
  }


  login(form: NgForm) {

    if (form.invalid) { return; }

    this.functions.PopUpAlert('', 'info', 'Espere por favor', false, true);
    this.service.loginSigner(this.usuario).subscribe(resp => {
      this.service.DataUsuario(this.usuario.email).then(data => {
        localStorage.setItem('rol', data[0].rol);
        localStorage.setItem('emaillog', this.usuario.email);
        this.functions.PopUpAlertClose();
        this.router.navigateByUrl('/users');
      });
    }, (err) => {
      this.functions.PopUpAlert('Error al autenticar', 'error', err.error.error.message, true, false);
    });
  }

}
