from dataclasses import dataclass

from basic.soup_site import SoupSite
from psycopg.rows import class_row
from psycopg_pool import ConnectionPool
from runner import RestoreSite, SaveSite, Site

from bs4 import BeautifulSoup
import base64

@dataclass
class SiteState:
    time: str
    name: str
    url: str
    content: str

class SqlSite(SaveSite, RestoreSite):
    def __init__(self, conncetionString):
        self.pool = ConnectionPool(conncetionString)
    def saveSite(self, site: SoupSite):
        siteToSave = SiteState(str(site.time), site.soup.title.get_text(), site.url, str(site.soup))
        with self.pool.connection() as conn:
            conn.execute("INSERT INTO sites (name, url, time, content) VALUES (%s, %s, %s, %s)",(
                siteToSave.name,
                siteToSave.url,
                siteToSave.time,
                # Encode it as base64 because there can be different characters that the driver doesn't like
                base64.b64encode(siteToSave.content.encode("utf-8")).decode("utf-8")
            ))
    def restoreSite(self, site: SoupSite) -> bool:
        site = SoupSite(site.url, None)
        with self.pool.connection() as conn:
            with conn.cursor(row_factory=class_row(SiteState)):
                siteState = conn.execute("SELECT * FROM sites WHERE url = %s ORDER BY time DESC", (site.url,)).fetchone()
                site.soup = BeautifulSoup(base64.b64decode(siteState[4]).decode("utf-8"))
                site.time = siteState[3]
        return site
