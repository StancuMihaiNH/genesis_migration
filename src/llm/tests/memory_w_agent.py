from langchain.agents import ZeroShotAgent, AgentExecutor
from langchain import OpenAI, LLMChain
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain_community.tools import DuckDuckGoSearchRun
import os



tools = [DuckDuckGoSearchRun(name="Search")]

prefix = """Have a conversation with a human, answering the following questions as best you can. You have access to the following tools:"""
suffix = """
User Conversation Chat History: If your question is based on historical conversation or comparision. You need to read through history and need to compare each point on the history
{chat_history}

Always Give Detailed answer based on the question write bullet points and Generate like comprehensive Report

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do and Always Give Detailed answer based on the question write bullet points and Generate like comprehensive Report
Action: the action to take, should be using the tools
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!   
Question: {input}
{agent_scratchpad}"""

prompt = ZeroShotAgent.create_prompt(
    tools,
    prefix=prefix,
    suffix=suffix,
    input_variables=["input", "chat_history", "agent_scratchpad"]
)
memory = ConversationBufferMemory(memory_key="chat_history")

llm_chain = LLMChain(llm=OpenAI(temperature=0), prompt=prompt)

agent = ZeroShotAgent(llm_chain=llm_chain, tools=tools, verbose=True)

agent_chain = AgentExecutor.from_agent_and_tools(agent=agent, tools=tools, verbose=True, memory=memory)

agent_chain.run(input="Tell me about North Highland Revenue?")
agent_chain.run(input="Compare with Deloitte")
agent_chain.run(input="Compare with Accenture")


