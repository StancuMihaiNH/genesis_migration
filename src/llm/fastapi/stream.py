# Libraries for running and configuring the server
import uvicorn  # ASGI server for fast performance
from dotenv import load_dotenv  # To load environment variables from a .env file

# Libraries for creating and managing the FastAPI application
from fastapi import FastAPI  # Main FastAPI class for creating the app
from fastapi.responses import StreamingResponse  # For streaming responses
from fastapi.middleware.cors import CORSMiddleware  # Middleware to handle CORS

# Libraries for data validation and asynchronous operations
from pydantic import BaseModel  # For data validation using Pydantic models
import asyncio  # For asynchronous programming
from typing import AsyncIterable  # For defining asynchronous iterable return types
import json  # For handling JSON data
import os  # For interacting with the operating system
import random  # For random selection of API keys

# Libraries for language model interactions
from langchain.chat_models import ChatOpenAI  # For interacting with OpenAI models
from langchain_anthropic import ChatAnthropic  # For interacting with Anthropic models

# Libraries for creating and managing langchain runnables and callbacks
from langchain_core.runnables import RunnablePassthrough  # For creating runnable tasks
from langchain.callbacks import AsyncIteratorCallbackHandler  # For handling asynchronous callbacks
from langchain_core.output_parsers import StrOutputParser  # For parsing output strings

# Custom helper functions and utility modules
from src.helper import get_prompt, get_history_question # Importing custom helper functions
from nh.stream_document_qa_api import get_sourced_documents  # Custom API for document QA
from utils.prompt import *  # Utility functions for handling prompts

# Load environment variables from a .env file
load_dotenv()

# Retrieve API keys from environment variables
OPENAI_API_KEY_LIST = os.environ.get('OPENAI_API_KEY_LIST').split(",")  # Load and split OpenAI API keys
ANTHROPIC_API_KEY_LIST = os.environ.get('ANTHROPIC_API_KEY_LIST').split(",")  # Load and split Anthropic API keys

# Initialize FastAPI application
app = FastAPI(
    title="LangChain Server",  # Title of the API server
    version="1.0",  # Version of the API
    description="A simple API server using LangChain's Runnable interfaces",  # Description of the API
)

# Set CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,  # Allow credentials
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],  # Expose all headers
)

# Pydantic model for request validation
class Item(BaseModel):
    messages: list | None = None  # List of messages for chat history
    tags: list | None = None  # List of tags for context
    model: str | None = None  # Model type to use (e.g., "gpt-4")
    temperature: float | None = None  # Temperature for model response variability
    max_tokens: int | None = None  # Maximum number of tokens in response
    top_p: float | None = None  # Nucleus sampling parameter
    frequency_penalty: float | None = None  # Penalty for frequency of tokens
    presence_penalty: float | None = None  # Penalty for presence of tokens
    files: list | None = None  # List of files for additional context

# Helper function to handle set default serialization
def set_default(obj):
    if isinstance(obj, set):
        return list(obj)
    raise TypeError

