import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UsersComponent } from './pages/users/users.component';
import { RegisterComponent } from './pages/register/register.component';
import { ModrgtrComponent } from './pages/modrgtr/modrgtr.component';

import { Guard } from './guards/guards';

const routes: Routes = [
  { path: 'login'   , component: LoginComponent },
  { path: 'users'    , component: UsersComponent, canActivate: [Guard]  },
  { path: 'register'    , component: RegisterComponent, canActivate: [Guard]  },
  { path: 'modrgtr'    , component: ModrgtrComponent, canActivate: [Guard]  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
