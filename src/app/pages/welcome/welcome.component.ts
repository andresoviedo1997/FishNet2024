import { Component, Input } from '@angular/core';
import welcome from './Welcome';
import { trigger, style, transition,animate, state}from '@angular/animations';



@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  styles:['h1 {font-family: Lato ;}'],
  animations :[
    trigger('enterState',[
      state('void',style({
        transform : 'translateX(-100%)',
        opacity: 0
      })),
      transition (':enter',[
        animate(300,style({
          transform: 'translateX(0)',
          opacity:1
        }))
      ])
    ])
  ]
})
export class WelcomeComponent {
  @Input() name: string;
  public courses : any[] = welcome;
}
