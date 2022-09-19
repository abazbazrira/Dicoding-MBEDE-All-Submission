const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedNewComment = require('../../../Domains/comments/entities/AddedNewComment');
const AddNewComment = require('../../../Domains/comments/entities/AddNewComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddNewCommentUseCase = require('../AddNewCommentUseCase');

describe('AddNewCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-321',
      content: 'thread comment',
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn(() => Promise.resolve());
    mockCommentRepository.addNewComment = jest.fn(() =>
      Promise.resolve(
        new AddedNewComment({
          id: 'comment-321',
          content: useCasePayload.content,
          owner: useCasePayload.owner,
        })
      )
    );

    const addNewCommentUseCase = new AddNewCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedNewComment = await addNewCommentUseCase.execute(useCasePayload);

    expect(addedNewComment).toStrictEqual(
      new AddedNewComment({
        id: 'comment-321',
        content: useCasePayload.content,
        owner: useCasePayload.owner,
      })
    );
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(
      useCasePayload.threadId
    );
    expect(mockCommentRepository.addNewComment).toBeCalledWith(
      new AddNewComment(useCasePayload)
    );
  });
});
