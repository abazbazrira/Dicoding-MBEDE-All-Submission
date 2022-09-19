const AddNewComment = require('../../Domains/comments/entities/AddNewComment');

class AddNewCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const addNewComment = new AddNewComment(useCasePayload);
    await this._threadRepository.verifyThreadAvailability(addNewComment.threadId);
    return this._commentRepository.addNewComment(addNewComment);
  }
}

module.exports = AddNewCommentUseCase;
