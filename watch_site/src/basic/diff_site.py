import difflib as diff

from runner import DiffSite, Site

from .soup_site import SoupSite


class BasicDiffSite(DiffSite):
    def diffSite(self, sites: (Site, Site)):

        return list(diff.context_diff(
            str(sites[0].soup).splitlines(True),
            str(sites[1].soup).splitlines(True), fromfile=sites[0].id(), tofile=sites[1].id(), n=0))
