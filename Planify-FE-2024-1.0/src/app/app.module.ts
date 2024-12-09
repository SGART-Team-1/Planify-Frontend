import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './password-recovery/change-password/change-password.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { WorkScheduleComponent } from './work-schedule/work-schedule.component';
import { UsersViewerComponent } from './users-viewer/users-viewer.component';
import { AddAbsenceComponent } from './absences/add-absence/add-absence.component';
import { MeetingCalendarComponent } from './meeting-calendar/meeting-calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';

// Importaciones necesarias para el diálogo
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PasswordRecoveryComponent,
    LoginComponent,
    ChangePasswordComponent,
    UserManagementComponent,
    WorkScheduleComponent,
    UsersViewerComponent,
    AddAbsenceComponent,
    MeetingCalendarComponent,
    FullCalendarModule,
    MatDialogModule, // Módulo para el diálogo de Angular Material
    BrowserAnimationsModule // Necesario para las animaciones del diálogo
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Planify-FE-2024';
}