# Asynchronous function to send messages
async def send_message(item: Item) -> AsyncIterable[str]:
    print(item)  # Debugging: Print the incoming item
    # Retrieve session memory, chat history, question, and tags
    session_memory, chat_history, session_user_question, session_files, session_tags = get_history_question(item)
    callback = AsyncIteratorCallbackHandler()  # Initialize callback handler
    list_files = session_files if len(session_files) > 0  else []  # Get files list or empty list

    # Conditional logic based on the selected model
    if item.model == "gpt-4":
        user_prompt = get_prompt(item.model, session_tags, list_files)  # Generate user prompt
        print(user_prompt)  # Debugging: Print the user prompt
        llm = ChatOpenAI(
            model='gpt-4o',  # Model name
            max_tokens=4000,  # Maximum tokens
            streaming=True,  # Enable streaming
            verbose=True,  # Enable verbose logging
            callbacks=[callback],  # Set callbacks
            api_key=random.choice(OPENAI_API_KEY_LIST)  # Randomly select an API key
        )
        try:
            chain = user_prompt | llm | StrOutputParser()  # Create processing chain
            # Asynchronously stream the response
            async for msg in chain.astream({"chat_history": chat_history, "user_question": session_user_question}):
                yield msg + "\n"
        except Exception as e:
            print(e)
            yield "There is some Error to generate response. Please Contact AI-CoE with Full Screen Screenshot"

    elif item.model == "claude-3-opus" or item.model == "claude-3-opous":
        user_prompt = get_prompt(item.model, session_tags, list_files)  # Generate user prompt
        llm_anthropic = ChatAnthropic(
            temperature=0.3,  # Set temperature
            max_tokens=4000,  # Maximum tokens
            model_name="claude-3-opus-20240229",  # Model name
            streaming=True,  # Enable streaming
            verbose=True,  # Enable verbose logging
            callbacks=[callback],  # Set callbacks
            api_key=random.choice(ANTHROPIC_API_KEY_LIST)  # Randomly select an API key
        )
        try:
            chain = user_prompt | llm_anthropic | StrOutputParser()  # Create processing chain
            # Asynchronously stream the response
            async for msg in chain.astream({"chat_history": chat_history, "user_question": session_user_question}):
                yield msg + "\n"
        except Exception as e:
            print(e)
            yield "There is some Error to generate response. Please Contact AI-CoE with Full Screen Screenshot"

    elif item.model == "nh-qa":
        try:
            # First, get the source documents
            contextualized_question, source_docs, formatted_docs = get_sourced_documents(session_user_question, chat_history)
            docs = [{"file_name": d.metadata["file_name"], "content": d.page_content} for d in source_docs]
            yield json.dumps(docs, default=set_default)  # Send source documents as JSON

            llm = ChatOpenAI(
                model='gpt-4o', 
                max_tokens=4000,
                streaming=True,
                verbose=True,
                callbacks=[callback],
                api_key=random.choice(OPENAI_API_KEY_LIST)
            )
            
            # Prepare input for the answer generation
            answer_input = {
                "chat_history": chat_history,
                "context": formatted_docs,
                "question": contextualized_question
            }

            # Create answer generation chain
            answer_chain = (
                RunnablePassthrough()
                | qa_prompt
                | llm
            )

            # Asynchronously stream the answer
            async for chunk in answer_chain.astream(answer_input):
                yield f"{chunk.content}\n"
        except Exception as e:
            print(e)
            yield "There is some Error to generate response. Please Contact AI-CoE with Full Screen Screenshot"
    
    elif item.model == "title":
        user_prompt = get_prompt(item.model, session_tags, list_files)  # Generate user prompt
        print(user_prompt)  # Debugging: Print the user prompt
        llm = ChatOpenAI(
            model='gpt-4o',  # Model name
            max_tokens=4000,  # Maximum tokens
            streaming=True,  # Enable streaming
            verbose=True,  # Enable verbose logging
            callbacks=[callback],  # Set callbacks
            api_key=random.choice(OPENAI_API_KEY_LIST)  # Randomly select an API key
        )
        try:
            chain = user_prompt | llm | StrOutputParser()  # Create processing chain
            # Asynchronously stream the response

            title_result = ""
            async for msg in chain.astream({"chat_history": chat_history}):
                title_result += msg
            
            yield json.dumps({"title": title_result.strip()}, default=set_default)
        except Exception as e:
            print(e)
            yield "There is some Error to generate response. Please Contact AI-CoE with Full Screen Screenshot"


    else:
        pass


# Pydantic model for stream request
class StreamRequest(BaseModel):
    """Request body for streaming."""
    message: str  # Message string

# Endpoint for chat stream
@app.post("/chat_stream/")
def stream(item: Item):
    return StreamingResponse(send_message(item), media_type="text/event-stream")

# To run the server, use the following command in the terminal:
# uvicorn main:app --host 0.0.0.0 --port 8000
# where `main` is the name of your Python file (without .py)
