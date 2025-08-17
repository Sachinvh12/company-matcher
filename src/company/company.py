from typing import List, Dict
import os
import json
import re
from pathlib import Path
from haystack import Document, Pipeline
from haystack.components.generators import OpenAIGenerator
from haystack.components.builders import PromptBuilder
from dotenv import load_dotenv

load_dotenv()


def _load_ticker_mapping() -> Dict[str, str]:
    """Load SEC ticker to company name mapping."""
    ticker_file = Path(__file__).parent / "sec_company_tickers.json"
    with open(ticker_file, 'r') as f:
        data = json.load(f)

    ticker_map = {}
    for entry in data.values():
        ticker = entry.get('ticker', '').upper()
        title = entry.get('title', '')
        if ticker and title:
            ticker_map[ticker] = title

    return ticker_map


def _replace_tickers_with_names(prompt: str, ticker_map: Dict[str, str]) -> str:
    """Replace ticker symbols in prompt with company names."""
    words = prompt.split()
    for i, word in enumerate(words):
        clean_word = re.sub(r'[^\w]', '', word).upper()
        if clean_word in ticker_map:
            words[i] = ticker_map[clean_word]
    return ' '.join(words)


def _get_company(prompt: str) -> List[str]:
    """Extract company names from a given prompt using OpenAI."""
    if not prompt or not isinstance(prompt, str):
        return []

    #ticker_map = _load_ticker_mapping()
    #enhanced_prompt = _replace_tickers_with_names(prompt, ticker_map)
    enhanced_prompt = prompt;  # TODO

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is required")

    template = """
    Extract all company names from the following text. Return only a JSON array of company names, nothing else.
    Rules:
    - Include full company names (e.g., "Apple Inc", "Microsoft Corporation")
    - Remove suffixes like Inc, Corp, LLC, Ltd when extracting the core name
    - Return only the core company names
    - If no companies found, return empty array

    Text: {{text}}

    JSON Array:
    """

    prompt_builder = PromptBuilder(template=template, required_variables=["text"])
    llm = OpenAIGenerator(
        model="gpt-3.5-turbo",
        generation_kwargs={"max_tokens": 200, "temperature": 0}
    )

    pipeline = Pipeline()
    pipeline.add_component("prompt_builder", prompt_builder)
    pipeline.add_component("llm", llm)
    pipeline.connect("prompt_builder.prompt", "llm.prompt")

    result = pipeline.run({
        "prompt_builder": {"text": enhanced_prompt}
    })

    response = result["llm"]["replies"][0]

    companies = json.loads(response.strip())
    if isinstance(companies, list):
        return sorted([c for c in companies if isinstance(c, str) and c.strip()])
    return []


def _get_competitors(company_name: str = None, company_ticker: str = None) -> List[Dict]:
    """Get top 10 competitors for a given company."""
    if not company_name and not company_ticker:
        return []
    
    if not isinstance(company_name, (str, type(None))) or not isinstance(company_ticker, (str, type(None))):
        return []

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is required")

    template = """You are an expert market analyst specializing in competitive intelligence. Your task is to identify and rank up to 5 of the most direct competitors for the company provided.

**Company Details:**

Name: {{company_name}}
Ticker: {{company_ticker}}

**Instructions:**

1. Analyze the Core Business: First, precisely identify the primary business model of the target company ({{company_name}}). Focus on its main products, services, and revenue streams.
2. Geographical Focus: Limit the competitor search to the target company's primary country of operation. Only list an international company if it has a significant, direct market presence and competes within that same country.
3. Identify True Competitors: Based on this core business model and geographical focus, identify other companies that offer the exact same or highly similar services to the same target customers.
4. Crucial Exclusion Criteria: Do NOT list companies that are primarily customers, clients, partners, or distributors.
    Example: For a central securities depository like CDSL, its direct competitor is another depository (like NSDL). Do not list stock brokerage firms (like Zerodha or HDFC Securities) as they are clients (Depository Participants), not direct competitors to the core depository business.
5. Provide a JSON Response: Your output must be a valid JSON array of objects, ordered from the most direct competitor (rank 1) to the least.
6. JSON Object Keys: Each object must contain:
    "rank": An integer ranking the competitor's significance.
    "company_name": The official name of the competitor.
    "ticker": The stock ticker on its primary local exchange (e.g., CDSL.NS for India's NSE, MSFT for the US). Use "N/A" if private or unknown.
    "reason": A concise explanation of the specific business segment where the companies directly compete.
7. No Competitors: If no direct competitors are found, return an empty JSON array: [].

JSON Array:"""

    prompt_builder = PromptBuilder(template=template, required_variables=["company_name", "company_ticker"])
    llm = OpenAIGenerator(
        model="gpt-4.1-mini",
        generation_kwargs={"max_tokens": 800, "temperature": 0}
    )

    pipeline = Pipeline()
    pipeline.add_component("prompt_builder", prompt_builder)
    pipeline.add_component("llm", llm)
    pipeline.connect("prompt_builder.prompt", "llm.prompt")

    result = pipeline.run({
        "prompt_builder": {
            "company_name": company_name or "N/A",
            "company_ticker": company_ticker or "N/A"
        }
    })

    response = result["llm"]["replies"][0]

    competitors = json.loads(response.strip())
    if isinstance(competitors, list):
        return competitors
    return []


def _get_subsidiaries(company_name: str = None, company_ticker: str = None) -> List[Dict]:
    """Get subsidiaries for a given company."""
    if not company_name and not company_ticker:
        return []
    
    if not isinstance(company_name, (str, type(None))) or not isinstance(company_ticker, (str, type(None))):
        return []

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is required")

    template = """You are a corporate filing analyst. Your task is to provide a comprehensive list of all known, majority-owned subsidiaries for the parent company provided.

**Company Details:**
- Name: {{company_name}}
- Ticker: {{company_ticker}}

**Instructions:**
1. Identify all legal entities that are known to be majority-owned or fully-owned subsidiaries of the parent company.
2. Provide your response as a valid JSON array of objects.
3. The list does not need to be ranked.
4. Each object in the array must contain the following keys:
   - "company_name": The official legal name of the subsidiary.
   - "ticker": The stock ticker if the subsidiary is also publicly traded. Use the string "N/A" otherwise.
   - "details": A brief description of the subsidiary's business or its relationship to the parent company (e.g., "Acquired in 2006", "Manages cloud computing services").
5. If the company has no known subsidiaries, return an empty JSON array: [].

JSON Array:"""

    prompt_builder = PromptBuilder(template=template, required_variables=["company_name", "company_ticker"])
    llm = OpenAIGenerator(
        model="gpt-3.5-turbo",
        generation_kwargs={"max_tokens": 800, "temperature": 0}
    )

    pipeline = Pipeline()
    pipeline.add_component("prompt_builder", prompt_builder)
    pipeline.add_component("llm", llm)
    pipeline.connect("prompt_builder.prompt", "llm.prompt")

    result = pipeline.run({
        "prompt_builder": {
            "company_name": company_name or "N/A",
            "company_ticker": company_ticker or "N/A"
        }
    })

    response = result["llm"]["replies"][0]

    subsidiaries = json.loads(response.strip())
    if isinstance(subsidiaries, list):
        return subsidiaries
    return []