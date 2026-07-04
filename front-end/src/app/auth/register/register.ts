import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../FireBaseProvider/Firebase.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: '../base/Authbase.css',
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent {

  private readonly firebaseService = inject(FirebaseService);

  username = '';
  email = '';
  phone = '';
  password = '';
  rememberMe = false;
  showPassword = signal(false);
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  clearError() {
    this.errorMessage.set(null);
  }

  async onSubmit() {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    
    const result = await this.firebaseService.creatAccount(this.email, this.password);

    if(!result.success && result.errorMessage)
      this.errorMessage.set(result.errorMessage);
 
    this.isLoading.set(false);
  }

  async socialRegister() {
    this.errorMessage.set(null);
    this.isLoading.set(true);

   
    const result =  await this.firebaseService.signInWithGoogle();

    if(!result.success && result.errorMessage)
      this.errorMessage.set(result.errorMessage);
    
    
    this.isLoading.set(false);
  }
}