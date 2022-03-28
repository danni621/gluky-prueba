import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Service } from '../services/service';

@Injectable({
  providedIn: 'root'
})
export class Guard implements CanActivate {

  constructor(private service: Service,
    private router: Router){} 
  
  canActivate(): boolean {
    if(this.service.estaAutenticado()){
        return true;
    }else{
        this.router.navigateByUrl('/login');
        return false;
    }
  }
  
}
