"""
Module for watching changes to websites.
"""
import asyncio
import datetime
from abc import ABC, abstractmethod


class Site:
    """
    Data strucutre for holding a url and the time it was created.
    """
    def __init__(self, url):
        self.url = url
        self.time = datetime.datetime.now(datetime.timezone.utc)

    def id(self):
        return f"URL: {self.url} at {self.time}"

class FetchSite(ABC):
    """
    Interface to implement for fetching a website
    """
    @abstractmethod
    def fetchSite(self, url: str) -> Site:
        pass

class DiffSite(ABC):
    """
    Interface to implement for creating a list of differences of HTML from two sites.
    """
    @abstractmethod
    def diffSite(self, sites: (Site, Site)) -> list[str]:
        pass
class SaveSite(ABC):
    """
    Interface to implement saving a website watch state.
    """
    @abstractmethod
    def saveSite(self, site: Site) -> bool:
        pass

class RestoreSite(ABC):
    """
    Interface to implement restoring a website watch state.
    """
    @abstractmethod
    def restoreSite(self, site: Site) -> bool:
        pass

class CompareSite(ABC):
    """
    Interface to implement to determine if two sites are the same.
    """
    @abstractmethod
    def areSitesSame(self, sites: (Site, Site)) -> bool:
        pass
class PrintDiff(ABC):
    """
    Interface to implement printing the results of the differ
    """
    @abstractmethod
    def printDiff(self, diff):
        pass

RunnerDependencies = (FetchSite, CompareSite, DiffSite, SaveSite, RestoreSite, PrintDiff)

class Runner():
    """
    Class responsible for watching a set of URLs.
    """
    def __init__(self, dependencies: RunnerDependencies, pulse: int = 60):
        self.fetcher, self.comparer, self.differ, self.saver, self.restorer, self.printer = dependencies
        self.pulse = pulse

    def checkSite(self, url, siteOld: Site, siteNew: Site):
        siteNew = self.fetcher.fetchSite(url)
        if siteOld and siteNew and not self.comparer.areSitesSame((siteOld, siteNew)):
            diff = self.differ.diffSite((siteOld, siteNew))
            self.printer.printDiff(diff)
            self.saver.saveSite(siteNew)
        siteOld = siteNew
        return siteOld, siteNew

    async def watchSite(self, url):
        siteOld, siteNew = None, None
        while(True):
            siteOld, siteNew = self.checkSite(url, siteOld, siteNew)
            await asyncio.sleep(self.pulse)

    def watchSites(self, urls: list[str]):
        tasks = []
        for url in urls:
            tasks.append(self.watchSite(url))
        return tasks
