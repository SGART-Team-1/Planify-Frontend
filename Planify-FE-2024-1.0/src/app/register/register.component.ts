import { Component, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgClass, CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterService } from './register.service';
import { RegisterParams } from '../../assets/Types/types';
import { DobleFactorVerifyModalComponent } from '../login/doble-factor-verify-modal/doble-factor-verify-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    NgClass,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  encapsulation: ViewEncapsulation.Emulated,
})
export class RegisterComponent {
  email: string = '';
  name: string = '';
  surnames: string = '';
  department: string = '';
  center: string = '';
  profile: string = '';
  discharge_date: string = '';
  pwd1: string = '';
  pwd2: string = '';
  profileImageUrl: string | ArrayBuffer | null =
    '../../assets/register/userDefault.png';
  
  errorEmail: string = 'Este formato de email no es válido.';
  errorName: string = 'Rellene este campo.';
  errorSurnames: string = 'Rellene este campo.';
  errorPwd1: string = 'La contraseña debe contener al menos:\n- 8 caracteres\n- 1 mayúscula\n- 1 minúscula\n- 1 carácter especial\n- 1 número';
  errorPwd2: string = 'No coincide con la contraseña';
  error: string = '';;
  showPassword: boolean = false;

  isInvalidName: boolean = true;
  isInvalidSurnames: boolean = true;
  isInvalidPassword: boolean = true;
  isInvalidPassword2: boolean = true;
  isInvalidCenter: boolean = true;
  isInvalidDate: boolean = true;
  isInvalidEmail: boolean = true;
  isInvalidForm: boolean = true;

  checkingName: boolean = true;
  checkingSurnames: boolean = true;
  checkingCenter: boolean = true;
  checkingDate: boolean = true;
  checkingPassword: boolean = true;
  checkingPassword2: boolean = true;
  checkingEmail: boolean = true;
  constructor(
    private readonly registerService: RegisterService,
    private readonly router: Router,
    private readonly dialog: MatDialog
  ) {}

  register() {
    this.error='';
    this.checkAll();
    if (!this.isInvalidForm) {
      if (typeof this.profileImageUrl === 'string') {
        // Eliminar el prefijo base64 si existe
        const base64Data = this.profileImageUrl.split(',')[1]; // Solo obtiene la parte base64 pura

        const params: RegisterParams = {
          email: this.email,
          name: this.name,
          surnames: this.surnames,
          department: this.department,
          center: this.center,
          profile: this.profile,
          discharge_date: this.discharge_date,
          pwd1: this.pwd1,
          pwd2: this.pwd2,
          profileImageUrl: base64Data,
        };

        this.registerService.register(params).subscribe(
          resultado => {
            if (resultado.qr_code) {
              const dialogRef = this.dialog.open(
                DobleFactorVerifyModalComponent,
                {
                  data: { qr_code: resultado.qr_code },
                }
              );
              dialogRef.afterClosed().subscribe((resultado: any) => { //COmprobar, he metido la pezuña GONZALO
                if (resultado) {
                  this.router.navigate(['/']);
                  window.scrollTo(0, 0);
                }
              });
            }
          },
          (error) => {
            this.error=error.error.message;
          }
        );
      }
      
  }
}

  validateName(): void {
    this.checkingName = true;
    // Si contiene números u otros caracteres, se marca como inválido.
    this.isInvalidName = this.noNumbers(this.name);
    this.checkFormValidity();
  }

  validateSurnames(): void {
    this.checkingSurnames = true;
    // Si contiene números u otros caracteres, se marca como inválido.
    this.isInvalidSurnames = this.noNumbers(this.surnames);
    this.checkFormValidity();
  }

  noNumbers(input: string): boolean {
    let isInvalid = false;
    // Definimos una expresión regular que solo permite letras y espacios.
    const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

    // Si no cumple (es decir, contiene números u otros caracteres), se marca como inválido=true.
    isInvalid = !regex.test(input);
    return isInvalid;
  }

  validateCenter(): void {
    this.checkingCenter = true;
    // Si contiene números u otros caracteres, se marca como inválido.
    this.isInvalidCenter = this.center.trim() === '';
    this.checkFormValidity();
  }

  validateDate(): void {
    this.checkingDate = true;
    // Si contiene números u otros caracteres, se marca como inválido.
    this.isInvalidDate = this.discharge_date.trim() === '';
    this.checkFormValidity();
  }

  validatePassword(): void {
    this.checkingPassword = true;
    this.isInvalidPassword = this.passwordRequirements(this.pwd1);
    this.validatePassword2();
    this.checkFormValidity();
  }

  validatePassword2(): void {
    this.checkingPassword2 = true;
    this.isInvalidPassword2 =
      this.pwd1 !== this.pwd2 || this.passwordRequirements(this.pwd2);
    this.checkFormValidity();
  }

  passwordRequirements(input: string): boolean {
    // - Al menos 8 caracteres
    // - Al menos 1 mayúscula
    // - Al menos 1 minúscula
    // - Al menos 1 número
    // - Al menos 1 carácter especial
    let isInvalid = false;
    const regex =
      /^(?=.*[A-Za-zÁÉÍÓÚáéíóúÑñÄËÏÖÜäëïöüÀÈÌÒÙàèìòùÇç])(?=.*[a-záéíóúäëïöüàèìòùç])(?=.*[A-ZÁÉÍÓÚÄËÏÖÜÀÈÌÒÙÇ])(?=.*\d)(?=.*[!@#$%^&*(),.?":¿'¡+{}|<>_\-\/\\=\[\]`;ºª~€¬¨])[A-Za-zÁÉÍÓÚáéíóúÑñÄËÏÖÜäëïöüÀÈÌÒÙàèìòùÇç\d!@#$%^&*(),.?":¿'¡+{}|<>_\-\/\\=\[\]`;ºª~€¬¨]{8,}$/;
    isInvalid = !regex.test(input);
    return isInvalid;
  }

  // Método para activar el diálogo de selección de archivos
  triggerFileInput(): void {
    const fileInput = document.getElementById('profilePic') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // Método para manejar la selección del archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files?.[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Verifica si el resultado es definido antes de asignarlo
        if (e.target?.result) {
          this.profileImageUrl = e.target.result;
        } else {
          this.profileImageUrl = null; // O cualquier otro manejo que desees
        }
      };

      reader.readAsDataURL(file);
    }
  }

  validateEmail(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.checkingEmail = true;
    this.isInvalidEmail = !emailRegex.test(this.email);
    this.checkFormValidity();
  }

  checkFormValidity() {
    this.isInvalidForm =
      this.isInvalidName ||
      this.isInvalidSurnames ||
      this.isInvalidCenter ||
      this.isInvalidDate ||
      this.isInvalidEmail ||
      this.isInvalidPassword ||
      this.isInvalidPassword2;
  }

  checkAll(){
    this.checkingCenter=false;
    this.checkingDate=false;
    this.checkingEmail=false;
    this.checkingName=false;
    this.checkingPassword=false;
    this.checkingPassword2=false;
    this.checkingSurnames=false;
  }
}
