import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Service } from 'src/app/services/service';
import { UsuarioModel } from '../../models/usuario.model';
import { Functions } from '../../functions/functions';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modrgtr',
  templateUrl: './modrgtr.component.html',
  styleUrls: ['./modrgtr.component.css']
})
export class ModrgtrComponent implements OnInit {

  usuariosinfo: any[] = [];
  usuario = new UsuarioModel();
  id: string = "";
  oldpass: string = "";

  constructor(private service: Service,
    private router: Router,
    private functions: Functions) { }

  ngOnInit() {
    this.service.DataUsuarios().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.usuariosinfo = data;
      for (var i = 0; i < this.usuariosinfo.length; i++) {
        if (this.usuariosinfo[i].email == localStorage.getItem('email')) {
          this.usuario = this.usuariosinfo[i];
          this.id = this.usuariosinfo[i]['id'];
          localStorage.setItem('oldpass', this.usuario.password);
          break;
        }
      }
      this.usuario.password = this.functions.functionEncryDesc('desencriptar', this.usuario.password);
    })
  }

  Actualizar(form: NgForm) {

    if (form.invalid) { return; }

    this.functions.PopUpAlert('', 'info', 'Espere por favor', false, true);
    this.oldpass = localStorage.getItem('oldpass') || '';
    this.oldpass = this.functions.functionEncryDesc('desencriptar', this.oldpass);
    this.service.userTokenPass(this.usuario, this.oldpass).subscribe(tokenpas => {
      this.service.UpdatePassFire(tokenpas, this.usuario.password).subscribe(resp => {
        this.usuario.password = this.functions.functionEncryDesc('encriptar', this.usuario.password);
        this.functions.PopUpAlertClose();

        Swal.fire({
          allowOutsideClick: false,
          text: `Usuario Actualizado`,
          icon: 'info',
          showConfirmButton: true,
          showCancelButton: false
        }).then(resp => {
          if (resp.value) {
            this.service.ActualizarUsuario(this.usuario, this.id);
            this.router.navigateByUrl('/users');
          }
        });

      }, (error) => {
        this.functions.PopUpAlert('Error al Actualizar', 'error', error.error.error.message, true, false);
      });
    }, (error) => {
      this.functions.PopUpAlert('Error de autenticacion', 'error', error.error.error.message, true, false);
    });
  }

}
