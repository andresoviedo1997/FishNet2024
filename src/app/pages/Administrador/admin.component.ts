import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [NgbNavModule],
  standalone: true,
})
export class adminComponent {
  NgbdNavBasic: any 
  active = 1;

}





