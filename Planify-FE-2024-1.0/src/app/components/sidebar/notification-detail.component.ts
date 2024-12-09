import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-detail',
  template: `
    <h1>Detalles de Notificación</h1>
    <p>{{ data.notification }}</p>
    <button mat-button (click)="close()">Cerrar</button>
  `,
  styles: [
    `
      h1 {
        font-size: 1.5rem;
        margin-bottom: 10px;
      }
      p {
        font-size: 1rem;
        margin-bottom: 20px;
      }
      button {
        background-color: #219ebc;
        color: white;
        border: nonne;
        border-radius: 3px;
        padding: 10px;
        cursor: pointer;
      }
    `,
  ],
})
export class NotificationDetailComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { notification: string },
    private readonly dialogRef: MatDialogRef<NotificationDetailComponent>
) {}

  close(): void {
    this.dialogRef.close();
  }
}
