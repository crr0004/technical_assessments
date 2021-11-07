# pylint: skip-file
import asyncio
from unittest import IsolatedAsyncioTestCase
from unittest.mock import create_autospec

from src.runner import (CompareSite, DiffSite, FetchSite, PrintDiff,
                        RestoreSite, Runner, RunnerDependencies, SaveSite,
                        Site)


class TestRunner(IsolatedAsyncioTestCase):
    def setUp(self):
        self.stubDependences = (
            create_autospec(FetchSite),
            create_autospec(CompareSite),
            create_autospec(DiffSite),
            create_autospec(SaveSite),
            create_autospec(RestoreSite),
            create_autospec(PrintDiff)
        )
    def test_id(self):
        self.assertRegex(Site("hello").id(), "hello")
    async def test_checkSite(self):

        siteToWatch = Site("https://nytimes.com")
        self.stubDependences[0].fetchSite.return_value = siteToWatch

        PULSE_TIME_MINUTES = 5*60
        runner = Runner(self.stubDependences, pulse=PULSE_TIME_MINUTES)

        siteOld, siteNew = runner.checkSite(siteToWatch.url, None, None)

        self.stubDependences[0].fetchSite.assert_called_with(siteToWatch.url)
        self.stubDependences[1].areSitesSame.assert_not_called()

        self.stubDependences[1].areSitesSame.return_value = True
        siteOld, siteNew = runner.checkSite(siteToWatch.url, siteOld, siteNew)

        self.stubDependences[0].fetchSite.assert_called_with(siteToWatch.url)
        self.stubDependences[1].areSitesSame.assert_called_with((siteToWatch, siteToWatch))
        self.stubDependences[2].diffSite.assert_not_called()

        self.stubDependences[1].areSitesSame.return_value = False
        siteOld, siteNew = runner.checkSite(siteToWatch.url, siteOld, siteNew)

        self.stubDependences[0].fetchSite.assert_called_with(siteToWatch.url)
        self.stubDependences[1].areSitesSame.assert_called_with((siteToWatch, siteToWatch))
        self.stubDependences[2].diffSite.assert_called_with((siteToWatch, siteToWatch))
        self.stubDependences[3].saveSite.assert_called_with(siteToWatch)
