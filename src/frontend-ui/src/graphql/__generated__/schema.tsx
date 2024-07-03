import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
  user: User;
  userId: Scalars['ID']['output'];
};

export type CreateMessageInput = {
  content: Scalars['String']['input'];
  files?: InputMaybe<Array<FileInput>>;
  id: Scalars['ID']['input'];
  model?: InputMaybe<Scalars['String']['input']>;
  role: MessageRole;
  sourceDocuments?: InputMaybe<Array<SourceInput>>;
};

export type CreateTopicInput = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type File = {
  __typename?: 'File';
  content?: Maybe<Scalars['String']['output']>;
  contentType: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type FileInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  contentType: Scalars['String']['input'];
  filename: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  createdAt: Scalars['Int']['output'];
  files?: Maybe<Array<File>>;
  id: Scalars['ID']['output'];
  localStatusError?: Maybe<Scalars['Boolean']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  role: MessageRole;
  sourceDocuments?: Maybe<Array<Source>>;
  updatedAt?: Maybe<Scalars['Int']['output']>;
};

export type MessageConnection = {
  __typename?: 'MessageConnection';
  items?: Maybe<Array<Message>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export enum MessageRole {
  Assistant = 'assistant',
  User = 'user'
}

export type Mutation = {
  __typename?: 'Mutation';
  addCategory: Category;
  createMessage: Message;
  createPrompt: Prompt;
  createTag: Tag;
  createTopic: Topic;
  createUser: User;
  deleteCategory: Scalars['Boolean']['output'];
  deletePrompt: Scalars['Boolean']['output'];
  deleteTag: Scalars['Boolean']['output'];
  deleteTopic: Scalars['Boolean']['output'];
  deleteUser: Scalars['Boolean']['output'];
  editCategory: Category;
  login: Viewer;
  pinTopic: Topic;
  presignedUploadUrl: PresignedUploadUrlResponse;
  register: Viewer;
  unpinTopic: Topic;
  updateMessage: Message;
  updateMyAccount: Viewer;
  updateTag: Tag;
  updateTopic: Topic;
  updateUser: User;
};


export type MutationAddCategoryArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};


export type MutationCreateMessageArgs = {
  input: CreateMessageInput;
  topicId: Scalars['ID']['input'];
};


export type MutationCreatePromptArgs = {
  description: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


export type MutationCreateTagArgs = {
  input: TagInput;
};


export type MutationCreateTopicArgs = {
  input: CreateTopicInput;
};


export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletePromptArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTagArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTopicArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};


export type MutationEditCategoryArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationPinTopicArgs = {
  id: Scalars['ID']['input'];
};


export type MutationPresignedUploadUrlArgs = {
  contentType: Scalars['String']['input'];
  filename: Scalars['String']['input'];
  prefix?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUnpinTopicArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateMessageArgs = {
  input: UpdateMessageInput;
  messageId: Scalars['ID']['input'];
  topicId: Scalars['ID']['input'];
};


export type MutationUpdateMyAccountArgs = {
  input: UpdateUserInput;
};


export type MutationUpdateTagArgs = {
  input: TagInput;
};


export type MutationUpdateTopicArgs = {
  id: Scalars['ID']['input'];
  input: UpdateTopicInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};

export type PresignedUploadUrlResponse = {
  __typename?: 'PresignedUploadUrlResponse';
  key: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type Prompt = {
  __typename?: 'Prompt';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  title: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  categories: Array<Category>;
  getFileContent?: Maybe<Scalars['String']['output']>;
  messages: MessageConnection;
  prompts: Array<Prompt>;
  tags: Array<Tag>;
  topic: Topic;
  topics: Array<Topic>;
  users: UserConnection;
  viewer: Viewer;
};


export type QueryGetFileContentArgs = {
  key: Scalars['String']['input'];
};


export type QueryMessagesArgs = {
  nextToken?: InputMaybe<Scalars['String']['input']>;
  topicId: Scalars['ID']['input'];
};


export type QueryTopicArgs = {
  id: Scalars['ID']['input'];
};


export type QueryTopicsArgs = {
  asc?: InputMaybe<Scalars['Boolean']['input']>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUsersArgs = {
  nextToken?: InputMaybe<Scalars['String']['input']>;
};

export type Source = {
  __typename?: 'Source';
  content: Scalars['String']['output'];
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
};

export type SourceInput = {
  content: Scalars['String']['input'];
  filename: Scalars['String']['input'];
  id: Scalars['ID']['input'];
};

export type Tag = {
  __typename?: 'Tag';
  attachments?: Maybe<Array<File>>;
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['ID']['output']>;
  content: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  user: User;
  userId: Scalars['ID']['output'];
};

export type TagInput = {
  attachments?: InputMaybe<Array<FileInput>>;
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  content: Scalars['String']['input'];
  displayName: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  userId?: InputMaybe<Scalars['ID']['input']>;
};

export type Topic = {
  __typename?: 'Topic';
  aiTitle?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Int']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastMessageAt?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  pinned?: Maybe<Scalars['Boolean']['output']>;
  pinnedAt?: Maybe<Scalars['Int']['output']>;
  tags?: Maybe<Array<Tag>>;
  updatedAt: Scalars['Int']['output'];
};

export type UpdateMessageInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<Array<FileInput>>;
  model?: InputMaybe<Scalars['String']['input']>;
  sourceDocuments?: InputMaybe<Array<SourceInput>>;
};

export type UpdateTopicInput = {
  aiTitle?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  tagIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdateUserInput = {
  avatar?: InputMaybe<Scalars['String']['input']>;
  currentPassword?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  newPassword?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']['output']>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Int']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  updatedAt?: Maybe<Scalars['Int']['output']>;
};

export type UserConnection = {
  __typename?: 'UserConnection';
  items?: Maybe<Array<User>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export enum UserRole {
  Admin = 'admin',
  User = 'user'
}

export type Viewer = {
  __typename?: 'Viewer';
  token?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type UserFragmentFragment = { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null };

export type CategoryFragmentFragment = { __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } };

export type FileFragmentFragment = { __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null };

export type TagFragmentFragment = { __typename?: 'Tag', id: string, displayName: string, content: string, categoryId?: string | null, userId: string, category?: { __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } | null, attachments?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } };

export type TopicFragmentFragment = { __typename?: 'Topic', id: string, name: string, aiTitle?: string | null, description: string, createdAt: number, updatedAt: number, lastMessageAt?: number | null, pinned?: boolean | null, pinnedAt?: number | null, tags?: Array<{ __typename?: 'Tag', id: string, displayName: string, content: string, categoryId?: string | null, userId: string, category?: { __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } | null, attachments?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } }> | null };

export type MessageFragmentFragment = { __typename?: 'Message', id: string, role: MessageRole, content: string, model?: string | null, localStatusError?: boolean | null, createdAt: number, updatedAt?: number | null, files?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, sourceDocuments?: Array<{ __typename?: 'Source', id: string, filename: string, content: string }> | null };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'Viewer', token?: string | null, user?: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } | null } };

