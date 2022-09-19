const CommentsHandler = require('./handler');
const commentsRoutes = require('./routes');

const comments = {
  name: 'comments',
  version: '1.0.0',
  register: async (server, { container }) => {
    const commentsHandler = new CommentsHandler(container);
    const routes = commentsRoutes(commentsHandler);
    server.route(routes);
  },
};

module.exports = comments;
