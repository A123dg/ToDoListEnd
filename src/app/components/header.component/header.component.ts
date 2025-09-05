import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { UserProfile, UserService,UserDto,ChangePasswordRequest,UpdateUserRequest } from '../../services/user';
import { RouterModule } from '@angular/router';
import {Router}  from '@angular/router'
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() loginClick = new EventEmitter<void>();
  @Output() registerClick = new EventEmitter<void>();
  dropdownOpen = false;
  sidebarOpen = false;

  isLoggedIn = false;
  currentUser: UserProfile | null = null;
  updateModel: UpdateUserRequest = { username: '', email: '' };

  changePassModel: ChangePasswordRequest = { currentPassword: '', newPassword: '' ,confirmPassword: ''};
    showUpdateForm = false;
    showChangePasswordForm = false;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router : Router
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(isLogged => {
      this.isLoggedIn = isLogged;

      if (isLogged) {
        this.userService.getProfile().subscribe({
          
          next: (user) => {
  console.log('Fetched user:', user);
  this.currentUser = user;
},
          error: (err) => console.error('Error fetching user data:', err)
        });
      } else {
        this.currentUser = null;
      }
    });
  }

  onLoginClick() {
    this.loginClick.emit();
  }

  onRegister() {
    this.registerClick.emit();
  }

  logout() {
    this.router.navigate(['/home']);

    this.authService.logout();
  }
  updateProfile() {
    this.userService.updateProfile(this.updateModel).subscribe({
      next: (response : UserDto) => {
        console.log('Update profile successful:', response);
        this.currentUser = response;
        this.showUpdateForm = false;
        this.updateModel.username='';
        this.updateModel.email='';
      },
      error: (err) => {
        console.error('Update profile failed:', err);
      }
    });
  }
  changePassword() {
    this.userService.changePassword(this.changePassModel).subscribe({
      next: (response) => {
        console.log('Change password successful:', response);
        this.showChangePasswordForm = false;
        this.changePassModel.currentPassword = '';
        this.changePassModel.newPassword = '';
        this.changePassModel.confirmPassword = '';
      },
      error: (err) => {
        console.error('Change password failed:', err);
        if (err.error && err.error.error) {
          alert(err.error.error); 
        } else {
          alert("Đổi mật khẩu thất bại, vui lòng thử lại!");
        }
      }
      
    });
  }
  toggleDropdown()
  {
    this.dropdownOpen=!this.dropdownOpen;
  }
  openSidebar()
  {
    this.sidebarOpen=true;
    this.dropdownOpen=false;
  }
  closeSidebar() {
    this.sidebarOpen = false;
  }
  
  openUpdateProfile() {
    this.showUpdateForm = true;
  }
  
  openChangePassword() {
    this.showChangePasswordForm = true;
    this.dropdownOpen = false;
  }
}