export type ViewerQueryVariables = Exact<{ [key: string]: never; }>;


export type ViewerQuery = { __typename?: 'Query', viewer: { __typename?: 'Viewer', token?: string | null, user?: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } | null } };

export type TagsQueryVariables = Exact<{ [key: string]: never; }>;


export type TagsQuery = { __typename?: 'Query', tags: Array<{ __typename?: 'Tag', id: string, displayName: string, content: string, categoryId?: string | null, userId: string, category?: { __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } | null, attachments?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } }> };

export type CreateTagMutationVariables = Exact<{
  input: TagInput;
}>;


export type CreateTagMutation = { __typename?: 'Mutation', createTag: { __typename?: 'Tag', id: string, displayName: string, content: string, categoryId?: string | null, userId: string, category?: { __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } | null, attachments?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } };

export type DeleteTagMutationVariables = Exact<{
  deleteTagId: Scalars['ID']['input'];
}>;


export type DeleteTagMutation = { __typename?: 'Mutation', deleteTag: boolean };

export type PresignedUploadUrlMutationVariables = Exact<{
  filename: Scalars['String']['input'];
  contentType: Scalars['String']['input'];
  prefix?: InputMaybe<Scalars['String']['input']>;
}>;


export type PresignedUploadUrlMutation = { __typename?: 'Mutation', presignedUploadUrl: { __typename?: 'PresignedUploadUrlResponse', url: string, key: string } };

export type CreateTopicMutationVariables = Exact<{
  input: CreateTopicInput;
}>;


export type CreateTopicMutation = { __typename?: 'Mutation', createTopic: { __typename?: 'Topic', id: string, name: string, aiTitle?: string | null, description: string, createdAt: number, updatedAt: number, lastMessageAt?: number | null, pinned?: boolean | null, pinnedAt?: number | null, tags?: Array<{ __typename?: 'Tag', id: string, displayName: string, content: string, categoryId?: string | null, userId: string, category?: { __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } | null, attachments?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } }> | null } };

export type TopicQueryVariables = Exact<{
  topicId: Scalars['ID']['input'];
}>;


export type TopicQuery = { __typename?: 'Query', topic: { __typename?: 'Topic', id: string, name: string, aiTitle?: string | null, description: string, createdAt: number, updatedAt: number, lastMessageAt?: number | null, pinned?: boolean | null, pinnedAt?: number | null, tags?: Array<{ __typename?: 'Tag', id: string, displayName: string, content: string, categoryId?: string | null, userId: string, category?: { __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } | null, attachments?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } }> | null } };

export type UpdateTopicMutationVariables = Exact<{
  updateTopicId: Scalars['ID']['input'];
  input: UpdateTopicInput;
}>;


export type UpdateTopicMutation = { __typename?: 'Mutation', updateTopic: { __typename?: 'Topic', id: string, name: string, aiTitle?: string | null, description: string, createdAt: number, updatedAt: number, lastMessageAt?: number | null, pinned?: boolean | null, pinnedAt?: number | null, tags?: Array<{ __typename?: 'Tag', id: string, displayName: string, content: string, categoryId?: string | null, userId: string, category?: { __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } | null, attachments?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } }> | null } };

export type MessagesQueryVariables = Exact<{
  topicId: Scalars['ID']['input'];
  nextToken?: InputMaybe<Scalars['String']['input']>;
}>;


export type MessagesQuery = { __typename?: 'Query', messages: { __typename?: 'MessageConnection', nextToken?: string | null, items?: Array<{ __typename?: 'Message', id: string, role: MessageRole, content: string, model?: string | null, localStatusError?: boolean | null, createdAt: number, updatedAt?: number | null, files?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, sourceDocuments?: Array<{ __typename?: 'Source', id: string, filename: string, content: string }> | null }> | null } };

export type PromptsQueryVariables = Exact<{ [key: string]: never; }>;


export type PromptsQuery = { __typename?: 'Query', prompts: Array<{ __typename?: 'Prompt', id: string, title: string, description: string }> };

export type CreateMessageMutationVariables = Exact<{
  topicId: Scalars['ID']['input'];
  input: CreateMessageInput;
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessage: { __typename?: 'Message', id: string, role: MessageRole, content: string, model?: string | null, localStatusError?: boolean | null, createdAt: number, updatedAt?: number | null, files?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, sourceDocuments?: Array<{ __typename?: 'Source', id: string, filename: string, content: string }> | null } };

export type UpdateMessageMutationVariables = Exact<{
  topicId: Scalars['ID']['input'];
  messageId: Scalars['ID']['input'];
  input: UpdateMessageInput;
}>;


export type UpdateMessageMutation = { __typename?: 'Mutation', updateMessage: { __typename?: 'Message', id: string, role: MessageRole, content: string, model?: string | null, localStatusError?: boolean | null, createdAt: number, updatedAt?: number | null, files?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, sourceDocuments?: Array<{ __typename?: 'Source', id: string, filename: string, content: string }> | null } };

