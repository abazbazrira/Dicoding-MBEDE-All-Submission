const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedNewComment = require('../../../Domains/comments/entities/AddedNewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addNewComment function', () => {
    it('should presist new comment and return added comment correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'dicoding',
      });
      const threadId = await ThreadsTableTestHelper.addNewThread({
        owner: ownerId,
      });
      const commentUserId = await UsersTableTestHelper.addUser({
        id: 'user-111',
        username: 'commenter',
      });

      const addNewComment = {
        threadId,
        content: 'thread comment',
        owner: commentUserId,
      };

      const mockIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        mockIdGenerator
      );
      const addedNewComment = await commentRepositoryPostgres.addNewComment(
        addNewComment
      );

      expect(addedNewComment).toStrictEqual(
        new AddedNewComment({
          id: `comment-${mockIdGenerator()}`,
          content: 'thread comment',
          owner: commentUserId,
        })
      );

      const dbComments = await CommentsTableTestHelper.findCommentById(
        addedNewComment.id
      );

      expect(dbComments).toHaveLength(1);
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw 404 error when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const commentId = 'comment-321';

      await expect(
        commentRepositoryPostgres.verifyCommentAvailability(commentId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should not throw error when comment is exist', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });
      const threadId = await ThreadsTableTestHelper.addNewThread({
        owner: ownerId,
      });

      const commenterId = await UsersTableTestHelper.addUser({
        id: 'user-000',
        username: 'commenter',
      });
      const commentId = await CommentsTableTestHelper.addNewComment({
        threadId,
        owner: commenterId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.verifyCommentAvailability(commentId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });

  describe('ownerCommentAccessVerification function', () => {
    it('should throw Authorization error when cannot access resourse', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });
      const threadId = await ThreadsTableTestHelper.addNewThread({
        owner: ownerId,
      });

      const commenterId = await UsersTableTestHelper.addUser({
        id: 'user-000',
        username: 'commenter',
      });
      const commentId = await CommentsTableTestHelper.addNewComment({
        threadId,
        owner: commenterId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const ids = {
        commentId,
        threadId,
        credentialId: ownerId,
      };

      await expect(
        commentRepositoryPostgres.ownerCommentAccessVerification(ids)
      ).rejects.toThrow(AuthorizationError);
    });

    it('should not throw error when comment is exist and can access resourse', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });
      const threadId = await ThreadsTableTestHelper.addNewThread({
        owner: ownerId,
      });

      const commenterId = await UsersTableTestHelper.addUser({
        id: 'user-000',
        username: 'commenter',
      });
      const commentId = await CommentsTableTestHelper.addNewComment({
        threadId,
        owner: commenterId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const ids = {
        commentId,
        threadId,
        credentialId: commenterId,
      };

      await expect(
        commentRepositoryPostgres.ownerCommentAccessVerification(ids)
      ).resolves.not.toThrow(AuthorizationError);
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete comment correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });
      const threadId = await ThreadsTableTestHelper.addNewThread({
        owner: ownerId,
      });

      const commentId = await CommentsTableTestHelper.addNewComment({
        threadId,
        owner: ownerId,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const deletedId = await commentRepositoryPostgres.deleteCommentById(
        commentId
      );

      const deletedComment = await CommentsTableTestHelper.findCommentById(
        commentId
      );

      expect(deletedId).toEqual(commentId);
      expect(deletedComment[0].is_delete).toBeTruthy();
    });
  });

  describe('getCommentById function', () => {
    it('should return comments correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });

      const threadId1 = await ThreadsTableTestHelper.addNewThread({
        id: 'thread-100',
        owner: ownerId,
      });

      const threadId2 = await ThreadsTableTestHelper.addNewThread({
        id: 'thread-200',
        owner: ownerId,
      });

      const commenterId1 = await UsersTableTestHelper.addUser({
        id: 'user-001',
        username: 'jack',
      });

      const commenterId2 = await UsersTableTestHelper.addUser({
        id: 'user-002',
        username: 'mosh',
      });

      await CommentsTableTestHelper.addNewComment({
        id: 'comment-100',
        threadId: threadId1,
        owner: commenterId1,
        content: 'jack thread comment content',
        date: new Date('2022-08-08T07:20:33.555Z'),
      });

      await CommentsTableTestHelper.addNewComment({
        id: 'comment-200',
        threadId: threadId1,
        owner: commenterId2,
        content: 'so amazing thread!!',
        date: new Date('2022-08-08T07:22:33.555Z'),
      });

      // delete comment for change value of content to "komentar telah dihapus"
      await CommentsTableTestHelper.deleteCommentById('comment-200');

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const results = await commentRepositoryPostgres.getCommentById(
        threadId1
      );

      expect(results).toHaveLength(2);
      const [comment1, comment2] = results;

      expect(comment1.id).toEqual('comment-100');
      expect(comment1.username).toEqual('jack');
      expect(comment1.content).toEqual('jack thread comment content');
      expect(comment1.date).toEqual(new Date('2022-08-08T07:20:33.555Z'));

      expect(comment2.id).toEqual('comment-200');
      expect(comment2.username).toEqual('mosh');
      expect(comment2.content).toEqual('**komentar telah dihapus**');
      expect(comment2.date).toEqual(new Date('2022-08-08T07:22:33.555Z'));
    });
  });

  describe('getComment function', () => {
    it('should throw not found error when comment is not found', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });

      const threadId = await ThreadsTableTestHelper.addNewThread({
        id: 'thread-100',
        owner: ownerId,
      });

      const commentId = await CommentsTableTestHelper.addNewComment({
        id: 'comment-100',
        threadId,
        owner: ownerId,
        content: 'thread comment content',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.getComment(commentId, 'thread-000')
      ).rejects.toThrow(NotFoundError);
    });

    it('should not throw not found error when comment is found', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        username: 'dicoding',
      });

      const threadId = await ThreadsTableTestHelper.addNewThread({
        id: 'thread-100',
        owner: ownerId,
      });

      const commentId = await CommentsTableTestHelper.addNewComment({
        id: 'comment-100',
        threadId,
        owner: ownerId,
        content: 'thread comment content',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(
        commentRepositoryPostgres.getComment(commentId, threadId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });
});
