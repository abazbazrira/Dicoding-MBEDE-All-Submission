const AddNewThread = require('../AddNewThread');

describe('AddNewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'dicoding thread',
    };

    expect(() => new AddNewThread(payload)).toThrowError(
      'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should thow error when payload did not meet data type specification', () => {
    const payload = {
      title: 'dicoding thread',
      body: 123,
      owner: true,
    };

    expect(() => new AddNewThread(payload)).toThrowError(
      'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create addNewThread object correctly', () => {
    const payload = {
      title: 'dicoding thread',
      body: 'dicoding thread body',
      owner: 'user-123',
    };

    const addNewThread = new AddNewThread(payload);

    expect(addNewThread.title).toEqual(payload.title);
    expect(addNewThread.body).toEqual(payload.body);
    expect(addNewThread.owner).toEqual(payload.owner);
  });
});
