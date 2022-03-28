import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from 'src/app/services/service';
import { UsuarioModel } from '../../models/usuario.model';
import { Functions } from '../../functions/functions';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {


  usuariosinfo: any[] = [];
  rol: string = "";

  usuarioelm = new UsuarioModel();
  id: string = "";

  constructor(private service: Service,
    private router: Router,
    private functions: Functions) { }

  ngOnInit() {
    this.rol = localStorage.getItem('rol') || '';
    localStorage.removeItem('email');
    this.usuariosinfo = [];
    this.functions.PopUpAlert('', 'info', 'Espere por favor', false, true);
    this.service.DataUsuarios().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.usuariosinfo = data;
      this.functions.PopUpAlertClose();
    })
  }


  CrearUsuario() {
    localStorage.removeItem('email');
    this.router.navigateByUrl('/register');
  }

  ActualizarRegis(email: string) {
    localStorage.setItem("email", email);
    this.router.navigateByUrl('/modrgtr');
  }

  EliminarRegistro(email: string) {

    for (var i = 0; i < this.usuariosinfo.length; i++) {
      if (this.usuariosinfo[i].email == email) {
        this.usuarioelm = this.usuariosinfo[i];
        this.id = this.usuariosinfo[i]['id'];
        break;
      }
    }
    this.functions.PopUpAlert('', 'info', 'Espere por favor', false, true);
    this.usuarioelm.password = this.functions.functionEncryDesc('desencriptar', this.usuarioelm.password);
    this.service.userTokenPass(this.usuarioelm, this.usuarioelm.password).subscribe(tokenpas => {
      this.functions.PopUpAlertClose();
      Swal.fire({
        title: "¿Estas seguro?",
        text: `Está seguro que desea eliminar el usuario ${this.usuarioelm.email}`,
        icon: 'question',
        showConfirmButton: true,
      }).then(resp => {
        if (resp.value) {
          this.service.DeleteUserAuth(tokenpas).subscribe(resp => {
            this.service.DeleteUser(this.id);
            if (localStorage.getItem('emaillog') == this.usuarioelm.email) {
              this.router.navigateByUrl('/login');
            } else {
              this.ngOnInit();
            }
          }, (error) => {
            this.functions.PopUpAlert('Error al eliminar', 'error', error.error.error.message, true, false);
          });
        }
      });
    }, (error) => {
      this.functions.PopUpAlert('Error de autenticacion', 'error', error.error.error.message, true, false);
    });
  }

}
