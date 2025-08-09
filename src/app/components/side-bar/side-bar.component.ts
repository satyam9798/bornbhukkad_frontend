import { Component,Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
  @Output() changeDashboardEvent = new EventEmitter<string>();

  emitEvent(dashboardName: string) {
    this.changeDashboardEvent.emit(dashboardName);
  }

}
