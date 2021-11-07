from bs4 import BeautifulSoup
from runner import Site


class SoupSite(Site):
    def __init__(self, url: str, soup: BeautifulSoup):
        super().__init__(url)
        self.soup = soup
