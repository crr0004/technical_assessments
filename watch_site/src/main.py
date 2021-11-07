from runner import Site, Runner
from basic.compare_site import BasicCompareSite
from basic.diff_site import BasicDiffSite
from basic.fetch_site import BasicFetchSite
from basic.print_site import BasicPrintDiff
from sql.sql_site import SqlSite

import asyncio
import argparse
async def main(urls, pulse, connectionString):
    sql = SqlSite(connectionString)
    runner = Runner((
        BasicFetchSite(),
        BasicCompareSite(),
        BasicDiffSite(),
        sql,
        sql,
        BasicPrintDiff()
    ),pulse=pulse)
    print("Use interrupts to stop the program")
    tasks = runner.watchSites(urls)
    await asyncio.gather(*tasks)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Watch a website for changes")
    parser.add_argument("urls", metavar="URL", type=str, nargs="+", help="List of urls to watch")
    parser.add_argument("--pulse", "-p", dest="pulse", type=int, default=60, help="How long between checking the website in seconds. Defaults to 60 seconds")
    parser.add_argument("--sql", "-s", dest="connectionString", type=str, required=True, help="Postgres SQL connection string. E.G host=localhost port=5432 dbname=sites user=watchsite password=watchsite")
    args = parser.parse_args()

    asyncio.run(main(args.urls, args.pulse, args.connectionString))