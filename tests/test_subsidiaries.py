import unittest
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))
from company import _get_subsidiaries, _get_company


class TestGetSubsidiaries(unittest.TestCase):

    def test_get_subsidiaries_with_name(self):
        result = _get_subsidiaries(company_name="Apple")
        self.assertIsInstance(result, list)
        if len(result) > 0:
            subsidiary = result[0]
            self.assertIn("company_name", subsidiary)
            self.assertIn("ticker", subsidiary)
            self.assertIn("details", subsidiary)
            self.assertIsInstance(subsidiary["company_name"], str)
            self.assertIsInstance(subsidiary["ticker"], str)
            self.assertIsInstance(subsidiary["details"], str)

    def test_get_subsidiaries_with_ticker(self):
        result = _get_subsidiaries(company_ticker="AAPL")
        self.assertIsInstance(result, list)

    def test_get_subsidiaries_with_both(self):
        result = _get_subsidiaries(company_name="Apple", company_ticker="AAPL")
        self.assertIsInstance(result, list)

    def test_get_subsidiaries_empty_input(self):
        result = _get_subsidiaries(company_name="")
        self.assertEqual(result, [])

    def test_get_subsidiaries_no_params(self):
        result = _get_subsidiaries()
        self.assertEqual(result, [])

    def test_get_subsidiaries_microsoft(self):
        result = _get_subsidiaries(company_name="Microsoft", company_ticker="MSFT")
        self.assertIsInstance(result, list)

    def test_get_subsidiaries_google(self):
        result = _get_subsidiaries(company_name="Alphabet", company_ticker="GOOGL")
        self.assertIsInstance(result, list)

    def test_get_subsidiaries_berkshire(self):
        result = _get_subsidiaries(company_name="Berkshire Hathaway", company_ticker="BRK.A")
        self.assertIsInstance(result, list)

    def test_microsoft_subsidiaries_workflow(self):
        """Test the complete workflow: extract company names and find subsidiaries"""
        # Step 1: Extract company names from prompt
        prompt = "track all subsidiaries of microsoft"
        extracted_companies = _get_company(prompt)
        
        # Verify extraction worked
        self.assertIsInstance(extracted_companies, list)
        self.assertIn("Microsoft", extracted_companies)
        
        # Step 2: Find subsidiaries for Microsoft
        subsidiaries = _get_subsidiaries(company_name="Microsoft")
        
        # Verify subsidiaries structure
        self.assertIsInstance(subsidiaries, list)
        if len(subsidiaries) > 0:
            # Check that we have the expected structure
            subsidiary = subsidiaries[0]
            self.assertIn("company_name", subsidiary)
            self.assertIn("ticker", subsidiary)
            self.assertIn("details", subsidiary)
            
            # Verify data types
            self.assertIsInstance(subsidiary["company_name"], str)
            self.assertIsInstance(subsidiary["ticker"], str)
            self.assertIsInstance(subsidiary["details"], str)
            
            # Verify that company_name is not empty
            self.assertGreater(len(subsidiary["company_name"]), 0)
            
            # Verify ticker is either a valid ticker or "N/A"
            self.assertTrue(
                subsidiary["ticker"] == "N/A" or 
                (len(subsidiary["ticker"]) > 0 and subsidiary["ticker"].isalnum())
            )


if __name__ == '__main__':
    unittest.main()