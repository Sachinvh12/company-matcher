import unittest
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))
from company import _get_competitors, _get_company


class TestGetCompetitors(unittest.TestCase):

    def test_get_competitors_with_name(self):
        result = _get_competitors(company_name="Apple")
        self.assertIsInstance(result, list)
        if len(result) > 0:
            competitor = result[0]
            self.assertIn("rank", competitor)
            self.assertIn("company_name", competitor)
            self.assertIn("ticker", competitor)
            self.assertIn("reason", competitor)
            self.assertIsInstance(competitor["rank"], int)
            self.assertIsInstance(competitor["company_name"], str)
            self.assertIsInstance(competitor["ticker"], str)
            self.assertIsInstance(competitor["reason"], str)

    def test_get_competitors_with_ticker(self):
        result = _get_competitors(company_ticker="AAPL")
        self.assertIsInstance(result, list)

    def test_get_competitors_with_both(self):
        result = _get_competitors(company_name="Apple", company_ticker="AAPL")
        self.assertIsInstance(result, list)

    def test_get_competitors_empty_input(self):
        result = _get_competitors(company_name="")
        self.assertEqual(result, [])

    def test_get_competitors_no_params(self):
        result = _get_competitors()
        self.assertEqual(result, [])

    def test_get_competitors_microsoft(self):
        result = _get_competitors(company_name="Microsoft", company_ticker="MSFT")
        self.assertIsInstance(result, list)

    def test_get_competitors_tesla(self):
        result = _get_competitors(company_name="Tesla")
        self.assertIsInstance(result, list)

    def test_alphabet_competitors_workflow(self):
        """Test the complete workflow: extract company names and find competitors"""
        # Step 1: Extract company names from prompt
        prompt = "I want to track news related to alphabet and it's competitors"
        extracted_companies = _get_company(prompt)
        
        # Verify extraction worked
        self.assertIsInstance(extracted_companies, list)
        self.assertIn("Alphabet", extracted_companies)
        
        # Step 2: Find competitors for Alphabet
        competitors = _get_competitors(company_name="Alphabet")
        
        # Verify competitors structure
        self.assertIsInstance(competitors, list)
        if len(competitors) > 0:
            # Check that we have the expected structure
            competitor = competitors[0]
            self.assertIn("rank", competitor)
            self.assertIn("company_name", competitor)
            self.assertIn("ticker", competitor)
            self.assertIn("reason", competitor)
            
            # Verify data types
            self.assertIsInstance(competitor["rank"], int)
            self.assertIsInstance(competitor["company_name"], str)
            self.assertIsInstance(competitor["ticker"], str)
            self.assertIsInstance(competitor["reason"], str)
            
            # Check that ranks start from 1
            self.assertEqual(competitor["rank"], 1)


if __name__ == '__main__':
    unittest.main()