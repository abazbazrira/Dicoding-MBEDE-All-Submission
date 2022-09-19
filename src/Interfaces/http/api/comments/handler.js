const AddNewCommentUseCase = require('../../../../Applications/use_case/AddNewCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler({ auth, payload, params }, h) {
    const { id: credentialId } = auth.credentials;
    const { threadId } = params;
    const addNewCommentUseCase = this._container.getInstance(AddNewCommentUseCase.name);
    const addedNewComment = await addNewCommentUseCase.execute({
      ...payload,
      threadId,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      data: { addedComment: addedNewComment },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler({ auth, params }) {
    const { id: credentialId } = auth.credentials;
    const { threadId, commentId } = params;
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name
    );

    await deleteCommentUseCase.execute({ credentialId, threadId, commentId });

    return {
      status: 'success',
    };
  }
}

module.exports = CommentsHandler;