export type TopicsQueryVariables = Exact<{
  search?: InputMaybe<Scalars['String']['input']>;
  pinned?: InputMaybe<Scalars['Boolean']['input']>;
  asc?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type TopicsQuery = { __typename?: 'Query', topics: Array<{ __typename?: 'Topic', id: string, name: string, aiTitle?: string | null, description: string, createdAt: number, updatedAt: number, lastMessageAt?: number | null, pinned?: boolean | null, pinnedAt?: number | null, tags?: Array<{ __typename?: 'Tag', id: string, displayName: string, content: string, categoryId?: string | null, userId: string, category?: { __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } | null, attachments?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } }> | null }> };

export type CreatePromptMutationVariables = Exact<{
  title: Scalars['String']['input'];
  description: Scalars['String']['input'];
}>;


export type CreatePromptMutation = { __typename?: 'Mutation', createPrompt: { __typename?: 'Prompt', id: string, title: string, description: string } };

export type DeletePromptMutationVariables = Exact<{
  deletePromptId: Scalars['ID']['input'];
}>;


export type DeletePromptMutation = { __typename?: 'Mutation', deletePrompt: boolean };

export type DeleteTopicMutationVariables = Exact<{
  deleteTopicId: Scalars['ID']['input'];
}>;


export type DeleteTopicMutation = { __typename?: 'Mutation', deleteTopic: boolean };

export type PinTopicMutationVariables = Exact<{
  pinTopicId: Scalars['ID']['input'];
}>;


export type PinTopicMutation = { __typename?: 'Mutation', pinTopic: { __typename?: 'Topic', id: string, name: string, aiTitle?: string | null, description: string, createdAt: number, updatedAt: number, lastMessageAt?: number | null, pinned?: boolean | null, pinnedAt?: number | null, tags?: Array<{ __typename?: 'Tag', id: string, displayName: string, content: string, categoryId?: string | null, userId: string, category?: { __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } | null, attachments?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } }> | null } };

export type UnpinTopicMutationVariables = Exact<{
  unpinTopicId: Scalars['ID']['input'];
}>;


export type UnpinTopicMutation = { __typename?: 'Mutation', unpinTopic: { __typename?: 'Topic', id: string, name: string, aiTitle?: string | null, description: string, createdAt: number, updatedAt: number, lastMessageAt?: number | null, pinned?: boolean | null, pinnedAt?: number | null, tags?: Array<{ __typename?: 'Tag', id: string, displayName: string, content: string, categoryId?: string | null, userId: string, category?: { __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } | null, attachments?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } }> | null } };

export type UsersQueryVariables = Exact<{
  nextToken?: InputMaybe<Scalars['String']['input']>;
}>;


export type UsersQuery = { __typename?: 'Query', users: { __typename?: 'UserConnection', nextToken?: string | null, items?: Array<{ __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null }> | null } };

export type GetFileContentQueryVariables = Exact<{
  key: Scalars['String']['input'];
}>;


export type GetFileContentQuery = { __typename?: 'Query', getFileContent?: string | null };

export type CreateUserMutationVariables = Exact<{
  name: Scalars['String']['input'];
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } };

export type DeleteUserMutationVariables = Exact<{
  deleteUserId: Scalars['ID']['input'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type UpdateUserMutationVariables = Exact<{
  updateUserId: Scalars['ID']['input'];
  input: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } }> };

export type AddCategoryMutationVariables = Exact<{
  title: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
}>;


export type AddCategoryMutation = { __typename?: 'Mutation', addCategory: { __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } };

export type EditCategoryMutationVariables = Exact<{
  editCategoryId: Scalars['ID']['input'];
  title: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type EditCategoryMutation = { __typename?: 'Mutation', editCategory: { __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } };

export type DeleteCategoryMutationVariables = Exact<{
  deleteCategoryId: Scalars['ID']['input'];
}>;


export type DeleteCategoryMutation = { __typename?: 'Mutation', deleteCategory: boolean };

export type CategoriesAndTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesAndTagsQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } }>, tags: Array<{ __typename?: 'Tag', id: string, displayName: string, content: string, categoryId?: string | null, userId: string, category?: { __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } | null, attachments?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } }> };

export type UpdateTagMutationVariables = Exact<{
  input: TagInput;
}>;


export type UpdateTagMutation = { __typename?: 'Mutation', updateTag: { __typename?: 'Tag', id: string, displayName: string, content: string, categoryId?: string | null, userId: string, category?: { __typename?: 'Category', id: string, title: string, description?: string | null, createdAt: number, userId: string, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } | null, attachments?: Array<{ __typename?: 'File', id: string, filename: string, content?: string | null, contentType: string, url?: string | null }> | null, user: { __typename?: 'User', id: string, name: string, email: string, phone?: string | null, role: UserRole, avatar?: string | null, avatarUrl?: string | null, createdAt: number, updatedAt?: number | null } } };

export const UserFragmentFragmentDoc = gql`
    fragment UserFragment on User {
  id
  name
  email
  phone
  role
  avatar
  avatarUrl
  createdAt
  updatedAt
}
    `;
export const CategoryFragmentFragmentDoc = gql`
    fragment CategoryFragment on Category {
  id
  title
  description
  createdAt
  userId
  user {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
export const FileFragmentFragmentDoc = gql`
    fragment FileFragment on File {
  id
  filename
  content
  contentType
  url
}
    `;
export const TagFragmentFragmentDoc = gql`
    fragment TagFragment on Tag {
  id
  displayName
  content
  categoryId
  category {
    ...CategoryFragment
  }
  attachments {
    ...FileFragment
  }
  userId
  user {
    ...UserFragment
  }
}
    ${CategoryFragmentFragmentDoc}
