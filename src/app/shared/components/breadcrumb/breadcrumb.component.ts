import { Component, Input, Output, EventEmitter, OnInit, standalone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBreadcrumbsModule } from '@angular/material/breadcrumbs';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, MatBreadcrumbsModule, MatIconModule, RouterModule],
  template: `
    <nav aria-label="breadcrumb" class="breadcrumb-container">
      <ol class="breadcrumb">
        <li *ngFor="let item of items; let last = last" class="breadcrumb-item">
          <a *ngIf="!last && item.url" [routerLink]="item.url" class="breadcrumb-link">
            {{ item.label }}
          </a>
          <span *ngIf="last" class="breadcrumb-active">{{ item.label }}</span>
          <mat-icon *ngIf="!last" class="breadcrumb-separator">chevron_right</mat-icon>
        </li>
      </ol>
    </nav>
  `,
  styles: [`
    .breadcrumb-container {
      padding: 1rem 0;
      margin-bottom: 1rem;
    }

    .breadcrumb {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .breadcrumb-item {
      display: flex;
      align-items: center;
      margin-right: 0.5rem;
    }

    .breadcrumb-link {
      color: #1976d2;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .breadcrumb-active {
      color: #666;
      font-weight: 500;
    }

    .breadcrumb-separator {
      font-size: 18px;
      color: #999;
      margin: 0 0.25rem;
    }
  `]
})
export class BreadcrumbComponent implements OnInit {
  @Input() items: BreadcrumbItem[] = [];
  @Output() itemClicked = new EventEmitter<BreadcrumbItem>();

  ngOnInit(): void {}

  onItemClick(item: BreadcrumbItem): void {
    this.itemClicked.emit(item);
  }
}
