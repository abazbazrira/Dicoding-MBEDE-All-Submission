const AddNewComment = require('../AddNewComment');

describe('AddNewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'thread comment',
    };

    expect(() => new AddNewComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      threadId: 'thread-321',
      content: 123,
      owner: 'user-123',
    };

    expect(() => new AddNewComment(payload)).toThrowError(
      'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create addNewComment object correctly', () => {
    const payload = {
      threadId: 'thread-321',
      content: 'thread comment',
      owner: 'user-123',
    };

    const addNewComment = new AddNewComment(payload);

    expect(addNewComment.threadId).toEqual(payload.threadId);
    expect(addNewComment.content).toEqual(payload.content);
    expect(addNewComment.owner).toEqual(payload.owner);
  });
});
