import {
  GetItemCommand,
  QueryCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";
import { ulid } from "ulid";
import { getUnixTime } from "date-fns";
import {
  hashPassword,
  uniqueIds,
  validateEmail,
  validatePassword,
} from "./utils.js";

/**
 * Save User
 * @param ctx
 * @param user
 * @returns {Promise<void>}
 */
export const saveUser = async (ctx, user) => {
  const { db } = ctx;
  await db.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: marshall(
        {
          PK: `USER`,
          SK: `USER#${user.id}`,
          GSI1PK: `USER#${user.email}`,
          GSI1SK: `USER#${user.id}`,
          ...user,
        },
        {
          removeUndefinedValues: true,
        },
      ),
    }),
  );
};

/**
 * Create User
 * @param ctx
 * @param name
 * @param email
 * @param password
 * @returns {Promise<{createdAt: number, password: *, GSI1PK: string, GSI1SK: string, SK: string, name, PK: string, id: string, email: string, updatedAt: number}>}
 */
export const createUser = async (ctx, { name, email, password }) => {
  if (!validateEmail(email)) {
    throw new Error("Invalid email");
  }
  if (!validatePassword(password)) {
    throw new Error("Password must be at least 5 characters long");
  }
  const { db } = ctx;
  const id = ulid();
  const emailFormated = email.toLowerCase();
  const unix = getUnixTime(new Date());
  const item = {
    PK: `USER`,
    SK: `USER#${id}`,
    GSI1PK: `USER#${emailFormated}`,
    GSI1SK: `USER#${id}`,
    id,
    email: emailFormated,
    name,
    role: "user",
    entity: "USER",
    password: hashPassword(password),
    createdAt: unix,
    updatedAt: unix,
  };
  const exist = await getUserByEmail(ctx, emailFormated);
  if (exist) {
    throw new Error("Email already exists");
  }
  try {
    await db.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item, {
          removeUndefinedValues: true,
        }),
      }),
    );
    return item;
  } catch (err) {
    throw err;
  }
};

/**
 * get Users
 * @param ctx
 * @param nextToken
 * @returns {Promise<{nextToken: null, items: *[]}>}
 */

export const getUsers = async (ctx, { nextToken }) => {
  const { db } = ctx;
  let result = {
    items: [],
    nextToken: null,
  };
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :pk",
    ExpressionAttributeValues: {
      ":pk": { S: `USER` },
    },
  };
  if (nextToken) {
    params.ExclusiveStartKey = JSON.parse(
      Buffer.from(nextToken, "base64").toString("utf-8"),
    );
  }
  try {
    const { Items, LastEvaluatedKey } = await db.send(new QueryCommand(params));
    result.items = Items.map((item) => unmarshall(item));
    if (LastEvaluatedKey) {
      result.nextToken = Buffer.from(JSON.stringify(LastEvaluatedKey)).toString(
        "base64",
      );
    }
  } catch (e) {
    throw e;
  }
  return result;
};

/**
 * Get user by ID
 * @param db
 * @param id
 * @returns {Promise<Record<string, any>>}
 */
export const getUserByID = async (db, id) => {
  try {
    const { Item } = await db.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          PK: { S: `USER` },
          SK: { S: `USER#${id}` },
        },
      }),
    );
    return unmarshall(Item);
  } catch (e) {
    throw e;
  }
};

/**
 * Get User by Email
 * @param ctx
 * @param email
 * @returns {Promise<Record<string, any>|null>}
 */
export const getUserByEmail = async (ctx, email) => {
  const { db } = ctx;
  try {
    const { Items } = await db.send(
      new QueryCommand({
        TableName: process.env.TABLE_NAME,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :email",
        ExpressionAttributeValues: {
          ":email": { S: `USER#${email}` },
        },
      }),
    );
    if (Items && Items.length > 0) {
      return unmarshall(Items[0]);
    }
  } catch (err) {
    throw err;
  }
  return null;
};

/**
 * Delete User
 * @param ctx
 * @param id
 * @returns {Promise<void>}
 */
export const deleteUser = async (ctx, id) => {
  const { db } = ctx;
  try {
    await db.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          PK: { S: `USER` },
          SK: { S: `USER#${id}` },
        },
      }),
    );
  } catch (err) {
    throw err;
  }
};

/**
 * Get User Topics
 * @param ctx
 * @param userId
 * @param pinned
 * @param asc
 * @param search
 * @returns {Promise<*[]>}
 */
