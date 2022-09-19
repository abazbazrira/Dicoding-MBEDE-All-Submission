const AddedNewComment = require('../AddedNewComment');

describe('AddedNewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-321',
      owner: 'user-123',
    };

    expect(() => new AddedNewComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-321',
      content: 'comment content',
      owner: ['user-123'],
    };

    expect(() => new AddedNewComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create addedNewComment object correctly', () => {
    const payload = {
      id: 'comment-321',
      content: 'comment content',
      owner: 'user-123',
    };

    const addedNewComment = new AddedNewComment(payload);

    expect(addedNewComment.id).toEqual(payload.id);
    expect(addedNewComment.content).toEqual(payload.content);
    expect(addedNewComment.owner).toEqual(payload.owner);
  });
});
