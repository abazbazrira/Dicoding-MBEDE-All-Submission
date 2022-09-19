const AddNewThreadUseCase = require('../AddNewThreadUseCase');

const AddedNewThread = require('../../../Domains/threads/entities/AddedNewThread');
const AddNewThread = require('../../../Domains/threads/entities/AddNewThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddNewThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'dicoding thread',
      body: 'dicoding thread body',
      owner: 'user-123',
    };

    const mockRepository = new ThreadRepository();

    mockRepository.addNewThread = jest.fn(() =>
      Promise.resolve(
        new AddedNewThread({
          id: 'thread-321',
          title: useCasePayload.title,
          owner: useCasePayload.owner,
        })
      )
    );

    const addNewThreadUseCase = new AddNewThreadUseCase({
      threadRepository: mockRepository,
    });

    const addedNewThread = await addNewThreadUseCase.execute(useCasePayload);

    expect(addedNewThread).toStrictEqual(
      new AddedNewThread({
        id: 'thread-321',
        title: useCasePayload.title,
        owner: useCasePayload.owner,
      })
    );
    expect(mockRepository.addNewThread).toBeCalledWith(
      new AddNewThread(useCasePayload)
    );
  });
});
