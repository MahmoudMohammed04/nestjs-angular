import { Component, Inject, inject, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RedirectCommand, Router, RouterLink, RouterModule } from '@angular/router';
import { FirebaseService } from '../../Providers/FireBaseProvider/Firebase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: '../base/Authbase.css',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

  private readonly firebaseService = inject(FirebaseService);
  private readonly router: Router = inject(Router);

  email = '';
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

    
    const result =  await this.firebaseService.signIn(this.email, this.password,this.rememberMe);

    if(!result.success && result.errorMessage)
      this.errorMessage.set(result.errorMessage);
    
    if(result.success)
    this.router.navigate(['/Conversation']);
    
    this.isLoading.set(false);
    
  }

  async socialLogin() {
    this.errorMessage.set(null);
    this.isLoading.set(true);

    
    const result = await this.firebaseService.signInWithGoogle();

    if(!result.success && result.errorMessage)
      this.errorMessage.set(result.errorMessage);

    if(result.success)
    this.router.navigate(['/Conversation']);
  
    this.isLoading.set(false);
  
  }
}