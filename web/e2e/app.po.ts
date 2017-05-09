import { browser, element, by } from 'protractor';

export class BabyfootPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('octo-root h1')).getText();
  }
}
