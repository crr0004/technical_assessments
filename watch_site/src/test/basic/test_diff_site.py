# pylint: skip-file
import copy
from unittest import TestCase

from bs4 import BeautifulSoup
from src.basic.diff_site import BasicDiffSite
from src.basic.soup_site import SoupSite

from ..utils import readDataFile


class TestBasicDiffSite(TestCase):
    def setUp(self):
        self.diffSite = BasicDiffSite()
    def test_diffSites(self):
        site1 = SoupSite("site2", BeautifulSoup(readDataFile("site2.html"), "html.parser"))
        site2 = SoupSite("site2 stripped", copy.copy(site1.soup))
        # see the html file for why we search for this
        # just want to remove a story so we can see the difference
        storyToRemove = site2.soup.select("section.story-wrapper")[0]
        storyHeader = storyToRemove.select("h3")[0].get_text().strip()

        storyToRemove.clear()

        difference = self.diffSite.diffSite((site1, site2))
        self.assertRegex(str(difference), storyHeader)
        