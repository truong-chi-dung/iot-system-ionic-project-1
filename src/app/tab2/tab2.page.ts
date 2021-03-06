import { Component } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
    private localNotifications: LocalNotifications
  ) { }
  
  showNotification() {
    this.localNotifications.schedule({
      title: 'Notification',
      text: 'Testing Notification'
    });
  }

}