export const getUserTopics = async (ctx, userId, pinned, asc, search) => {
  const { db } = ctx;
  let topics = [];
  let lastEvaluatedKey = null;
  do {
    const params = {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
      ExpressionAttributeValues: {
        ":pk": { S: `USER#${userId}` },
        ":sk": { S: "TOPIC#" },
      },
    };
    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = lastEvaluatedKey;
    }
    const { Items, LastEvaluatedKey } = await db.send(new QueryCommand(params));
    topics = topics.concat(Items.map((item) => unmarshall(item)));
    lastEvaluatedKey = LastEvaluatedKey;
  } while (lastEvaluatedKey);
  if (search) {
    const query = search.toLowerCase();
    topics = topics.filter((topic) => {
      const name = topic.name || "";
      const description = topic.description || "";
      const aiTitle = topic.aiTitle || "";
      return (
        name.toLowerCase().includes(query) ||
        aiTitle.toLowerCase().includes(query) ||
        description.toLowerCase().includes(query)
      );
    });
  }
  if (pinned) {
    topics = topics.filter((topic) => topic.pinned);
  }
  topics.sort((a, b) => {
    if (asc) {
      return a.lastMessageAt - b.lastMessageAt;
    }
    return b.lastMessageAt - a.lastMessageAt;
  });
  return topics;
};

/**
 * Get Topic Messages
 * @param ctx
 * @param topicId
 * @param nextToken
 * @returns {Promise<{nextToken: (string|null), items: *}>}
 */
export const getTopicMessages = async (ctx, topicId, nextToken) => {
  const { db } = ctx;
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": { S: `TOPIC#${topicId}` },
      ":sk": { S: "MESSAGE#" },
    },
  };
  if (nextToken) {
    params.ExclusiveStartKey = JSON.parse(
      Buffer.from(nextToken, "base64").toString("utf-8"),
    );
  }
  try {
    const { Items, LastEvaluatedKey } = await db.send(new QueryCommand(params));
    const items = Items.map((item) => unmarshall(item));
    return {
      items,
      nextToken: LastEvaluatedKey
        ? Buffer.from(JSON.stringify(LastEvaluatedKey)).toString("base64")
        : null,
    };
  } catch (err) {
    throw err;
  }
};

/**
 * Create Topic
 * @param ctx
 * @param name
 * @param description
 * @param tagIds
 * @returns {Promise<{createdAt: number, SK: string, name, description, PK: string, id: string, userId, tags, updatedAt: number}>}
 */
export const createTopic = async (ctx, { name, description, tagIds }) => {
  const {
    user: { id: userId },
    db,
  } = ctx;
  const id = ulid();
  const unix = getUnixTime(new Date());
  const item = {
    PK: `USER#${userId}`,
    SK: `TOPIC#${id}`,
    id,
    name,
    description,
    userId,
    pinned: false,
    pinnedAt: unix,
    entity: "TOPIC",
    createdAt: unix,
    updatedAt: unix,
  };
  try {
    await db.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item, {
          removeUndefinedValues: true,
        }),
      }),
    );
    return item;
  } catch (err) {
    throw err;
  }
};

/**
 * Update Topic
 * @param ctx
 * @param id
 * @param input
 * @returns {Promise<*&{SK: string, PK: string, id, updatedAt: number}>}
 */
export const updateTopic = async (ctx, id, input) => {
  if (!id) {
    throw new Error("Topic ID is required");
  }
  const { user, db } = ctx;
  const unix = getUnixTime(new Date());
  const userId = input.userId || user.id;
  const item = {
    PK: `USER#${userId}`,
    SK: `TOPIC#${id}`,
    id,
    ...input,
    updatedAt: unix,
  };
  try {
    await db.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item, {
          removeUndefinedValues: true,
        }),
      }),
    );
    return item;
  } catch (err) {
    throw err;
  }
};

/**
 * Get Topic
 * @param ctx
 * @param id
 * @returns {Promise<Record<string, any>>}
 */
export const getTopic = async (ctx, id) => {
  const {
    db,
    user: { id: userId },
  } = ctx;
  const { Item } = await db.send(
    new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: { S: `USER#${userId}` },
        SK: { S: `TOPIC#${id}` },
      },
    }),
  );
  return unmarshall(Item);
};

/**
 * Create Message
 * @param ctx
 * @param topicId
 * @param id
 * @param role
 * @param content
 * @param files
 * @param model
 * @param sourceDocuments
 * @returns {Promise<{createdAt: number, SK: string, PK: string, id, role, content, files, model, userId, topicId, sourceDocuments, updatedAt: number}>}
 */
