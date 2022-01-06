import SimpleSchema from 'simpl-schema';

const inputAliyunPushData = new SimpleSchema({
  digest: String,
  pushed_at: String,
  tag: String,
});

const inputAliyunRepository = new SimpleSchema({
  date_created: String,
  name: String,
  namespace: String,
  region: String,
  repo_authentication_type: String,
  repo_full_name: String,
  repo_origin_type: String,
  repo_type: String,
});

export const inputAliyunSchema = new SimpleSchema({
  push_data: inputAliyunPushData,
  repository: inputAliyunRepository,
});

export const VersionSchema = new SimpleSchema({
  version: String,
  pushedAt: {
    type: Date,
    optional: true,
  },
  createdAt: {
    type: Date,
    optional: true,
  },
  isDeleted: {
    type: Boolean,
    optional: true,
  },
});
