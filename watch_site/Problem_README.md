# News update detection

## Task description

At watchsite, we are all about media monitoring. A lot of media currently is hosted online, and as a company we want to know when content changes, so that we can quickly react to this.

Your task is to write a Python program that regularly scans the front page of a news website. The main purpose of the program is to detect when something has changed, e.g. a new item was added or an existing item was updated. When your program detects a change, it should write out a message on the command line detailing exactly what changed. The more context, the better. The idea here is that somebody should be able to just watch this command line and know what's going on.

You are free to monitor whichever news website you prefer.

Many websites currently use a lot of javascript, so it is probably a good idea to filter this out before comparing for changes.

## Technical specifications

Your program should be written in Python 3. We encourage you to use existing libraries where you can, e.g. for scraping or parsing websites, or for interacting with a database.

Your program *must* use a relational database for storing the scraped pages or content. There are no restrictions here as long as the database is relational, e.g. sqlite, mysql, postgresql, etc. We want to see that you know the basics of working with a database and writing SQL.

The database schema is for you to decide, but should at least have time, website name, url and content fields. You can add more fields or tables if you wish.

It is essential that you include unittests. Without unittests there is no way to verify that your solution actually works, and thus we will assume that it does not. However, you do not need 100% coverage. Your unittests should give confidence that the essential features are working, that is enough.

## Evaluation

Your solution will be judged on the following criteria:

- completeness of the solution
- clear overall design
- readability of the code
- clear instructions on how to run your solution
- unittests
- documentation
- use of git

Bonus points:

- Architecture that allows for monitoring more than 1 website
- Use of docker for the database
- Use of docker for containerizing your application

## Submission

Host your repository online (e.g. on github), make sure that it is public so that we can see it, and tell us the URL.