export const createMessage = async (
  ctx,
  topicId,
  { id, role, content, files, model, sourceDocuments },
) => {
  const {
    user: { id: userId },
    db,
  } = ctx;
  const unix = getUnixTime(new Date());
  const item = {
    PK: `TOPIC#${topicId}`,
    SK: `MESSAGE#${id}`,
    id,
    role,
    content,
    files,
    model,
    userId,
    topicId,
    sourceDocuments,
    entity: "MESSAGE",
    createdAt: unix,
    updatedAt: unix,
  };
  try {
    await db.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item, {
          removeUndefinedValues: true,
        }),
      }),
    );
    await db.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          PK: { S: `USER#${userId}` },
          SK: { S: `TOPIC#${topicId}` },
        },
        UpdateExpression: "SET lastMessageAt = :lastMessageAt",
        ExpressionAttributeValues: {
          ":lastMessageAt": { N: `${unix}` },
        },
      }),
    );

    return item;
  } catch (err) {
    throw err;
  }
};

/**
 * Delete Topic
 * @param ctx
 * @param userId
 * @param id
 * @returns {Promise<void>}
 */
export const deleteTopic = async (ctx, userId, id) => {
  const { db } = ctx;
  try {
    await db.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          PK: { S: `USER#${userId}` },
          SK: { S: `TOPIC#${id}` },
        },
      }),
    );
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get Tags
 * @param ctx
 * @returns {Promise<*|*[]>}
 */
export const getTags = async (ctx) => {
  const { db } = ctx;
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": { S: `TAG` },
      ":sk": { S: `TAG#` },
    },
  };
  try {
    const { Items } = await db.send(new QueryCommand(params));
    const tags = Items.map((item) => unmarshall(item));
    return tags || [];
  } catch (err) {
    throw err;
  }
};

/**
 * Create Tag
 * @param ctx
 * @param id
 * @param displayName
 * @param userId
 * @param content
 * @param categoryId
 * @param attachments
 * @returns {Promise<{createdAt: number, attachments, displayName, SK: string, PK: string, id, userId, content, categoryId,updatedAt: number}>}
 */
export const createTag = async (
  ctx,
  { id, displayName, userId, content, categoryId, attachments },
) => {
  const { user, db } = ctx;
  const unix = getUnixTime(new Date());
  const item = {
    PK: `TAG`,
    SK: `TAG#${id}`,
    id,
    displayName,
    content,
    categoryId,
    attachments,
    userId: userId || user.id,
    entity: "TAG",
    createdAt: unix,
    updatedAt: unix,
  };
  try {
    await db.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item, {
          removeUndefinedValues: true,
        }),
      }),
    );
    return item;
  } catch (err) {
    throw err;
  }
};

/**
 * Get Tag by ID
 * @param ctx
 * @param id
 * @returns {Promise<Record<string, any>>}
 */
export const getTag = async (ctx, id) => {
  const { db } = ctx;
  const { Item } = await db.send(
    new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: { S: `TAG` },
        SK: { S: `TAG#${id}` },
      },
    }),
  );
  if (!Item) return null;
  return unmarshall(Item);
};

export const updateTag = async (ctx, id, input) => {
  if (!id) {
    throw new Error("Tag ID is required");
  }
  const { db } = ctx;
  const unix = getUnixTime(new Date());
  const item = {
    PK: `TAG`,
    SK: `TAG#${id}`,
    id,
    ...input,
    updatedAt: unix,
  };
  try {
    await db.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item, {
          removeUndefinedValues: true,
        }),
      }),
    );
    return item;
  } catch (err) {
    throw err;
  }
};

/**
 * Delete Tag
 * @param ctx
 * @param id
 * @returns {Promise<boolean>}
 */
export const deleteTag = async (ctx, id) => {
  const { db } = ctx;

  try {
    await db.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          PK: { S: `TAG` },
          SK: {
            S: `TAG#${id}`,
          },
        },
      }),
    );
    return true;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get Prompts
 * @param ctx
 * @returns {Promise<*|*[]>}
 */
export const getPrompts = async (ctx) => {
  const { db } = ctx;
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": { S: `USER#${ctx.user.id}` },
      ":sk": { S: "PROMPT#" },
    },
  };
  try {
    const { Items } = await db.send(new QueryCommand(params));
    const prompts = Items.map((item) => unmarshall(item));
    return prompts || [];
  } catch (err) {
    throw err;
  }
};

/**
 * Create Prompt
 * @param ctx
 * @param title
 * @param description
 * @returns {Promise<{createdAt: number, SK: string, description, PK: string, id: string, title, updatedAt: number}>}
 */

export const createPrompt = async (ctx, { title, description }) => {
  const {
    db,
    user: { id: userId },
  } = ctx;

  const id = ulid();
  const unix = getUnixTime(new Date());
  const item = {
    PK: `USER#${userId}`,
    SK: `PROMPT#${id}`,
    id,
    title,
    description,
    userId,
    entity: "PROMPT",
    createdAt: unix,
    updatedAt: unix,
  };
  try {
    await db.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item, {
          removeUndefinedValues: true,
        }),
      }),
    );
    return item;
  } catch (err) {
    throw err;
  }
};

