import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../models/usuario.model';
import { Functions } from '../../functions/functions';
import { Service } from 'src/app/services/service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuariosinfo: UsuarioModel[] = [];
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
      this.service.DataUsuarios().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe(data => {
        this.usuariosinfo = data;
        for(var i = 0; i< this.usuariosinfo.length; i++){
            if(this.usuariosinfo[i].email == this.usuario.email){
              localStorage.setItem('rol', this.usuariosinfo[i].rol);
              localStorage.setItem('emaillog', this.usuario.email);
              break;
            }
        }
        this.functions.PopUpAlertClose();
        this.router.navigateByUrl('/users');
      })
    }, (err) => {
      this.functions.PopUpAlert('Error al autenticar', 'error', err.error.error.message, true, false);
    });
  }

}