${FileFragmentFragmentDoc}
${UserFragmentFragmentDoc}`;
export const TopicFragmentFragmentDoc = gql`
    fragment TopicFragment on Topic {
  id
  name
  aiTitle
  description
  tags {
    ...TagFragment
  }
  createdAt
  updatedAt
  lastMessageAt
  pinned
  pinnedAt
}
    ${TagFragmentFragmentDoc}`;
export const MessageFragmentFragmentDoc = gql`
    fragment MessageFragment on Message {
  id
  role
  content
  files {
    ...FileFragment
  }
  model
  sourceDocuments {
    id
    filename
    content
  }
  localStatusError
  createdAt
  updatedAt
}
    ${FileFragmentFragmentDoc}`;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    user {
      ...UserFragment
    }
    token
  }
}
    ${UserFragmentFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const ViewerDocument = gql`
    query Viewer {
  viewer {
    user {
      ...UserFragment
    }
    token
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useViewerQuery__
 *
 * To run a query within a React component, call `useViewerQuery` and pass it any options that fit your needs.
 * When your component renders, `useViewerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useViewerQuery({
 *   variables: {
 *   },
 * });
 */
export function useViewerQuery(baseOptions?: Apollo.QueryHookOptions<ViewerQuery, ViewerQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ViewerQuery, ViewerQueryVariables>(ViewerDocument, options);
      }
export function useViewerLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ViewerQuery, ViewerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ViewerQuery, ViewerQueryVariables>(ViewerDocument, options);
        }
export function useViewerSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<ViewerQuery, ViewerQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ViewerQuery, ViewerQueryVariables>(ViewerDocument, options);
        }
export type ViewerQueryHookResult = ReturnType<typeof useViewerQuery>;
export type ViewerLazyQueryHookResult = ReturnType<typeof useViewerLazyQuery>;
export type ViewerSuspenseQueryHookResult = ReturnType<typeof useViewerSuspenseQuery>;
export type ViewerQueryResult = Apollo.QueryResult<ViewerQuery, ViewerQueryVariables>;
export const TagsDocument = gql`
    query Tags {
  tags {
    ...TagFragment
  }
}
    ${TagFragmentFragmentDoc}`;

/**
 * __useTagsQuery__
 *
 * To run a query within a React component, call `useTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useTagsQuery(baseOptions?: Apollo.QueryHookOptions<TagsQuery, TagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TagsQuery, TagsQueryVariables>(TagsDocument, options);
      }
export function useTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TagsQuery, TagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TagsQuery, TagsQueryVariables>(TagsDocument, options);
        }
export function useTagsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TagsQuery, TagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TagsQuery, TagsQueryVariables>(TagsDocument, options);
        }
export type TagsQueryHookResult = ReturnType<typeof useTagsQuery>;
export type TagsLazyQueryHookResult = ReturnType<typeof useTagsLazyQuery>;
export type TagsSuspenseQueryHookResult = ReturnType<typeof useTagsSuspenseQuery>;
export type TagsQueryResult = Apollo.QueryResult<TagsQuery, TagsQueryVariables>;
export const CreateTagDocument = gql`
    mutation CreateTag($input: TagInput!) {
  createTag(input: $input) {
    ...TagFragment
  }
}
    ${TagFragmentFragmentDoc}`;
export type CreateTagMutationFn = Apollo.MutationFunction<CreateTagMutation, CreateTagMutationVariables>;

/**
 * __useCreateTagMutation__
 *
 * To run a mutation, you first call `useCreateTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTagMutation, { data, loading, error }] = useCreateTagMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTagMutation(baseOptions?: Apollo.MutationHookOptions<CreateTagMutation, CreateTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTagMutation, CreateTagMutationVariables>(CreateTagDocument, options);
      }
export type CreateTagMutationHookResult = ReturnType<typeof useCreateTagMutation>;
export type CreateTagMutationResult = Apollo.MutationResult<CreateTagMutation>;
export type CreateTagMutationOptions = Apollo.BaseMutationOptions<CreateTagMutation, CreateTagMutationVariables>;
export const DeleteTagDocument = gql`
    mutation DeleteTag($deleteTagId: ID!) {
  deleteTag(id: $deleteTagId)
}
    `;
export type DeleteTagMutationFn = Apollo.MutationFunction<DeleteTagMutation, DeleteTagMutationVariables>;

/**
 * __useDeleteTagMutation__
 *
 * To run a mutation, you first call `useDeleteTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTagMutation, { data, loading, error }] = useDeleteTagMutation({
 *   variables: {
 *      deleteTagId: // value for 'deleteTagId'
 *   },
 * });
 */
export function useDeleteTagMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTagMutation, DeleteTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTagMutation, DeleteTagMutationVariables>(DeleteTagDocument, options);
      }
export type DeleteTagMutationHookResult = ReturnType<typeof useDeleteTagMutation>;
export type DeleteTagMutationResult = Apollo.MutationResult<DeleteTagMutation>;
export type DeleteTagMutationOptions = Apollo.BaseMutationOptions<DeleteTagMutation, DeleteTagMutationVariables>;
export const PresignedUploadUrlDocument = gql`
    mutation PresignedUploadUrl($filename: String!, $contentType: String!, $prefix: String) {
  presignedUploadUrl(
    filename: $filename
    contentType: $contentType
    prefix: $prefix
  ) {
    url
    key
  }
}
    `;
export type PresignedUploadUrlMutationFn = Apollo.MutationFunction<PresignedUploadUrlMutation, PresignedUploadUrlMutationVariables>;

/**
 * __usePresignedUploadUrlMutation__
 *
 * To run a mutation, you first call `usePresignedUploadUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePresignedUploadUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [presignedUploadUrlMutation, { data, loading, error }] = usePresignedUploadUrlMutation({
 *   variables: {
 *      filename: // value for 'filename'
 *      contentType: // value for 'contentType'
 *      prefix: // value for 'prefix'
 *   },
 * });
 */
export function usePresignedUploadUrlMutation(baseOptions?: Apollo.MutationHookOptions<PresignedUploadUrlMutation, PresignedUploadUrlMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PresignedUploadUrlMutation, PresignedUploadUrlMutationVariables>(PresignedUploadUrlDocument, options);
      }
