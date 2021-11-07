# pylint: skip-file
import copy
from unittest import TestCase

from bs4 import BeautifulSoup
from src.basic.compare_site import BasicCompareSite
from src.basic.soup_site import SoupSite

from ..utils import readDataFile


class TestBasicDiffSite(TestCase):
    def setUp(self):
        self.compareSite = BasicCompareSite()
    def test_compareSite(self):
        site1 = SoupSite("site2", BeautifulSoup(readDataFile("site2.html"), "html.parser"))
        site2 = SoupSite("site2 stripped", copy.copy(site1.soup))
        self.assertTrue(self.compareSite.areSitesSame(((site1, site2))))
