const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('GetThreadDetailUseCase', () => {
  it('should return thread detail correctly', async () => {
    const useCasePayload = {
      id: 'thread-321',
      title: 'dicoding thread',
      body: 'dicoding thread body',
      date: new Date('2022-08-08T07:22:33.555Z'),
      owner: 'user-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadDetailById = jest.fn(() =>
      Promise.resolve({
        id: 'thread-321',
        title: 'dicoding thread',
        body: 'dicoding thread body',
        date: new Date('2022-08-08T07:22:33.555Z'),
        owner: 'user-123',
      })
    );

    mockCommentRepository.getCommentById = jest.fn(() =>
      Promise.resolve([{
        id: 'comment-321',
        username: 'user-123',
        date: new Date('2022-08-08T07:22:33.555Z'),
        content: 'comment content',
      }, {
        id: 'comment-4321',
        username: 'user-1234',
        date: new Date('2022-08-09T07:22:33.555Z'),
        content: 'comment content',
      }])
    );

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    const thread = await getThreadDetailUseCase.execute(useCasePayload);

    expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(
      useCasePayload.threadId
    );

    expect(mockCommentRepository.getCommentById).toBeCalledWith(
      useCasePayload.threadId
    );
    
    expect(thread).toStrictEqual({
      id: 'thread-321',
      title: 'dicoding thread',
      body: 'dicoding thread body',
      date: new Date('2022-08-08T07:22:33.555Z'),
      owner: 'user-123',
      comments: [{
        id: 'comment-321',
        username: 'user-123',
        date: new Date('2022-08-08T07:22:33.555Z'),
        content: 'comment content',
      }, {
        id: 'comment-4321',
        username: 'user-1234',
        date: new Date('2022-08-09T07:22:33.555Z'),
        content: 'comment content',
      }],
    });
  });
});