export type PresignedUploadUrlMutationHookResult = ReturnType<typeof usePresignedUploadUrlMutation>;
export type PresignedUploadUrlMutationResult = Apollo.MutationResult<PresignedUploadUrlMutation>;
export type PresignedUploadUrlMutationOptions = Apollo.BaseMutationOptions<PresignedUploadUrlMutation, PresignedUploadUrlMutationVariables>;
export const CreateTopicDocument = gql`
    mutation CreateTopic($input: CreateTopicInput!) {
  createTopic(input: $input) {
    ...TopicFragment
  }
}
    ${TopicFragmentFragmentDoc}`;
export type CreateTopicMutationFn = Apollo.MutationFunction<CreateTopicMutation, CreateTopicMutationVariables>;

/**
 * __useCreateTopicMutation__
 *
 * To run a mutation, you first call `useCreateTopicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTopicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTopicMutation, { data, loading, error }] = useCreateTopicMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTopicMutation(baseOptions?: Apollo.MutationHookOptions<CreateTopicMutation, CreateTopicMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTopicMutation, CreateTopicMutationVariables>(CreateTopicDocument, options);
      }
export type CreateTopicMutationHookResult = ReturnType<typeof useCreateTopicMutation>;
export type CreateTopicMutationResult = Apollo.MutationResult<CreateTopicMutation>;
export type CreateTopicMutationOptions = Apollo.BaseMutationOptions<CreateTopicMutation, CreateTopicMutationVariables>;
export const TopicDocument = gql`
    query Topic($topicId: ID!) {
  topic(id: $topicId) {
    ...TopicFragment
  }
}
    ${TopicFragmentFragmentDoc}`;

/**
 * __useTopicQuery__
 *
 * To run a query within a React component, call `useTopicQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopicQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopicQuery({
 *   variables: {
 *      topicId: // value for 'topicId'
 *   },
 * });
 */
export function useTopicQuery(baseOptions: Apollo.QueryHookOptions<TopicQuery, TopicQueryVariables> & ({ variables: TopicQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopicQuery, TopicQueryVariables>(TopicDocument, options);
      }
export function useTopicLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopicQuery, TopicQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopicQuery, TopicQueryVariables>(TopicDocument, options);
        }
export function useTopicSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TopicQuery, TopicQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TopicQuery, TopicQueryVariables>(TopicDocument, options);
        }
export type TopicQueryHookResult = ReturnType<typeof useTopicQuery>;
export type TopicLazyQueryHookResult = ReturnType<typeof useTopicLazyQuery>;
export type TopicSuspenseQueryHookResult = ReturnType<typeof useTopicSuspenseQuery>;
export type TopicQueryResult = Apollo.QueryResult<TopicQuery, TopicQueryVariables>;
export const UpdateTopicDocument = gql`
    mutation UpdateTopic($updateTopicId: ID!, $input: UpdateTopicInput!) {
  updateTopic(id: $updateTopicId, input: $input) {
    ...TopicFragment
  }
}
    ${TopicFragmentFragmentDoc}`;
export type UpdateTopicMutationFn = Apollo.MutationFunction<UpdateTopicMutation, UpdateTopicMutationVariables>;

/**
 * __useUpdateTopicMutation__
 *
 * To run a mutation, you first call `useUpdateTopicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTopicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTopicMutation, { data, loading, error }] = useUpdateTopicMutation({
 *   variables: {
 *      updateTopicId: // value for 'updateTopicId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTopicMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTopicMutation, UpdateTopicMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTopicMutation, UpdateTopicMutationVariables>(UpdateTopicDocument, options);
      }
export type UpdateTopicMutationHookResult = ReturnType<typeof useUpdateTopicMutation>;
export type UpdateTopicMutationResult = Apollo.MutationResult<UpdateTopicMutation>;
export type UpdateTopicMutationOptions = Apollo.BaseMutationOptions<UpdateTopicMutation, UpdateTopicMutationVariables>;
export const MessagesDocument = gql`
    query Messages($topicId: ID!, $nextToken: String) {
  messages(topicId: $topicId, nextToken: $nextToken) {
    items {
      ...MessageFragment
    }
    nextToken
  }
}
    ${MessageFragmentFragmentDoc}`;

/**
 * __useMessagesQuery__
 *
 * To run a query within a React component, call `useMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessagesQuery({
 *   variables: {
 *      topicId: // value for 'topicId'
 *      nextToken: // value for 'nextToken'
 *   },
 * });
 */
export function useMessagesQuery(baseOptions: Apollo.QueryHookOptions<MessagesQuery, MessagesQueryVariables> & ({ variables: MessagesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
      }
export function useMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
        }
export function useMessagesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<MessagesQuery, MessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MessagesQuery, MessagesQueryVariables>(MessagesDocument, options);
        }
export type MessagesQueryHookResult = ReturnType<typeof useMessagesQuery>;
export type MessagesLazyQueryHookResult = ReturnType<typeof useMessagesLazyQuery>;
export type MessagesSuspenseQueryHookResult = ReturnType<typeof useMessagesSuspenseQuery>;
export type MessagesQueryResult = Apollo.QueryResult<MessagesQuery, MessagesQueryVariables>;
export const PromptsDocument = gql`
    query Prompts {
  prompts {
    id
    title
    description
  }
}
    `;

