import boto3

def list_files(bucket_name):
    """List files in an S3 bucket."""
    s3 = boto3.client('s3')
    contents = []
    try:
        for item in s3.list_objects(Bucket=bucket_name)['Contents']:
            contents.append(item['Key'])
    except Exception as e:
        print(e)
    return contents

def read_file(bucket_name, key):
    """Read a file from an S3 bucket."""
    s3 = boto3.client('s3')
    try:
        file_content = s3.get_object(Bucket=bucket_name, Key=key)['Body'].read().decode('utf-8')
        print(f"Contents of {key}:")
        print(file_content)
    except Exception as e:
        print(e)

def main():
    bucket_name = 'generative-ai-llm'
    files = list_files(bucket_name)

    for file_key in files:
        read_file(bucket_name, file_key)

if __name__ == '__main__':
    main()
