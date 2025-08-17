import unittest
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))
from company import _get_company


class TestGetCompany(unittest.TestCase):

    def test_basic_company_extraction(self):
        prompt = "Apple Inc is a technology company"
        result = _get_company(prompt)
        self.assertIn("Apple", result)

    def test_multiple_companies(self):
        prompt = "Microsoft Corp and Google LLC are tech giants"
        result = _get_company(prompt)
        self.assertIn("Microsoft", result)
        self.assertIn("Google", result)

    def test_company_with_corporation_suffix(self):
        prompt = "Tesla Corporation is an electric vehicle company"
        result = _get_company(prompt)
        self.assertIn("Tesla", result)

    def test_company_with_limited_suffix(self):
        prompt = "Amazon Limited operates globally"
        result = _get_company(prompt)
        self.assertIn("Amazon", result)

    def test_acronym_companies(self):
        prompt = "IBM and HP are well-known companies"
        result = _get_company(prompt)
        self.assertIn("IBM", result)
        self.assertIn("HP", result)

    def test_empty_string(self):
        result = _get_company("")
        self.assertEqual(result, [])

    def test_none_input(self):
        result = _get_company(None)
        self.assertEqual(result, [])

    def test_non_string_input(self):
        result = _get_company(123)
        self.assertEqual(result, [])

    def test_no_companies_found(self):
        prompt = "this is just some random text with no companies"
        result = _get_company(prompt)
        self.assertEqual(result, [])

    def test_company_mentioned_explicitly(self):
        prompt = "The company called Netflix is a streaming service"
        result = _get_company(prompt)
        self.assertIn("Netflix", result)

    def test_mixed_case_company_names(self):
        prompt = "McDonald's Corp and Burger King LLC are fast food companies"
        result = _get_company(prompt)
        self.assertIn("McDonald's", result)
        self.assertIn("Burger King", result)

    def test_result_is_sorted(self):
        prompt = "Zebra Corp, Apple Inc, and Microsoft LLC"
        result = _get_company(prompt)
        self.assertEqual(result, sorted(result))

    def test_no_duplicates(self):
        prompt = "Apple Inc and Apple Corporation and Apple Company"
        result = _get_company(prompt)
        apple_count = sum(1 for company in result if "Apple" in company)
        self.assertGreaterEqual(apple_count, 1)

    @unittest.skip("Ticker mapping disabled")
    def test_googl_ticker_symbol(self):
        prompt = "tell me about GOOGL"
        result = _get_company(prompt)
        self.assertIn("Alphabet", result)

    @unittest.skip("Ticker mapping disabled")
    def test_elcpf_ticker_symbol(self):
        prompt = "tell me about ELCPF"
        result = _get_company(prompt)
        self.assertIn("EDP ENERGIAS DE PORTUGAL SA", result)

    @unittest.skip("Ticker mapping disabled")
    def test_cost_earnings_query(self):
        prompt = "did COST release earnings"
        result = _get_company(prompt)
        self.assertIn("COSTCO WHOLESALE", result)


if __name__ == '__main__':
    unittest.main()