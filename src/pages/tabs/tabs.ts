import { Component } from '@angular/core';

import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { SettingsPage } from '../settings/settings';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
<<<<<<< HEAD
  tab3Root = AboutPage;
  tab2Root = SettingsPage;
=======
  tab3Root = ContactPage;
>>>>>>> 085d0c3120a3cef9cf747f58aed8054a32d8f449

  constructor() {

  }
}
