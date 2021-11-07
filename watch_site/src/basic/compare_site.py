from runner import CompareSite


class BasicCompareSite(CompareSite):
    def areSitesSame(self, sites):
        return sites[0].soup == sites[1].soup