/**
 * __usePromptsQuery__
 *
 * To run a query within a React component, call `usePromptsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePromptsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePromptsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePromptsQuery(baseOptions?: Apollo.QueryHookOptions<PromptsQuery, PromptsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PromptsQuery, PromptsQueryVariables>(PromptsDocument, options);
      }
export function usePromptsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PromptsQuery, PromptsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PromptsQuery, PromptsQueryVariables>(PromptsDocument, options);
        }
export function usePromptsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<PromptsQuery, PromptsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<PromptsQuery, PromptsQueryVariables>(PromptsDocument, options);
        }
export type PromptsQueryHookResult = ReturnType<typeof usePromptsQuery>;
export type PromptsLazyQueryHookResult = ReturnType<typeof usePromptsLazyQuery>;
export type PromptsSuspenseQueryHookResult = ReturnType<typeof usePromptsSuspenseQuery>;
export type PromptsQueryResult = Apollo.QueryResult<PromptsQuery, PromptsQueryVariables>;
export const CreateMessageDocument = gql`
    mutation CreateMessage($topicId: ID!, $input: CreateMessageInput!) {
  createMessage(topicId: $topicId, input: $input) {
    ...MessageFragment
  }
}
    ${MessageFragmentFragmentDoc}`;
export type CreateMessageMutationFn = Apollo.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      topicId: // value for 'topicId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, options);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = Apollo.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = Apollo.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
export const UpdateMessageDocument = gql`
    mutation UpdateMessage($topicId: ID!, $messageId: ID!, $input: UpdateMessageInput!) {
  updateMessage(topicId: $topicId, messageId: $messageId, input: $input) {
    ...MessageFragment
  }
}
    ${MessageFragmentFragmentDoc}`;
export type UpdateMessageMutationFn = Apollo.MutationFunction<UpdateMessageMutation, UpdateMessageMutationVariables>;

/**
 * __useUpdateMessageMutation__
 *
 * To run a mutation, you first call `useUpdateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMessageMutation, { data, loading, error }] = useUpdateMessageMutation({
 *   variables: {
 *      topicId: // value for 'topicId'
 *      messageId: // value for 'messageId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMessageMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMessageMutation, UpdateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMessageMutation, UpdateMessageMutationVariables>(UpdateMessageDocument, options);
      }
export type UpdateMessageMutationHookResult = ReturnType<typeof useUpdateMessageMutation>;
export type UpdateMessageMutationResult = Apollo.MutationResult<UpdateMessageMutation>;
export type UpdateMessageMutationOptions = Apollo.BaseMutationOptions<UpdateMessageMutation, UpdateMessageMutationVariables>;
export const TopicsDocument = gql`
    query Topics($search: String, $pinned: Boolean, $asc: Boolean) {
  topics(search: $search, pinned: $pinned, asc: $asc) {
    ...TopicFragment
  }
}
    ${TopicFragmentFragmentDoc}`;

/**
 * __useTopicsQuery__
 *
 * To run a query within a React component, call `useTopicsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTopicsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTopicsQuery({
 *   variables: {
 *      search: // value for 'search'
 *      pinned: // value for 'pinned'
 *      asc: // value for 'asc'
 *   },
 * });
 */
export function useTopicsQuery(baseOptions?: Apollo.QueryHookOptions<TopicsQuery, TopicsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TopicsQuery, TopicsQueryVariables>(TopicsDocument, options);
      }
export function useTopicsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TopicsQuery, TopicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TopicsQuery, TopicsQueryVariables>(TopicsDocument, options);
        }
export function useTopicsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<TopicsQuery, TopicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<TopicsQuery, TopicsQueryVariables>(TopicsDocument, options);
        }
export type TopicsQueryHookResult = ReturnType<typeof useTopicsQuery>;
export type TopicsLazyQueryHookResult = ReturnType<typeof useTopicsLazyQuery>;
export type TopicsSuspenseQueryHookResult = ReturnType<typeof useTopicsSuspenseQuery>;
export type TopicsQueryResult = Apollo.QueryResult<TopicsQuery, TopicsQueryVariables>;
export const CreatePromptDocument = gql`
    mutation CreatePrompt($title: String!, $description: String!) {
  createPrompt(title: $title, description: $description) {
    id
    title
    description
  }
}
    `;
export type CreatePromptMutationFn = Apollo.MutationFunction<CreatePromptMutation, CreatePromptMutationVariables>;

/**
 * __useCreatePromptMutation__
 *
 * To run a mutation, you first call `useCreatePromptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePromptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPromptMutation, { data, loading, error }] = useCreatePromptMutation({
 *   variables: {
 *      title: // value for 'title'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useCreatePromptMutation(baseOptions?: Apollo.MutationHookOptions<CreatePromptMutation, CreatePromptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePromptMutation, CreatePromptMutationVariables>(CreatePromptDocument, options);
      }
export type CreatePromptMutationHookResult = ReturnType<typeof useCreatePromptMutation>;
export type CreatePromptMutationResult = Apollo.MutationResult<CreatePromptMutation>;
export type CreatePromptMutationOptions = Apollo.BaseMutationOptions<CreatePromptMutation, CreatePromptMutationVariables>;
export const DeletePromptDocument = gql`
    mutation DeletePrompt($deletePromptId: ID!) {
  deletePrompt(id: $deletePromptId)
}
    `;
export type DeletePromptMutationFn = Apollo.MutationFunction<DeletePromptMutation, DeletePromptMutationVariables>;

/**
 * __useDeletePromptMutation__
 *
 * To run a mutation, you first call `useDeletePromptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePromptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePromptMutation, { data, loading, error }] = useDeletePromptMutation({
 *   variables: {
 *      deletePromptId: // value for 'deletePromptId'
 *   },
 * });
 */
export function useDeletePromptMutation(baseOptions?: Apollo.MutationHookOptions<DeletePromptMutation, DeletePromptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePromptMutation, DeletePromptMutationVariables>(DeletePromptDocument, options);
      }
export type DeletePromptMutationHookResult = ReturnType<typeof useDeletePromptMutation>;
export type DeletePromptMutationResult = Apollo.MutationResult<DeletePromptMutation>;
export type DeletePromptMutationOptions = Apollo.BaseMutationOptions<DeletePromptMutation, DeletePromptMutationVariables>;
export const DeleteTopicDocument = gql`
    mutation DeleteTopic($deleteTopicId: ID!) {
  deleteTopic(id: $deleteTopicId)
}
    `;
export type DeleteTopicMutationFn = Apollo.MutationFunction<DeleteTopicMutation, DeleteTopicMutationVariables>;

/**
 * __useDeleteTopicMutation__
 *
 * To run a mutation, you first call `useDeleteTopicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTopicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTopicMutation, { data, loading, error }] = useDeleteTopicMutation({
 *   variables: {
 *      deleteTopicId: // value for 'deleteTopicId'
 *   },
 * });
 */
