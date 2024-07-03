import { ApolloServer } from "@apollo/server";
import {
  handlers,
  startServerAndCreateLambdaHandler,
} from "@as-integrations/aws-lambda";
import { DynamoDBClient, BatchGetItemCommand } from "@aws-sdk/client-dynamodb";
import {
  addCategory,
  createMessage,
  createPrompt,
  createTag,
  createTopic,
  createUser,
  deleteCategory,
  deleteMessages,
  deletePrompt,
  deleteTag,
  deleteTopic,
  deleteUser,
  editCategory,
  getCategories,
  getCategory,
  getMessage,
  getPrompts,
  getTag,
  getTags,
  getTopic,
  getTopicMessages,
  getUserByEmail,
  getUserByID,
  getUsers,
  getUserTopics,
  saveUser,
  updateMessage,
  updateTag,
  updateTopic,
} from "./model.js";
import {
  comparePassword,
  generateToken,
  getFileContent,
  getSignedUrlForDownload,
  hashPassword,
  isAdministrator,
  presignedUrl,
  validateEmail,
  validatePassword,
  verifyToken,
} from "./utils.js";
import { getUnixTime } from "date-fns";
import { S3Client } from "@aws-sdk/client-s3";
import { ulid } from "ulid";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const typeDefs = `#graphql
enum UserRole {
    admin
    user
}
enum MessageRole {
    assistant
    user
}
type User {
    id: ID!
    name: String!
    email: String!
    avatar: String
    avatarUrl: String
    role: UserRole!
    phone: String
    createdAt: Int!
    updatedAt: Int
}
input UpdateUserInput {
    email:String
    name: String
    phone: String
    avatar: String
    currentPassword: String
    newPassword: String
    role: UserRole
}
type Source {
    id: ID!
    filename: String!
    content: String!
}
input SourceInput {
    id: ID!
    filename: String!
    content: String!
}
type File{
    id: ID!
    filename: String!
    content: String
    contentType: String!
    url: String
}
input FileInput{
    id: ID!
    filename: String!
    content: String
    contentType: String!
}
type Tag {
    id: ID!
    displayName: String!
    content: String!
    categoryId: ID
    category: Category
    attachments: [File!]
    userId: ID!
    user: User!
}
input TagInput {
    id: ID!
    categoryId: ID
    displayName: String!
    content: String!
    attachments: [FileInput!]
    userId: ID
}
type Prompt {
    id: ID!
    title: String!
    description: String!
}
type Topic {
    id: ID!
    name: String!
    aiTitle: String
    description: String!
    tags: [Tag!]
    createdAt: Int!
    updatedAt: Int!
    lastMessageAt: Int
    pinned: Boolean
    pinnedAt: Int
}
input CreateTopicInput {
    name: String!
    description: String!
    tagIds: [ID!]
}
input UpdateTopicInput {
    aiTitle: String
    name: String
    description: String
    tagIds: [ID!]
}
type Message {
    id: ID!
    role: MessageRole!
    content: String!
    files: [File!]
    model: String
    sourceDocuments: [Source!]
    localStatusError:Boolean
    createdAt: Int!
    updatedAt: Int
}
input CreateMessageInput {
    id: ID!
    role: MessageRole!
    content: String!
    files: [FileInput!]
    model: String
    sourceDocuments: [SourceInput!]
}
input UpdateMessageInput{
    content: String
    files: [FileInput!]
    model: String
    sourceDocuments: [SourceInput!]
}
type Viewer {
    user: User
    token: String
}
type MessageConnection {
    items: [Message!]
    nextToken: String
}

type PresignedUploadUrlResponse{
    url: String!
    key: String!
}
type UserConnection {
    items: [User!]
    nextToken: String
}
type Category {
    id: ID!
    title: String!
    description: String
    createdAt: Int!
    userId: ID!
    user: User!
}
type Query {
    viewer: Viewer!
    topics(search:String, pinned:Boolean, asc: Boolean ): [Topic!]!
    topic(id: ID!): Topic!
    messages(topicId: ID!, nextToken: String): MessageConnection!
    tags: [Tag!]!
    prompts: [Prompt!]!
    users(nextToken: String): UserConnection!
    getFileContent(key: String!): String
    categories: [Category!]!
}

type Mutation {
    addCategory(title: String!, description:String): Category!
    editCategory(id: ID!, title: String!, description:String, userId: ID): Category!
    deleteCategory(id: ID!): Boolean!
    createTopic(input: CreateTopicInput!): Topic!
    updateTopic(id: ID!, input: UpdateTopicInput!): Topic!
    pinTopic(id: ID!): Topic!
    unpinTopic(id: ID!): Topic!
    deleteTopic(id: ID!): Boolean!
    createMessage(topicId: ID!, input: CreateMessageInput!): Message!
    updateMessage(topicId: ID!, messageId: ID!, input: UpdateMessageInput!): Message!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    createUser(name: String!, email: String!, password: String!): User!
    deleteUser(id: ID!): Boolean!
    register(name: String!,email: String!, password: String!): Viewer!
    login(email: String!, password: String!): Viewer!
    updateMyAccount(input: UpdateUserInput!): Viewer!
    presignedUploadUrl(filename: String!, contentType: String!, prefix: String): PresignedUploadUrlResponse!
    createTag(input: TagInput!): Tag!
    updateTag(input: TagInput!): Tag!
    deleteTag(id: ID!): Boolean!
    createPrompt(title: String!, description: String!): Prompt!
    deletePrompt(id: ID!): Boolean!
}
`;
const Query = {
  viewer: async (parent, args, context) => {
    const { user, token } = context;
    return {
      user,
      token,
    };
  },
  categories: async (_, __, context) => {
    return await getCategories(context);
  },
  getFileContent: async (parent, { key }, context) => {
    return await getFileContent(context, key);
  },
  topic: async (parent, { id }, context) => {
    return getTopic(context, id);
  },
  topics: async (parent, { search, pinned, asc }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    return await getUserTopics(context, user.id, pinned, asc, search);
  },
  messages: async (parent, { topicId, nextToken }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    return await getTopicMessages(context, topicId, nextToken);
  },
  tags: async (_, __, context) => {
    return await getTags(context);
  },
  prompts: async (_, __, context) => {
    return await getPrompts(context);
  },
  users: async (_, { nextToken }, context) => {
    const { user } = context;
    if (!user || !isAdministrator(user)) {
      throw new Error("Unauthorized");
    }
    return await getUsers(context, { nextToken });
  },
};
const Mutation = {
  addCategory: async (_, { title, description }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const userId = user.id;
    return await addCategory(context, { title, description, userId });
  },
  editCategory: async (_, { id, title, description, userId }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const category = await getCategory(context, id);
    if (!category) {
      throw new Error("Category not found");
    }
    if (category.userId !== user.id && !isAdministrator(user)) {
      throw new Error("Unauthorized");
    }
    let updateValues = {
      ...category,
      title,
    };
    if (description !== undefined) {
      updateValues.description = description;
    }
    if (userId) {
      updateValues.userId = userId;
    }
    return await editCategory(context, id, updateValues);
  },
  deleteCategory: async (_, { id }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const category = await getCategory(context, id);
    if (!category) {
      throw new Error("Category not found");
    }
    if (category.userId !== user.id && !isAdministrator(user)) {
      throw new Error("Unauthorized");
    }
    return await deleteCategory(context, id);
  },
  pinTopic: async (parent, { id }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const topic = await getTopic(context, id);
    if (!topic) {
      throw new Error("Topic not found");
    }
    if (user.role !== "admin" && topic.userId !== user.id) {
      throw new Error("Unauthorized");
    }
    const unixTime = getUnixTime(new Date());
    topic.pinned = true;
    topic.pinnedAt = unixTime;
    return await updateTopic(context, id, topic);
  },
  unpinTopic: async (parent, { id }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const topic = await getTopic(context, id);
    if (!topic) {
      throw new Error("Topic not found");
    }
    if (user.role !== "admin" && topic.userId !== user.id) {
      throw new Error("Unauthorized");
    }
    topic.pinned = false;
    return await updateTopic(context, id, topic);
  },
  createTopic: async (parent, { input }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const topic = await createTopic(context, input);
    await createMessage(context, topic.id, {
      id: ulid(),
      role: "assistant",
      content: "Hello! How can I help you today?",
      files: [],
      sourceDocuments: [],
    });
    return topic;
  },
  updateTopic: async (parent, { id, input }, context) => {
    const topic = await getTopic(context, id);
    if (!topic) {
      throw new Error("Topic not found");
    }
    const updateValues = {
      ...topic,
      ...input,
    };
    return await updateTopic(context, id, updateValues);
  },
  createMessage: async (parent, { topicId, input }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    return await createMessage(context, topicId, input);
  },
  updateMessage: async (parent, { topicId, messageId, input }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const message = await getMessage(context, topicId, messageId);
    if (!message) {
      throw new Error("Message not found");
    }
    const updateValues = {
      ...message,
      ...input,
    };
    const updated = await updateMessage(
      context,
      topicId,
      messageId,
      updateValues,
    );
    if (message.role === "user") {
      let messages = [];
      let nextToken = null;
      do {
        const response = await getTopicMessages(context, topicId, nextToken);
        messages = messages.concat(response.items);
        nextToken = response.nextToken;
      } while (nextToken);

      let batchDelete = [];
      let shouldDelete = false;
      messages.map((m) => {
        if (shouldDelete) {
          batchDelete.push(m.id);
        }
        if (m.id === messageId) {
          shouldDelete = true;
        }
      });
      if (batchDelete.length > 0) {
        await deleteMessages(context, topicId, batchDelete);
      }
    }
    return updated;
  },
  deleteTopic: async (parent, { id }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    try {
      await deleteTopic(context, user.id, id);
      return true;
    } catch (err) {
      console.log(err);
    }
  },
  register: async (_, { name, email, password }, context) => {
    try {
      const user = await createUser(context, { name, email, password });
      const token = generateToken(user.id);
      return {
        user,
        token,
      };
    } catch (e) {
      throw e;
    }
  },
  login: async (parent, { email, password }, context) => {
    const { db } = context;
    const user = await getUserByEmail(context, email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    if (!comparePassword(password, user.password)) {
      throw new Error("Invalid email or password");
    }
    const token = generateToken(user.id);
    return {
      user,
      token,
    };
  },
  createUser: async (parent, { name, email, password }, context) => {
    const { user } = context;
    if (!user || !isAdministrator(user)) {
      throw new Error("Unauthorized");
    }
    return await createUser(context, { name, email, password });
  },
  deleteUser: async (parent, { id }, context) => {
    const { user } = context;
    if (!user || !isAdministrator(user)) {
      throw new Error("Unauthorized");
    }
    await deleteUser(context, id);
    return true;
  },
  updateUser: async (parent, { id, input }, context) => {
    const { user } = context;
    const { role, name, phone, avatar, newPassword, currentPassword } = input;
    if (!user) {
      throw new Error("Unauthorized");
    }
    if (user.role !== "admin" && user.id !== id) {
      throw new Error("Unauthorized");
    }
    if (role && !isAdministrator(user)) {
      throw new Error("Unauthorized");
    }
    const updateValues = {};
    if (avatar) {
      updateValues.avatar = avatar;
    }
    if (role) {
      updateValues.role = role;
    }
    if (name) {
      updateValues.name = name;
    }
    if (phone) {
      updateValues.phone = phone;
    }
    if (newPassword) {
      if (!validatePassword(newPassword)) {
        throw new Error("Password must be at least 5 characters long");
      }
      if (!isAdministrator()) {
        if (!currentPassword) {
          throw new Error("Current password is required");
        }
        if (!comparePassword(currentPassword, user.password)) {
          throw new Error("Invalid current password");
        }
      }
      updateValues.password = hashPassword(newPassword);
    }
    const u = await getUserByID(context.db, id);
    if (!u) {
      throw new Error("User not found");
    }
    if (input.email && input.email !== u.email) {
      if (!validateEmail(input.email)) {
        throw new Error("Invalid email");
      }
      updateValues.email = input.email.toLowerCase();
      const findByEmail = await getUserByEmail(context, updateValues.email);
      if (findByEmail && findByEmail.id !== id) {
        throw new Error("Email already in use");
      }
    }
    const result = { ...u, ...updateValues };
    await saveUser(context, result);
    return result;
  },
  updateMyAccount: async (parent, { input }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const { name, phone, currentPassword, newPassword, avatar } = input;
    if (currentPassword && !comparePassword(currentPassword, user.password)) {
      throw new Error("Invalid current password");
    }
    if (newPassword) {
      if (!validatePassword(newPassword)) {
        throw new Error("Password must be at least 5 characters long");
      }
      user.password = hashPassword(newPassword);
    }
    if (input.email && input.email !== user.email) {
      if (!validateEmail(input.email)) {
        throw new Error("Invalid email");
      }
      user.email = input.email.toLowerCase();
      const findByEmail = await getUserByEmail(context, user.email);
      if (findByEmail && findByEmail.id !== user.id) {
        throw new Error("Email already in use");
      }
    }
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.avatar = avatar || user.avatar;
    user.updatedAt = getUnixTime(new Date());
    await saveUser(context, user);
    return {
      user,
      token: generateToken(user.id),
    };
  },
  presignedUploadUrl: async (
    parent,
    { filename, contentType, prefix },
    context,
  ) => {
    return await presignedUrl(context, { filename, contentType, prefix });
  },
  createTag: async (parent, { input }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const { userId } = input;
    if (!isAdministrator(user) && userId && userId !== user.id) {
      throw new Error("Unauthorized");
    }
    if (!userId) {
      input.userId = user.id;
    }
    return await createTag(context, input);
  },
  updateTag: async (parent, { input }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const tag = await getTag(context, input.id);
    if (!tag) {
      throw new Error("Tag not found");
    }
    if (tag.userId !== user.id && !isAdministrator(user)) {
      throw new Error("Unauthorized");
    }
    const { userId } = input;
    if (!isAdministrator(user) && userId && userId !== user.id) {
      throw new Error("Unauthorized");
    }
    const updateValues = {
      ...tag,
      ...input,
    };
    return await updateTag(context, tag.id, updateValues);
  },
  deleteTag: async (parent, { id }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    const tag = await getTag(context, id);
    if (!tag) {
      throw new Error("Tag not found");
    }
    if (tag.userId !== user.id && !isAdministrator(user)) {
      throw new Error("Unauthorized");
    }
    await deleteTag(context, id);
    return true;
  },
  createPrompt: async (_, { title, description }, context) => {
    const { user } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    return await createPrompt(context, { title, description });
  },
  deletePrompt: async (_, { id }, context) => {
    const { user, db } = context;
    if (!user) {
      throw new Error("Unauthorized");
    }
    return await deletePrompt(context, id);
  },
};
const resolvers = {
  User: {
    role: (parent) => {
      return parent.role || "user";
    },
    avatarUrl: (parent, _, context) => {
      return parent.avatar
        ? getSignedUrlForDownload(context, parent.avatar)
        : null;
    },
  },
  File: {
    url: (parent, _, context) => {
      return getSignedUrlForDownload(context, parent.id);
    },
  },
  Tag: {
    category: async (parent, _, context) => {
      if (!parent.categoryId) {
        return null;
      }
      try {
        return await getCategory(context, parent.categoryId);
      } catch (e) {
        return null;
      }
    },
    user: async (parent, _, context) => {
      return await getUserByID(context.db, parent.userId);
    },
  },
  Category: {
    user: async (parent, _, context) => {
      return await getUserByID(context.db, parent.userId);
    },
  },
  Topic: {
    tags: async (parent, _, context) => {
      if (!parent.tagIds || parent.tagIds.length === 0) {
        return [];
      }
      let tags = [];
      const { db } = context;
      const tableName = process.env.TABLE_NAME;
      const params = {
        RequestItems: {
          [tableName]: {
            Keys: parent.tagIds.map((tagId) => ({
              PK: { S: "TAG" },
              SK: { S: `TAG#${tagId}` },
            })),
          },
        },
      };
      const result = await db.send(new BatchGetItemCommand(params));
      if (!result.Responses) {
        return [];
      }
      if (!result.Responses[tableName]) {
        return [];
      }
      for (const item of result.Responses[tableName]) {
        const tag = unmarshall(item);
        tags.push(tag);
      }
      return tags.sort((t1, t2) => {
        return t1.displayName.localeCompare(t2.displayName);
      });
    },
  },
  Query,
  Mutation,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const env = process.env.NODE_ENV || "production";
const isDev = env === "development";
const db = new DynamoDBClient({
  region: isDev ? "localhost" : process.env.AWS_REGION,
  endpoint: isDev ? "http://localhost:8000" : undefined,
  credentials: isDev && {
    accessKeyId: "MockAccessKeyId",
    secretAccessKey: "MockSecretAccessKey",
  },
});
const s3 = new S3Client({
  region: process.env.AWS_REGION,
});
export const graphqlHandler = startServerAndCreateLambdaHandler(
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context: async ({ event, context }) => {
      let token = event.headers.authorization || "";
      token = token.replace("Bearer ", "");
      let user = null;
      if (token) {
        try {
          const id = await verifyToken(token);
          if (id) {
            user = await getUserByID(db, id);
          }
        } catch (e) {
          console.log(e);
        }
      }
      return {
        token,
        user,
        db,
        s3,
      };
    },
  },
);
