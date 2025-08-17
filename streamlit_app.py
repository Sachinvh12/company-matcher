import os
import sys
from pathlib import Path
import streamlit as st

# Ensure src is on path
sys.path.insert(0, str(Path(__file__).parent / "src"))
from company import _get_company, _get_competitors, _get_subsidiaries


def infer_intent(prompt: str) -> str:
    """Infer whether the user asks for competitors or subsidiaries based on the prompt.
    Returns one of: "competitors", "subsidiaries", or "unknown".
    """
    text = (prompt or "").lower()

    competitors_kw = [
        "competitor", "competitors", "rival", "rivals", "compete",
        "vs", "versus", "against", "peer", "peers", "market share",
    ]
    subsidiaries_kw = [
        "subsidiary", "subsidiaries", "child company", "child companies",
        "division", "divisions", "business unit", "business units",
        "owned subsidiary", "wholly owned", "acquired unit",
    ]

    comp_hit = any(k in text for k in competitors_kw)
    subs_hit = any(k in text for k in subsidiaries_kw)

    if comp_hit and not subs_hit:
        return "competitors"
    if subs_hit and not comp_hit:
        return "subsidiaries"
    # If ambiguous or no keywords, default to competitors for now
    return "competitors" if comp_hit or not subs_hit else "unknown"

st.set_page_config(page_title="Company Analyzer", page_icon="📈", layout="centered")

st.title("📈 Company Analyzer UI")
st.write("Enter a prompt. The app will infer whether to show competitors or subsidiaries based on your query.")

# API key status
api_key_present = bool(os.getenv("OPENAI_API_KEY"))
with st.expander("Environment Status", expanded=not api_key_present):
    if api_key_present:
        st.success("OPENAI_API_KEY is configured via .env")
    else:
        st.error("OPENAI_API_KEY is not set. Add it to .env and restart.")

prompt = st.text_area(
    "Enter your prompt",
    value="I want to track news related to alphabet and it's competitors",
    height=120,
)

run = st.button("Analyze", type="primary")

if run:
    if not prompt.strip():
        st.warning("Please enter a prompt.")
        st.stop()

    st.subheader("Step 1: Extracting company names")
    with st.spinner("Extracting companies..."):
        companies = _get_company(prompt)
    st.write({"Extracted companies": companies})

    if not companies:
        st.info("No companies extracted from the prompt.")
        st.stop()

    action = infer_intent(prompt)
    if action == "competitors":
        st.subheader("Step 2: Competitors")
        for company in companies:
            st.markdown(f"### {company}")
            with st.spinner(f"Finding competitors for {company}..."):
                competitors = _get_competitors(company_name=company)
            if not competitors:
                st.write("No competitors found.")
                continue
            for c in competitors:
                st.write(
                    {
                        "rank": c.get("rank"),
                        "company_name": c.get("company_name"),
                        "ticker": c.get("ticker"),
                        "reason": c.get("reason"),
                    }
                )
    elif action == "subsidiaries":
        st.subheader("Step 2: Subsidiaries")
        for company in companies:
            st.markdown(f"### {company}")
            with st.spinner(f"Fetching subsidiaries for {company}..."):
                subsidiaries = _get_subsidiaries(company_name=company)
            if not subsidiaries:
                st.write("No subsidiaries found.")
                continue
            for s in subsidiaries:
                st.write(
                    {
                        "company_name": s.get("company_name"),
                        "ticker": s.get("ticker"),
                        "details": s.get("details"),
                    }
                )
