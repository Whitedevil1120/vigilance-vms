import { Component, Input, OnInit, standalone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="spinner-container" *ngIf="isLoading">
      <mat-spinner [diameter]="diameter" [strokeWidth]="strokeWidth"></mat-spinner>
      <p *ngIf="message" class="spinner-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .spinner-message {
      margin-top: 1rem;
      color: #666;
      font-size: 14px;
    }
  `]
})
export class LoadingSpinnerComponent implements OnInit {
  @Input() isLoading: boolean = false;
  @Input() message: string = 'Loading...';
  @Input() diameter: number = 50;
  @Input() strokeWidth: number = 4;

  ngOnInit(): void {}
}
