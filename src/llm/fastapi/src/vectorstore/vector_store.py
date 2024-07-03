import boto3
import os
import psycopg2
import os
from psycopg2 import sql
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma, PGVector
from langchain.text_splitter import RecursiveCharacterTextSplitter
from llama_index.core import SimpleDirectoryReader
from langchain.docstore.document import Document
import chardet

# Initialize S3 client
s3_client = boto3.client('s3')

def pretty_print_docs(docs):
    print(f"\n{'-' * 100}\n".join([f"Document {i+1}:\n\n" + d.page_content for i, d in enumerate(docs)]))

# Retrieve database connection details from environment variables
db_name = os.getenv('DB_NAME')
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_host = os.getenv('DB_HOST')
db_port = os.getenv('DB_PORT', 5432)  # Default to 5432 if not specified

try:
    conn = psycopg2.connect(
        dbname=db_name,
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port
    )
    print(f"Add Vector Extension")
    cursor = conn.cursor()
    
    conn.autocommit = True #!
    create_cmd = sql.SQL('CREATE EXTENSION vector')
    cursor.execute(create_cmd)
    print(f"Success")

except Exception as e:
    print(f"Error: {e}")


CONNECTION_STRING = f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
COLLECTION_NAME = "poc_v0"

bucket_name = 'gen-ai-nh-docs'
prefixes = [
    'north-highland/text/raw/',  # Adjust the S3 path prefix as needed
]

embeddings = OpenAIEmbeddings()

def get_s3_files(bucket_name, prefix):
    objects = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
    return [obj['Key'] for obj in objects.get('Contents', [])]

def try_decode(data, encodings):
    for encoding in encodings:
        try:
            return data.decode(encoding), encoding
        except UnicodeDecodeError:
            continue
    raise UnicodeDecodeError("Unable to decode data with provided encodings.")


def load_and_split_documents_from_s3(bucket_name, key):

    key_file = key.split("/")[-1]
    print(key_file)
    if "pdf" in key_file or "doc" in key_file:

        s3_object = s3_client.get_object(Bucket=bucket_name, Key=key)
        raw_data = s3_object['Body'].read()

        # Detect encoding
        result = chardet.detect(raw_data)

        encoding = result['encoding']
        fallback_encodings = ['utf-8', 'latin1', 'iso-8859-1', 'windows-1252']

        document_text, used_encoding = try_decode(raw_data, [encoding] + fallback_encodings if encoding else fallback_encodings)

        doc = Document(page_content=document_text, metadata = {"file_name": key})
        if len(doc.page_content) > 100:
            doc_text = doc.page_content.replace('\x00', '')
            list_doc = [Document(page_content=doc_text, metadata=doc.metadata)]
        else:
            list_doc = []

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(list_doc)
        return [split for split in splits if len(split.page_content) > 10]
    return None

# Collect all file keys from the specified S3 prefixes
s3_keys = []
for prefix in prefixes:
    s3_keys.extend(get_s3_files(bucket_name, prefix))

print(len(s3_keys))
# Load and split documents from S3 keys
intial_splits = []
for key in s3_keys[:5]:
    print(key)
    splits = load_and_split_documents_from_s3(bucket_name, key)
    if splits is not None:
        intial_splits.extend(splits)

print("Intial Splitting Done")
print(len(intial_splits))

try:
    # Initialize the vector store
    vectorstore = PGVector.from_documents(
        embedding=embeddings,
        documents=intial_splits,
        collection_name=COLLECTION_NAME,
        connection_string=CONNECTION_STRING,
        pre_delete_collection=True
    )
except:
    # Initialize the vector store
    vectorstore = PGVector.from_documents(
        embedding=embeddings,
        documents=intial_splits,
        collection_name=COLLECTION_NAME,
        connection_string=CONNECTION_STRING,
        pre_delete_collection=False
    )

for key in s3_keys[5:]:
    final_splits = []
    splits = load_and_split_documents_from_s3(bucket_name, key)
    if splits is not None:
        final_splits.extend(splits)
        print(f"Processing {key} documents")
        vectorstore.add_documents(final_splits)
