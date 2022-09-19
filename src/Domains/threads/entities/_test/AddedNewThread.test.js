const AddedNewThread = require('../AddedNewThread');

describe('AddedNewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'dicoding thread',
    };

    expect(() => new AddedNewThread (payload)).toThrowError(
      'ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should thow error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      title: 'dicoding thread',
      owner: true,
    };

    expect(() => new AddedNewThread (payload)).toThrowError(
      'ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create addNewThread object correctly', () => {
    const payload = {
      id: 'thread-321',
      title: 'dicoding thread',
      owner: 'user-123',
    };

    const addNewThread = new AddedNewThread (payload);

    expect(addNewThread.id).toEqual(payload.id);
    expect(addNewThread.title).toEqual(payload.title);
    expect(addNewThread.owner).toEqual(payload.owner);
  });
});
