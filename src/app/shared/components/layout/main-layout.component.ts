import { Component, OnInit, standalone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent, RouterModule],
  template: `
    <div class="layout-container">
      <app-navbar></app-navbar>
      <div class="layout-content">
        <app-sidebar>
          <main class="main-content">
            <router-outlet></router-outlet>
          </main>
        </app-sidebar>
      </div>
    </div>
  `,
  styles: [`
    .layout-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .layout-content {
      flex: 1;
      overflow: hidden;
    }

    .main-content {
      padding: 2rem;
      overflow-y: auto;
      height: 100%;
    }
  `]
})
export class MainLayoutComponent implements OnInit {
  ngOnInit(): void {}
}
