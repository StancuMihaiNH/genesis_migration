# NH chat dynamodb table design

we do use single design pattern for all tables in dynamodb.

## Table Name: NHChat

### Primary Key: PK (Partition Key), SK (Sort Key)

### GSI: GSI1PK, GSI1SK

### Entity: User, Topic, Message

### User

- PK: USER
- SK: USER#{userId}
- GSI1PK: USER#{email}
- GSI1SK: USER#{userId}
- Attributes:
    - id
    - email
    - name
    - password
    - avatar
    - createdAt
    - updatedAt

### Topic

- PK: USER#{userId}
- SK: TOPIC#{topicId}
- Attributes:
    - id
    - name
    - description
    - userId
    - tags (list)
    - pined
    - pinnedAt
    - createdAt
    - updatedAt

### Message

- PK: TOPIC#<topicId>
- SK: MESSAGE#<messageId>
- Attributes:
    - id
    - role
    - content
    - userId
    - files
    - source_documents
    - createdAt
    - updatedAt

### Tag

- PK: TAG
- SK: TAG#<tagId>
- Attributes:
    - id
    - displayName
    - content
    - attachments

### Prompt

- PK: USER#<userId>
- SK: PROMPT#<promptId>
- Attributes:
    - id
    - title
    - description
    - createdAt
    - updatedAt

### Category

- PK: CATEGORY
- SK: CATEGORY#<categoryId>
