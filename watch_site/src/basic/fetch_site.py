import requests
from bs4 import BeautifulSoup
from runner import FetchSite

from .soup_site import SoupSite


def removeElementInSoup(soup: BeautifulSoup, element: str):
    for element in soup.find_all(element):
        element.decompose()
    return soup

class BasicFetchSite(FetchSite):

    def removeJavascript(self, soup):
        return removeElementInSoup(soup, "script")
    def removeStyles(self, soup):
        return removeElementInSoup(soup, "style")

    def fetchSite(self, url):
        try:
            response = requests.get(url)
            soup = BeautifulSoup(response.text, "html.parser")
            soup = self.removeJavascript(soup)
            soup = self.removeStyles(soup)

            site = SoupSite(url, soup)
            return site
        except requests.exceptions.ConnectionError:
            print(f"Couldn't access {url}, are you sure it's correct?")
            return None
