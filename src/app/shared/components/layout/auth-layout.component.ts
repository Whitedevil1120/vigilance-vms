import { Component, OnInit, standalone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="auth-layout-container">
      <div class="auth-layout-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .auth-layout-content {
      width: 100%;
      max-width: 500px;
      padding: 2rem;
    }
  `]
})
export class AuthLayoutComponent implements OnInit {
  ngOnInit(): void {}
}