export function useDeleteTopicMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTopicMutation, DeleteTopicMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTopicMutation, DeleteTopicMutationVariables>(DeleteTopicDocument, options);
      }
export type DeleteTopicMutationHookResult = ReturnType<typeof useDeleteTopicMutation>;
export type DeleteTopicMutationResult = Apollo.MutationResult<DeleteTopicMutation>;
export type DeleteTopicMutationOptions = Apollo.BaseMutationOptions<DeleteTopicMutation, DeleteTopicMutationVariables>;
export const PinTopicDocument = gql`
    mutation PinTopic($pinTopicId: ID!) {
  pinTopic(id: $pinTopicId) {
    ...TopicFragment
  }
}
    ${TopicFragmentFragmentDoc}`;
export type PinTopicMutationFn = Apollo.MutationFunction<PinTopicMutation, PinTopicMutationVariables>;

/**
 * __usePinTopicMutation__
 *
 * To run a mutation, you first call `usePinTopicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePinTopicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pinTopicMutation, { data, loading, error }] = usePinTopicMutation({
 *   variables: {
 *      pinTopicId: // value for 'pinTopicId'
 *   },
 * });
 */
export function usePinTopicMutation(baseOptions?: Apollo.MutationHookOptions<PinTopicMutation, PinTopicMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PinTopicMutation, PinTopicMutationVariables>(PinTopicDocument, options);
      }
export type PinTopicMutationHookResult = ReturnType<typeof usePinTopicMutation>;
export type PinTopicMutationResult = Apollo.MutationResult<PinTopicMutation>;
export type PinTopicMutationOptions = Apollo.BaseMutationOptions<PinTopicMutation, PinTopicMutationVariables>;
export const UnpinTopicDocument = gql`
    mutation UnpinTopic($unpinTopicId: ID!) {
  unpinTopic(id: $unpinTopicId) {
    ...TopicFragment
  }
}
    ${TopicFragmentFragmentDoc}`;
export type UnpinTopicMutationFn = Apollo.MutationFunction<UnpinTopicMutation, UnpinTopicMutationVariables>;

/**
 * __useUnpinTopicMutation__
 *
 * To run a mutation, you first call `useUnpinTopicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnpinTopicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unpinTopicMutation, { data, loading, error }] = useUnpinTopicMutation({
 *   variables: {
 *      unpinTopicId: // value for 'unpinTopicId'
 *   },
 * });
 */
export function useUnpinTopicMutation(baseOptions?: Apollo.MutationHookOptions<UnpinTopicMutation, UnpinTopicMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnpinTopicMutation, UnpinTopicMutationVariables>(UnpinTopicDocument, options);
      }
export type UnpinTopicMutationHookResult = ReturnType<typeof useUnpinTopicMutation>;
export type UnpinTopicMutationResult = Apollo.MutationResult<UnpinTopicMutation>;
export type UnpinTopicMutationOptions = Apollo.BaseMutationOptions<UnpinTopicMutation, UnpinTopicMutationVariables>;
export const UsersDocument = gql`
    query Users($nextToken: String) {
  users(nextToken: $nextToken) {
    items {
      ...UserFragment
    }
    nextToken
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      nextToken: // value for 'nextToken'
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export function useUsersSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersSuspenseQueryHookResult = ReturnType<typeof useUsersSuspenseQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export const GetFileContentDocument = gql`
    query GetFileContent($key: String!) {
  getFileContent(key: $key)
}
    `;

/**
 * __useGetFileContentQuery__
 *
 * To run a query within a React component, call `useGetFileContentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFileContentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFileContentQuery({
 *   variables: {
 *      key: // value for 'key'
 *   },
 * });
 */
export function useGetFileContentQuery(baseOptions: Apollo.QueryHookOptions<GetFileContentQuery, GetFileContentQueryVariables> & ({ variables: GetFileContentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFileContentQuery, GetFileContentQueryVariables>(GetFileContentDocument, options);
      }
export function useGetFileContentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFileContentQuery, GetFileContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFileContentQuery, GetFileContentQueryVariables>(GetFileContentDocument, options);
        }
export function useGetFileContentSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetFileContentQuery, GetFileContentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFileContentQuery, GetFileContentQueryVariables>(GetFileContentDocument, options);
        }
export type GetFileContentQueryHookResult = ReturnType<typeof useGetFileContentQuery>;
export type GetFileContentLazyQueryHookResult = ReturnType<typeof useGetFileContentLazyQuery>;
export type GetFileContentSuspenseQueryHookResult = ReturnType<typeof useGetFileContentSuspenseQuery>;
export type GetFileContentQueryResult = Apollo.QueryResult<GetFileContentQuery, GetFileContentQueryVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($name: String!, $email: String!, $password: String!) {
  createUser(name: $name, email: $email, password: $password) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($deleteUserId: ID!) {
  deleteUser(id: $deleteUserId)
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      deleteUserId: // value for 'deleteUserId'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($updateUserId: ID!, $input: UpdateUserInput!) {
  updateUser(id: $updateUserId, input: $input) {
    ...UserFragment
  }
}
    ${UserFragmentFragmentDoc}`;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      updateUserId: // value for 'updateUserId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const CategoriesDocument = gql`
    query Categories {
  categories {
    ...CategoryFragment
  }
}
    ${CategoryFragmentFragmentDoc}`;

/**
 * __useCategoriesQuery__
 *
 * To run a query within a React component, call `useCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
      }
export function useCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
        }
export function useCategoriesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
        }
export type CategoriesQueryHookResult = ReturnType<typeof useCategoriesQuery>;
export type CategoriesLazyQueryHookResult = ReturnType<typeof useCategoriesLazyQuery>;
export type CategoriesSuspenseQueryHookResult = ReturnType<typeof useCategoriesSuspenseQuery>;
export type CategoriesQueryResult = Apollo.QueryResult<CategoriesQuery, CategoriesQueryVariables>;
export const AddCategoryDocument = gql`
    mutation AddCategory($title: String!, $description: String) {
  addCategory(title: $title, description: $description) {
    ...CategoryFragment
  }
}
    ${CategoryFragmentFragmentDoc}`;
