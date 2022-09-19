const AddNewThreadUseCase = require('../../../../Applications/use_case/AddNewThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailByIdHandler = this.getThreadDetailByIdHandler.bind(this);
  }

  async postThreadHandler({ auth, payload }, h) {
    const { id: credentialId } = auth.credentials;
    const addNewThreadUseCase = this._container.getInstance(AddNewThreadUseCase.name);
    const addedNewThread = await addNewThreadUseCase.execute({
      ...payload,
      owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      data: { addedThread: addedNewThread },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailByIdHandler({ params }) {
    const getThreadDetailUseCase = this._container.getInstance(GetThreadDetailUseCase.name);

    const thread = await getThreadDetailUseCase.execute(params);

    return {
      status: 'success',
      data: { thread },
    };
  }
}

module.exports = ThreadsHandler;
