import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppUser } from './AppUser';
import { InspectAdminService } from '../../inspect-admin/inspect-admin.service';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.custom';
import { MatDialog } from '@angular/material/dialog';
import { NotificationDetailComponent } from './notification-detail.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterModule], // Asegúrate de incluir CommonModule
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  actualUser: AppUser = {} as AppUser;
  private readonly apiUrl = environment.apiUrl + '/api/users';

  // Propiedades para notificaciones
  notificationCount: number = 3; // Inicialmente 3 notificaciones
  notifications: string[] = [
    "Reunión programada para mañana",
    "Cambio en la hora de una reunión",
    "Nueva reunión pendiente"
  ];
  showNotifications: boolean = false;

  constructor(
    private readonly client: HttpClient,
    private readonly router: Router,
    private readonly inspectServices: InspectAdminService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log('SidebarComponent inicializado');
    if (typeof window !== "undefined") {
      const user = window.localStorage.getItem("user") as string;
      if (user) {
        this.getUser(user).subscribe(
          (resultado: any) => {
            this.actualUser.id = resultado.id;
            this.actualUser.name = resultado.name;
            this.actualUser.surnames = resultado.surname;
            this.actualUser.photo = resultado.photo;
            this.actualUser.dtype = resultado.type;

            if (this.actualUser.photo === null) {
              this.actualUser.photo = "../../../assets/register/userDefault.png";
            } else {
              this.actualUser.photo = 'data:image/png;base64,' + this.actualUser.photo;
            }
          },
          (error: any) => {
            console.error('Error fetching user:', error);
          }
        );
      }
    }
  }

  // Método para obtener el usuario
  getUser(jwt: string): Observable<any> {
    return this.client.get(this.apiUrl + "/validateJWT");
  }

  // Método para cerrar sesión
  logOut(): void {
    this.router.navigate(["/home"]);
  }

  // Método para alternar las notificaciones
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  // Método para actualizar dinámicamente las notificaciones
  addNotification(notification: string): void {
    this.notifications.push(notification);
    this.notificationCount = this.notifications.length; // Actualiza el conteo dinámico
  }

  removeNotification(index: number, event: Event): void {
    event.stopPropagation(); 
    this.notifications.splice(index, 1); // Elimina la notificación del array
    this.notificationCount = this.notifications.length; // Actualiza el contador
    console.log(`Notificación en el índice ${index} eliminada.`);
  }  

  openNotificationDetail(notification: string): void {
    this.dialog.open(NotificationDetailComponent, {
      data: { notification }, // Pasar la notificación al pop-up
      width: '400px'
    });
  }
}
