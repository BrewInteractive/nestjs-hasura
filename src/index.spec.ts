import { HasuraModule, HasuraService } from './index';

describe('HasuraTest', () => {
  it('should export HasuraModule', () => {
    expect(HasuraModule).toBeDefined();
  });

  it('should export HasuraService', () => {
    expect(HasuraService).toBeDefined();
  });
});
