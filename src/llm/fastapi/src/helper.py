# Import necessary modules from langchain library for prompt handling and memory management
from langchain.prompts import ChatPromptTemplate
from utils.prompt import *  # Custom utility functions for handling prompts
from utils.documents import *  # Custom utility functions for handling documents
from langchain.memory import ConversationBufferMemory  # For managing conversation memory
from langchain.schema import HumanMessage, AIMessage  # Message schema for chat history
from utils.boto_s3 import *  # Custom utility functions for interacting with AWS S3
from utils.get_tags import *

# Function to generate the appropriate prompt based on session tags and attached files
def get_prompt(model_name, session_tags, files):
    # Case when there are no session tags and no files
    if len(session_tags) == 0 and len(files) == 0 and model_name != 'title':
        # Create a prompt template using a pre-defined chat template
        prompt = ChatPromptTemplate.from_template(chat_template)
    
    # Case when there are session tags but no files
    elif len(session_tags) > 0 and len(files) == 0:
        # Initial prompt text providing guidance on how to structure the response
        prompt_text = """
            **Please first read the document, If you can give answer using only this document, please provide the answer using document content. If the answer is not belong from the document please use your own knowldge to answer the question. Take History as context.**

            When you respond about any questions, you need to think about the company from multiple perspectives, including what the company is doing and what is most important for the company.
            Each answer must contain: Introduction, Approach, and Conclusion.
            Approach should be comprehensive and detail every perspective of the given company.
            In Approach, describe each point in very detailed paragraphs.
            Always take a breath and think step by step.

            *CLEARLY FOLLOW THE QUESTION INSTRUCTION ABOUT LENGTH OF RESPONSE*
            {chat_history}
            """

        # Append additional context based on session tags
        for tag in session_tags:
            if tag in document_dictionary.keys():
                prompt_text += document_dictionary[tag]
            else:
                prompt_text += get_content_from_tags(tag)
                

        # Create a prompt template using the constructed prompt text
        prompt = ChatPromptTemplate.from_messages([
            ("system", prompt_text),
            ("human", "{user_question}"),
        ])
    
    # Case when there are both session tags and files
    elif len(session_tags) > 0 and len(files) > 0:
        # Initial prompt text similar to above but including files
        prompt_text = """
            **Please first read the document, If you can give answer using only this document, please provide the answer using document content. If the answer is not belong from the document please use your own knowldge to answer the question. Take History as context.**
            When you respond about any questions, you need to think about the company from multiple perspectives, including what the company is doing and what is most important for the company.
            Each answer must contain: Introduction, Approach, and Conclusion.
            Approach should be comprehensive and detail every perspective of the given company.
            In Approach, describe each point in very detailed paragraphs.
            Always take a breath and think step by step.

            *CLEARLY FOLLOW THE QUESTION INSTRUCTION ABOUT LENGTH OF RESPONSE*
            {chat_history}
            """

        # Append additional context based on session tags
        # Append additional context based on session tags
        for tag in session_tags:
            if tag in document_dictionary.keys():
                prompt_text += document_dictionary[tag]
            else:
                prompt_text += get_content_from_tags(tag)
                

        # Append content from AWS S3 files
        prompt_text += get_content_from_aws_s3(files)

        # Create a prompt template using the constructed prompt text
        prompt = ChatPromptTemplate.from_messages([
            ("system", prompt_text),
            ("human", "{user_question}"),
        ])
    
    # Case when there are no session tags but there are files
    elif len(session_tags) == 0 and len(files) > 0:
        # Initial prompt text instructing to use only provided documents
        prompt_text = """
            Please firest read the document, If you can give answer using only this document, please provide the answer using document content. If the answer is not belong from the document please use your own knowldge to answer the question. Take History as context.

            *CLEARLY FOLLOW THE QUESTION INSTRUCTION ABOUT LENGTH OF RESPONSE*
            {chat_history}
            """

        # Append content from AWS S3 files
        prompt_text += get_content_from_aws_s3(files)

        # Create a prompt template using the constructed prompt text
        prompt = ChatPromptTemplate.from_messages([
            ("system", prompt_text),
            ("human", "{user_question}"),
        ])

    elif model_name == 'title':

        prompt_text = """
            Generate Chat title we see in ChatGPT of 2 to 3 words based on Chat History

            {chat_history}
            """
        # Create a prompt template using the constructed prompt text
        prompt = ChatPromptTemplate.from_messages([
            ("system", prompt_text)
        ])

    return prompt  # Return the constructed prompt template

# Function to extract chat history and user question from the provided item
def get_history_question(item):
    user_question = ""  # Initialize user question
    memory = ConversationBufferMemory(memory_key="chat_history")  # Initialize memory buffer for chat history
    chat_history = []  # Initialize chat history list

    last_files = []
    # Iterate over messages in the item
    for elem in item.messages:
        if elem["role"] == "user":
            memory.chat_memory.add_user_message(elem["content"])  # Add user message to memory
            user_question = elem["content"]  # Set user question
            chat_history.append(HumanMessage(content=elem["content"]))  # Append human message to chat history
            if "files" in elem.keys() and len(elem["files"]) > 0:
                last_files=elem["files"]
        if elem["role"] == "assistant":
            memory.chat_memory.add_ai_message(elem["content"])  # Add AI message to memory
            chat_history.append(AIMessage(content=elem["content"]))  # Append AI message to chat history


    
    all_tags = []  # Initialize list of all tags

    try:
        # Extract tags if available
        if item.tags:
            for i in item.tags:
                all_tags.append(i["id"])  # Append tag ID to list
    except:
        pass
    return memory, chat_history, user_question, last_files, all_tags  # Return extracted values
