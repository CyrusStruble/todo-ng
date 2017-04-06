import { TodoNgPage } from './app.po';

describe('todo-ng App', () => {
  let page: TodoNgPage;

  beforeEach(() => {
    page = new TodoNgPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
