const pool = require('../../../Infrastructures/database/postgres/pool');
const CommentRepositoryPostgres = require('../../../Infrastructures/repository/CommentRepositoryPostgres');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should delete the comment correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-321',
      commentId: 'comment-321',
      credentialId: 'user-123',
    };

    const mockRepository = new CommentRepositoryPostgres(pool, {});

    mockRepository.verifyCommentAvailability = jest.fn(() => Promise.resolve());
    mockRepository.ownerCommentAccessVerification = jest.fn(() => Promise.resolve());

    mockRepository.deleteCommentById = jest.fn(() =>
      Promise.resolve(useCasePayload.id)
    );

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockRepository,
    });

    await deleteCommentUseCase.execute(useCasePayload);

    expect(mockRepository.verifyCommentAvailability).toBeCalledWith(useCasePayload.commentId);
    expect(mockRepository.ownerCommentAccessVerification).toBeCalledWith(useCasePayload);
    expect(mockRepository.deleteCommentById).toBeCalledWith(
      useCasePayload.commentId
    );
  });
});
