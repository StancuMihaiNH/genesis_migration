"""This is an example of how to use async langchain with fastapi and return a streaming response.
The latest version of Langchain has improved its compatibility with asynchronous FastAPI,
making it easier to implement streaming functionality in your applications.
"""
import os

from langchain.chat_models import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

from langchain.prompts import ChatPromptTemplate
from langchain.chat_models import ChatOpenAI

import asyncio
from src.helper import *

###
import os
from langchain.vectorstores.pgvector import PGVector
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.retrievers.multi_query import MultiQueryRetriever

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import os
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores.pgvector import PGVector
from langchain.retrievers.multi_query import MultiQueryRetriever
from langchain.chat_models import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder



embedding = OpenAIEmbeddings()

db_name = os.getenv('DB_NAME')
db_user = os.getenv('DB_USER')
db_password = os.getenv('DB_PASSWORD')
db_host = os.getenv('DB_HOST')
db_port = os.getenv('DB_PORT', '5432')

CONNECTION_STRING = f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
COLLECTION_NAME = "poc_v0"

nh_knowldge_store = PGVector(
    collection_name=COLLECTION_NAME,
    connection_string=CONNECTION_STRING,
    embedding_function=embedding,
)

nh_knowldge_retriever = nh_knowldge_store.as_retriever(
    search_type="similarity_score_threshold",
    search_kwargs={"score_threshold": 0.75}
)

llm = ChatOpenAI(temperature=0.1, model_name='gpt-4o')

retriever_from_llm = MultiQueryRetriever.from_llm(retriever=nh_knowldge_retriever, llm=llm)

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

contextualize_q_system_prompt = """Given a chat history and the latest user question \
which might reference context in the chat history, formulate a standalone question \
which can be understood without the chat history. Do NOT answer the question, \
just reformulate it if needed and otherwise return it as is."""
contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{question}"),
    ]
)
contextualize_q_chain = (contextualize_q_prompt | llm | StrOutputParser()).with_config(
    tags=["contextualize_q_chain"]
)



def get_sourced_documents(session_user_question, chat_history):

    # First, get the source documents
    contextualized_question = contextualize_q_chain.invoke({"question": session_user_question, "chat_history": chat_history})
    source_docs = retriever_from_llm.invoke(contextualized_question)
    formatted_docs = format_docs(source_docs)

    return contextualized_question, source_docs, formatted_docs
