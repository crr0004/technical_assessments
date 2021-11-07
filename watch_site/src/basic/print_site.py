import sys

from runner import PrintDiff


class BasicPrintDiff(PrintDiff):
    def printDiff(self, diff):
        sys.stdout.writelines(diff)
