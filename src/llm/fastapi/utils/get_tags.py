import boto3
from boto3.session import Session
import os
import uuid

from llama_index.core import SimpleDirectoryReader
from langchain.docstore.document import Document




# Initialize S3 client
s3_client = boto3.client('s3')


bucket_name = 'nh-chat-bucket'

access_key = os.environ['AWS_ACCESS_KEY_ID']
secret_key = os.environ['AWS_SECRET_ACCESS_KEY']

session = Session(
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key
)

s3 = session.resource('s3')
bucket = s3.Bucket(bucket_name)


def get_s3_files(bucket_name, prefix):
    objects = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)
    return [obj['Key'] for obj in objects.get('Contents', [])]


def get_content_from_tags(prefix):


    # Collect all file keys from the specified S3 prefixes
    list_files = get_s3_files(bucket_name, prefix)


    print(list_files)

    
    folder_name = str(uuid.uuid4())

    os.makedirs(f"/tmp/{folder_name}")

    for file_object in list_files:
        
        file_name = str(file_object.split('/')[-1])
        print('Downloading file {} ...'.format(file_object))
        bucket.download_file(file_object, f'/tmp/{folder_name}/{file_name}')


    documents = SimpleDirectoryReader(f"/tmp/{folder_name}").load_data()

    text = ""

    for doc in documents:
        text += doc.metadata["file_name"] + "\n"
        text += doc.text.replace('\x00', '') + "\n\n"
    
    return text