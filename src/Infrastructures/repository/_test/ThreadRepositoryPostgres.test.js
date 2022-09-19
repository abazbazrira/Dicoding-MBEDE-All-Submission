const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

const AddNewThread = require('../../../Domains/threads/entities/AddNewThread');

const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addNewThread function', () => {
    it('should presist new thread and return added thread correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });

      const addNewThread = new AddNewThread({
        title: 'dicoding thread',
        body: 'dicoding thread body',
        owner: ownerId,
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      const resultAddNewThread = await threadRepositoryPostgres.addNewThread(addNewThread);

      expect(resultAddNewThread.id).toEqual('thread-123');
      expect(resultAddNewThread.title).toEqual(addNewThread.title);
      // expect(resultAddNewThread.body).toEqual(addNewThread.body);
      expect(resultAddNewThread.owner).toEqual(addNewThread.owner);

      const threads = await ThreadsTableTestHelper.findThreadById(
        `thread-${fakeIdGenerator()}`
      );
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toEqual(`thread-${fakeIdGenerator()}`);
    });
  });

  describe('getThreadDetailById', () => {
    it('should throw notFound error when thread not found', async () => {
      const threadId = 'thread-000';

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgres.getThreadDetailById(threadId)
      ).rejects.toThrow(NotFoundError);
    });

    it('should return correct thread', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const threadId = await ThreadsTableTestHelper.addNewThread({ owner: ownerId });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const thread = await threadRepositoryPostgres.getThreadDetailById(threadId);

      expect(thread.username).toEqual('dicoding');
      expect(thread.id).toEqual(threadId);
      expect(thread.title).toEqual('dicoding thread');
      expect(thread.body).toEqual('dicoding thread body');
      expect(thread.date).toEqual(new Date('2022-08-08T07:19:09.775Z'));
    });
  });

  describe('verifyThreadAvailability', () => {
    it('should throw not found error when thread not found', async () => {
      const threadRepositoryPostgress = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgress.verifyThreadAvailability('thread-000')
      ).rejects.toThrow(NotFoundError);
    });

    it('should not throw not found error when thread is found', async () => {
      const ownerId = await UsersTableTestHelper.addUser({ username: 'dicoding' });
      const threadId = await ThreadsTableTestHelper.addNewThread({ owner: ownerId });
      const threadRepositoryPostgress = new ThreadRepositoryPostgres(pool, {});

      await expect(
        threadRepositoryPostgress.verifyThreadAvailability(threadId)
      ).resolves.not.toThrow(NotFoundError);
    });
  });
});
