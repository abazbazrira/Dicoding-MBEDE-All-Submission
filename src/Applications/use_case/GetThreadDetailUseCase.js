class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThreadDetailById(threadId);
    const comments = await this._commentRepository.getCommentById(threadId);

    return { ...thread, comments: comments };
  }
}

module.exports = GetThreadDetailUseCase;
