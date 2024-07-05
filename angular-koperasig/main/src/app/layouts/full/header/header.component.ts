import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;

  constructor(
    public dialog: MatDialog,
    private AuthServ: AuthService, 
    private router: Router

  ) {}

  logout() {
    this.AuthServ.logout().subscribe({
      next: () => {
        // Remove token from local storage and navigate to login page
        localStorage.removeItem('token');
        this.router.navigate(['/Authentication/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        // Ensure token is removed even if the API call fails
        localStorage.removeItem('token');
        this.router.navigate(['/authentication/login']);
      },
    });
  }
}
