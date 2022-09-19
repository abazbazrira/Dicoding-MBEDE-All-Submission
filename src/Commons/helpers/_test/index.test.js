const { getEnv } = require('../index');

describe('Helper', () => {
  it('should throw error when key of env not found', () => {
    const error = () => {
      getEnv('RANDOM');
    };
    expect(error).toThrow(Error);
    expect(error).toThrow('Couldn\'t find enviroment variabel: RANDOM');
  });

  it('should getEnv correctly', () => {
    expect(process.env['PORT']).toEqual(getEnv('PORT'));
  });
});
