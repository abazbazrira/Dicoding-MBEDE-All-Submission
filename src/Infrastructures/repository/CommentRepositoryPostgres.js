const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

const AddedNewComment = require('../../Domains/comments/entities/AddedNewComment');
const CommentDetail = require('../../Domains/comments/entities/CommentDetail');

const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addNewComment(addNewComment) {
    const { threadId, content, owner } = addNewComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: `INSERT INTO
                comments (id, owner, thread_id, content)
              VALUES ($1, $2, $3, $4)
              RETURNING id, content, owner`,
      values: [id, owner, threadId, content],
    };

    const { rows } = await this._pool.query(query);

    return new AddedNewComment(rows[0]);
  }

  async ownerCommentAccessVerification(ids) {
    const { commentId, threadId, credentialId } = ids;

    const query = {
      text: `SELECT id, owner, thread_id
              FROM comments
              WHERE id = $1 AND thread_id = $2`,
      values: [commentId, threadId],
    };

    const { rows } = await this._pool.query(query);

    const comment = rows[0];

    if (comment.owner !== credentialId) {
      throw new AuthorizationError('not have access to this resourses');
    }
  }

  async verifyCommentAvailability(id) {
    const query = {
      text: `SELECT id, owner, thread_id
              FROM comments
              WHERE id = $1`,
      values: [id],
    };

    const { rowCount: isExist } = await this._pool.query(query);

    if (!isExist) {
      throw new NotFoundError('comment not found');
    }
  }

  async deleteCommentById(id) {
    const query = {
      text: `UPDATE comments
              SET is_delete = true
              WHERE id = $1
              RETURNING id`,
      values: [id],
    };
    const { rows } = await this._pool.query(query);

    return rows[0].id;
  }

  async getCommentById(id) {
    const query = {
      text: `SELECT comments.id, users.username, date, content, is_delete
              FROM comments
              INNER JOIN users
              ON users.id = comments.owner
              WHERE thread_id = $1
              ORDER BY date ASC`,
      values: [id],
    };
    const { rows } = await this._pool.query(query);
    return rows.map((row) => new CommentDetail(row));
  }

  async getComment(commentId, threadId) {
    const query = {
      text: `SELECT id
              FROM comments
              WHERE id = $1 AND
                    thread_id = $2`,
      values: [commentId, threadId],
    };

    const { rowCount } = await this._pool.query(query);

    if (!rowCount) {
      throw new NotFoundError('comment not found');
    }
  }
}

module.exports = CommentRepositoryPostgres;
