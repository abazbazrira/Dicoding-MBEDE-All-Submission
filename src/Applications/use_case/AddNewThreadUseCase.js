const AddNewThread = require('../../Domains/threads/entities/AddNewThread');

class AddNewThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addNewThread = new AddNewThread(useCasePayload);
    const addedNewThread = await this._threadRepository.addNewThread(addNewThread);
    return addedNewThread;
  }
}

module.exports = AddNewThreadUseCase;
