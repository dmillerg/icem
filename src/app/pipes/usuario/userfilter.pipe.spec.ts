import { UserFilter } from './userfilter.pipe';

describe('UserFilter', () => {
  it('create an instance', () => {
    const pipe = new UserFilter();
    expect(pipe).toBeTruthy();
  });
});
