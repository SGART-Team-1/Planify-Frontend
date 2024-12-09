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
  
  errorEmail: string = 'Rellene este campo.';
  errorName: string = 'Rellene este campo.';
  errorSurnames: string = 'Rellene este campo.';
  errorCenter: string = 'Rellene este campo.';
  errorDate: string = 'Rellene este campo.';
  errorPwd1: string = 'Rellene este campo.';
  errorPwd2: string = 'Rellene este campo.';
  error: string = '';
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
              dialogRef.afterClosed().subscribe((resultado: any) => {
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
    if(this.name.trim()===''){
      this.errorName='Rellene este campo.';
      this.isInvalidName=true;
    }
    // Si contiene números u otros caracteres, se marca como inválido.
    else if(this.noNumbers(this.name)){
      this.errorName='Este campo no debe contener números.';
      this.isInvalidName=true;
    }else
      this.isInvalidName=false;
    this.checkFormValidity();
  }

  validateSurnames(): void {
    this.checkingSurnames = true;
    if(this.surnames.trim()===''){
      this.errorSurnames='Rellene este campo.';
      this.isInvalidSurnames=true;
    }
    // Si contiene números u otros caracteres, se marca como inválido.
    else if(this.noNumbers(this.surnames)){
      this.errorSurnames='Este campo no debe contener números.';
      this.isInvalidSurnames=true;
    }else
      this.isInvalidSurnames=false;
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
    if(this.pwd1.trim()===''){
      this.errorPwd1='Rellene este campo.';
      this.isInvalidPassword=true;
    }
    // Si contiene números u otros caracteres, se marca como inválido.
    else if(this.passwordRequirements(this.pwd1)){
      this.errorPwd1='La contraseña debe contener al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 carácter especial y 1 número.';
      this.isInvalidPassword = true;
    }else
      this.isInvalidPassword=false;
    this.validatePassword2();
    this.checkFormValidity();
  }

  validatePassword2(): void {
    this.checkingPassword2 = true;
    if(this.pwd2.trim()===''){
      this.errorPwd2='Rellene este campo.';
      this.isInvalidPassword2=true;
    }
    else if(this.pwd1 !== this.pwd2){
      this.errorPwd2='No coincide con la contraseña';
      this.isInvalidPassword2=true;
    }else
      this.isInvalidPassword2=false;
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
    if(this.email.trim()===''){
      this.errorEmail='Rellene este campo.';
      this.isInvalidEmail=true;
    }
    else if(!emailRegex.test(this.email)){
      this.errorEmail='Este formato de email no es válido.';
      this.isInvalidEmail = true;
    }else
      this.isInvalidEmail=false;
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
