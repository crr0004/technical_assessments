# pylint: skip-file
from unittest import TestCase

from bs4 import BeautifulSoup
from src.basic.fetch_site import BasicFetchSite

from ..utils import readDataFile


class TestBasicFetchSite(TestCase):
    def setUp(self):
        self.fetchSite = BasicFetchSite()
    def test_fetchSiteByUrl(self):
        site = self.fetchSite.fetchSite("https://nytimes.com")
        self.assertTrue(site)

    def test_javascriptRemoval(self):
        site = readDataFile("nytimes.html")
        soup = self.fetchSite.removeJavascript(BeautifulSoup(site, "html.parser"))
        self.assertFalse(soup.find("script"))
    def test_removeStyleRemoval(self):
        site = readDataFile("nytimes.html")
        soup = self.fetchSite.removeStyles(BeautifulSoup(site, "html.parser"))
        self.assertFalse(soup.find("style"))
    def test_handlesHttpErrors(self):
        self.fetchSite.fetchSite("http://nope.local")
        self.assertLogs("https://nope.local")
