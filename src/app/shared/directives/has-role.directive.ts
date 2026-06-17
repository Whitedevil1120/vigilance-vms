import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[] = [];

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // This will be set by the parent component based on user roles
    // For demonstration, we'll check if roles are present
    if (!this.appHasRole || this.appHasRole.length === 0) {
      this.el.nativeElement.style.display = 'none';
    }
  }
}
