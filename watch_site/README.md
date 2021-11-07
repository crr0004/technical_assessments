# Quickstart
## Install and Run
`python -m pip install -r requirements.txt`

`python src/main.py --help`

Watch nytimes.com:

`python src/main.py nytimes.com.au -s "host=localhost port=5432 dbname=sites user=watchsite password=watchsite"`

## Docker
Build container: `docker build . -t watchsite`

Run database: `docker-compose up`

Run webapp: `docker run -it --rm watchsite -p 5 https://nytimes.com -s "host=$(hostname) port=5432 dbname=sites user=watchsite password=watchsite"`

We only use docker-compose for the database as it allows it to persist a bit easier and allows for setting init scripts easily. I am aware of how annoying that is. It is what happens with SQL is run in containers.

## Test
`python -m unittest discover -s src`

### Test SQL
This requires an active database to be running. You can set one up with the schema under setup.sql.

`python -m unittest discover -s src -p sql_test_*.py`

### Coverage
`coverage run -m unittest discover -s src; coverage html`

## Lint
`pylint`

## SQl Setup
Run setup.sql with a postgres database to create the isentisa user and database.

# Implementation Notes
Over all, this solution is rather over-engineered and could completed with a simple loop that uses BeautifulSoup to parse the HTML, clean it up, calculate the diff and print it. I abstracted the core logic out to show how you can enable easier changes going forward.

## Why Split Sections into abstract classes
I split the actions that most of the system takes into seperate abstract classes to enable more flexiable changes in how each component does its job. 
For example, changing how the difference between two instances of a site is determined should not impact how the site is fetched and strained.

## Why Create a new data structure for the basic module
I created a module for the basic implementation that inherits from the runner version because it enables the basic module to retain data between each component.
This does have the side affect that any new implementations need to handle the SoupSite version or re-implementation all the actions.

## General Notes
A lot of this is quite rough around the edges, however the core implementation of the business logic is reasonable. The biggest issue is working with websites that don't return the same page everytime. Nytimes does this. Everytime you send a new request, the page changes slightly.

You can view the Architecture.drawio on https://app.diagrams.net/

### Areas of Improvement
- Documentation could be improved around what certain functions do
- Integration testing
- Fix linting so it isn't so noisy
- Module exports of the basic module so you can import everyone on one line instead of several
- Split type interfaces out to seperate files
- Build system so running the program, testing and linting is easier