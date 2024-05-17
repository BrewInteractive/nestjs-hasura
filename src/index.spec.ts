import { HasuraModule, HasuraService } from './index';

describe('HasuraTest', () => {
  it('Should export HasuraModule', () => {
    expect(HasuraModule).toBeDefined();
  });

  it('Should export HasuraService', () => {
    expect(HasuraService).toBeDefined();
  });
});
