import { Db, Collection, collectionIndex } from '../mod';
import { BaseContext, BaseCollectionIndex } from '../types';

const collections: BaseCollectionIndex[] = [
  {
    name: 'deploy_versions',
    options: {},
    indexes: [
      {
        index: { version: 1 },
        options: { name: 'idx_version' },
      },
      {
        index: { createdAt: 1 },
        options: { name: 'idx_created_at' },
      },
      {
        index: { isDeleted: 1 },
        options: { name: 'idx_is_deleted' },
      },
    ],
  },
  {
    name: 'deploy_logs',
    options: {},
    indexes: [
      {
        index: { type: 1 },
        options: { name: 'idx_type' },
      },
      {
        index: { action: 1 },
        options: { name: 'idx_action' },
      },
      {
        index: { createdAt: 1 },
        options: { name: 'idx_created_at' },
      },
    ],
  },
  {
    name: 'deploy_users',
    options: {},
    indexes: [
      {
        index: { username: 1 },
        options: { name: 'idx_username' },
      },
      {
        index: { openId: 1 },
        options: { name: 'idx_open_id' },
      },
      {
        index: { lastLogin: 1 },
        options: { name: 'idx_last_login' },
      },
      {
        index: { isDeleted: 1 },
        options: { name: 'idx_is_deleted' },
      },
    ],
  },
];

const getCollectionPromise = (
  db: Db,
  collectionConfig: BaseCollectionIndex,
) => {
  return new Promise((resolve, reject) => {
    db.collection(
      collectionConfig.name,
      { strict: true },
      (error: any, collection: Collection) => {
        if (error) {
          db.createCollection(collectionConfig.name, collectionConfig.options)
            .then((newCollection: Collection) => {
              resolve(newCollection);
            })
            .catch(reject);
        } else {
          db.command({
            collMod: collectionConfig.name,
            ...collectionConfig.options,
          })
            .then(() => {
              resolve(collection);
            })
            .catch(reject);
        }
      },
    );
  });
};

export default async function createCollections(ctx: BaseContext) {
  for (const collectionConfig of collections) {
    const db = ctx.db as Db;
    const collection = (await getCollectionPromise(
      db,
      collectionConfig,
    )) as Collection;

    if (Array.isArray(collectionConfig.indexes)) {
      const indexingPromises = collectionConfig.indexes.map((indexArgs: any) =>
        collectionIndex(collection, indexArgs.index, indexArgs.options || {}),
      );
      await Promise.all(indexingPromises);
    }
  }
}
