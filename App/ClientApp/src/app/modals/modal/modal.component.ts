import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  public self;
  public accepted = false;

  accept(ac: boolean) {
    this.accepted = ac;
    this.self.close();
  }

}

