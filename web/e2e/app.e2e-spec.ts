import { BabyfootPage } from './app.po';

describe('babyfoot App', () => {
  let page: BabyfootPage;

  beforeEach(() => {
    page = new BabyfootPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('octo works!');
  });
});