/**
 * Delete Prompt
 * @param ctx
 * @param id
 * @returns {Promise<boolean>}
 */

export const deletePrompt = async (ctx, id) => {
  const { db, user } = ctx;
  try {
    await db.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          PK: { S: `USER#${user.id}` },
          SK: { S: `PROMPT#${id}` },
        },
      }),
    );
    return true;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get Message
 * @param ctx
 * @param topicId
 * @param messageId
 * @returns {Promise<Record<string, any>>}
 */
export const getMessage = async (ctx, topicId, messageId) => {
  const { db } = ctx;
  const { Item } = await db.send(
    new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: { S: `TOPIC#${topicId}` },
        SK: { S: `MESSAGE#${messageId}` },
      },
    }),
  );
  return unmarshall(Item);
};

/**
 * Update Message
 * @param ctx
 * @param topicId
 * @param messageId
 * @param message
 * @returns {Promise<*&{SK: string, PK: string, updatedAt: number}>}
 */
export const updateMessage = async (ctx, topicId, messageId, message) => {
  const { db } = ctx;
  const item = {
    PK: `TOPIC#${topicId}`,
    SK: `MESSAGE#${messageId}`,
    ...message,
    updatedAt: getUnixTime(new Date()),
  };
  try {
    await db.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item, {
          removeUndefinedValues: true,
        }),
      }),
    );
    return item;
  } catch (err) {
    throw err;
  }
};

/**
 * Delete Messages
 * @param ctx
 * @param topicId
 * @param messageIds
 * @returns {Promise<void>}
 */
export const deleteMessages = async (ctx, topicId, messageIds) => {
  const { db } = ctx;
  const params = {
    RequestItems: {
      [process.env.TABLE_NAME]: messageIds.map((id) => ({
        DeleteRequest: {
          Key: {
            PK: { S: `TOPIC#${topicId}` },
            SK: { S: `MESSAGE#${id}` },
          },
        },
      })),
    },
  };
  try {
    await db.send(new BatchWriteItemCommand(params));
  } catch (err) {
    throw err;
  }
};

/**
 * Get all categories
 * @param ctx
 * @returns {Promise<*|*[]>}
 */
export const getCategories = async (ctx) => {
  // save all categories in one record
  const { db } = ctx;
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: "PK = :pk AND begins_with(SK, :sk)",
    ExpressionAttributeValues: {
      ":pk": { S: `CATEGORY` },
      ":sk": { S: `CATEGORY#` },
    },
  };
  try {
    const { Items } = await db.send(new QueryCommand(params));
    const categories = Items.map((item) => unmarshall(item));
    return categories || [];
  } catch (err) {
    throw err;
  }
};

export const addCategory = async (ctx, { title, description, userId }) => {
  const { db, user } = ctx;
  const unix = getUnixTime(new Date());
  const id = ulid();
  const item = {
    PK: `CATEGORY`,
    SK: `CATEGORY#${id}`,
    id,
    title,
    description,
    userId: userId || user.id,
    createdAt: unix,
    updatedAt: unix,
  };
  try {
    await db.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item, {
          removeUndefinedValues: true,
        }),
      }),
    );
    return item;
  } catch (err) {
    throw err;
  }
};

/**
 * Edit category
 * @param ctx
 * @param id
 * @param input
 * @returns {Promise<*&{SK: string, PK: string, id, updatedAt: number}>}
 */
export const editCategory = async (ctx, id, input) => {
  const { db } = ctx;
  const unix = getUnixTime(new Date());
  const item = {
    PK: `CATEGORY`,
    SK: `CATEGORY#${id}`,
    id,
    ...input,
    updatedAt: unix,
  };
  try {
    await db.send(
      new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item, {
          removeUndefinedValues: true,
        }),
      }),
    );
    return item;
  } catch (err) {
    throw err;
  }
};

/**
 * Delete Category
 * @param ctx
 * @param id
 * @returns {Promise<boolean>}
 */
export const deleteCategory = async (ctx, id) => {
  const { db } = ctx;
  try {
    await db.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          PK: { S: `CATEGORY` },
          SK: { S: `CATEGORY#${id}` },
        },
      }),
    );
    return true;
  } catch (err) {
    console.log(err);
  }
};

/**
 *  Get Category
 * @param ctx
 * @param id
 * @returns {Promise<Record<string, any>|null>}
 */
export const getCategory = async (ctx, id) => {
  const { db } = ctx;
  const { Item } = await db.send(
    new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: { S: `CATEGORY` },
        SK: { S: `CATEGORY#${id}` },
      },
    }),
  );
  if (!Item) return null;
  return unmarshall(Item);
};
