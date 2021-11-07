# pylint: skip-file
from unittest import TestCase

from basic.soup_site import SoupSite
from bs4 import BeautifulSoup

from sql.sql_site import SqlSite

from ..utils import readDataFile


class TestSqlSite(TestCase):
    def setUp(self):
        self.sql = SqlSite("host=localhost port=5432 dbname=sites user=watchsite password=watchsite")
        # with self.sql.pool.connection() as conn:
        #     conn.execute("TRUNCATE TABLE sites")
    def test_saveSite(self):
        site = SoupSite("https://site2.html", BeautifulSoup(readDataFile("site2.html"), "html.parser"))
        self.sql.saveSite(site)
        newSite = self.sql.restoreSite(site)
        self.assertEqual(newSite.soup, site.soup)