export type AddCategoryMutationFn = Apollo.MutationFunction<AddCategoryMutation, AddCategoryMutationVariables>;

/**
 * __useAddCategoryMutation__
 *
 * To run a mutation, you first call `useAddCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addCategoryMutation, { data, loading, error }] = useAddCategoryMutation({
 *   variables: {
 *      title: // value for 'title'
 *      description: // value for 'description'
 *   },
 * });
 */
export function useAddCategoryMutation(baseOptions?: Apollo.MutationHookOptions<AddCategoryMutation, AddCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddCategoryMutation, AddCategoryMutationVariables>(AddCategoryDocument, options);
      }
export type AddCategoryMutationHookResult = ReturnType<typeof useAddCategoryMutation>;
export type AddCategoryMutationResult = Apollo.MutationResult<AddCategoryMutation>;
export type AddCategoryMutationOptions = Apollo.BaseMutationOptions<AddCategoryMutation, AddCategoryMutationVariables>;
export const EditCategoryDocument = gql`
    mutation EditCategory($editCategoryId: ID!, $title: String!, $description: String, $userId: ID) {
  editCategory(
    id: $editCategoryId
    title: $title
    description: $description
    userId: $userId
  ) {
    ...CategoryFragment
  }
}
    ${CategoryFragmentFragmentDoc}`;
export type EditCategoryMutationFn = Apollo.MutationFunction<EditCategoryMutation, EditCategoryMutationVariables>;

/**
 * __useEditCategoryMutation__
 *
 * To run a mutation, you first call `useEditCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editCategoryMutation, { data, loading, error }] = useEditCategoryMutation({
 *   variables: {
 *      editCategoryId: // value for 'editCategoryId'
 *      title: // value for 'title'
 *      description: // value for 'description'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useEditCategoryMutation(baseOptions?: Apollo.MutationHookOptions<EditCategoryMutation, EditCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditCategoryMutation, EditCategoryMutationVariables>(EditCategoryDocument, options);
      }
export type EditCategoryMutationHookResult = ReturnType<typeof useEditCategoryMutation>;
export type EditCategoryMutationResult = Apollo.MutationResult<EditCategoryMutation>;
export type EditCategoryMutationOptions = Apollo.BaseMutationOptions<EditCategoryMutation, EditCategoryMutationVariables>;
export const DeleteCategoryDocument = gql`
    mutation DeleteCategory($deleteCategoryId: ID!) {
  deleteCategory(id: $deleteCategoryId)
}
    `;
export type DeleteCategoryMutationFn = Apollo.MutationFunction<DeleteCategoryMutation, DeleteCategoryMutationVariables>;

/**
 * __useDeleteCategoryMutation__
 *
 * To run a mutation, you first call `useDeleteCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCategoryMutation, { data, loading, error }] = useDeleteCategoryMutation({
 *   variables: {
 *      deleteCategoryId: // value for 'deleteCategoryId'
 *   },
 * });
 */
export function useDeleteCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteCategoryMutation, DeleteCategoryMutationVariables>(DeleteCategoryDocument, options);
      }
export type DeleteCategoryMutationHookResult = ReturnType<typeof useDeleteCategoryMutation>;
export type DeleteCategoryMutationResult = Apollo.MutationResult<DeleteCategoryMutation>;
export type DeleteCategoryMutationOptions = Apollo.BaseMutationOptions<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const CategoriesAndTagsDocument = gql`
    query CategoriesAndTags {
  categories {
    ...CategoryFragment
  }
  tags {
    ...TagFragment
  }
}
    ${CategoryFragmentFragmentDoc}
${TagFragmentFragmentDoc}`;

/**
 * __useCategoriesAndTagsQuery__
 *
 * To run a query within a React component, call `useCategoriesAndTagsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoriesAndTagsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoriesAndTagsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCategoriesAndTagsQuery(baseOptions?: Apollo.QueryHookOptions<CategoriesAndTagsQuery, CategoriesAndTagsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoriesAndTagsQuery, CategoriesAndTagsQueryVariables>(CategoriesAndTagsDocument, options);
      }
export function useCategoriesAndTagsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoriesAndTagsQuery, CategoriesAndTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoriesAndTagsQuery, CategoriesAndTagsQueryVariables>(CategoriesAndTagsDocument, options);
        }
export function useCategoriesAndTagsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<CategoriesAndTagsQuery, CategoriesAndTagsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CategoriesAndTagsQuery, CategoriesAndTagsQueryVariables>(CategoriesAndTagsDocument, options);
        }
export type CategoriesAndTagsQueryHookResult = ReturnType<typeof useCategoriesAndTagsQuery>;
export type CategoriesAndTagsLazyQueryHookResult = ReturnType<typeof useCategoriesAndTagsLazyQuery>;
export type CategoriesAndTagsSuspenseQueryHookResult = ReturnType<typeof useCategoriesAndTagsSuspenseQuery>;
export type CategoriesAndTagsQueryResult = Apollo.QueryResult<CategoriesAndTagsQuery, CategoriesAndTagsQueryVariables>;
export const UpdateTagDocument = gql`
    mutation UpdateTag($input: TagInput!) {
  updateTag(input: $input) {
    ...TagFragment
  }
}
    ${TagFragmentFragmentDoc}`;
export type UpdateTagMutationFn = Apollo.MutationFunction<UpdateTagMutation, UpdateTagMutationVariables>;

/**
 * __useUpdateTagMutation__
 *
 * To run a mutation, you first call `useUpdateTagMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTagMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTagMutation, { data, loading, error }] = useUpdateTagMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTagMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTagMutation, UpdateTagMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTagMutation, UpdateTagMutationVariables>(UpdateTagDocument, options);
      }
export type UpdateTagMutationHookResult = ReturnType<typeof useUpdateTagMutation>;
export type UpdateTagMutationResult = Apollo.MutationResult<UpdateTagMutation>;
export type UpdateTagMutationOptions = Apollo.BaseMutationOptions<UpdateTagMutation, UpdateTagMutationVariables>;