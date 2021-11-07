# Quick Start
Can run with 
```
npm run build && npm run start -- --file=data/full_tournament.txt 
```
You will be prompted to type your queries. You can type `help` once the program has started to get more information.

# Test Coverage
I don't collect test coverage from index.ts because the unit test don't cover testing that file. It would need to be in an integration test which would require a seperate tool

# Implementation Notes
I have tried to balance the implementation of this around showing my skills and keeping things simple, readable, testable and maintainable. The state machine implementation for parsing the files is over engineering a bit however does allow for a lot of testing and extensibility.

I have done my best to cover for the edge cases and error handling I could think of and reasonably implement so there may be things missing there. One case I think of that I haven't covered is for large files. Currently the whole file is read into memory and parsed, this could choke on large files.

The queries are based around matches so for querying player stats, each match needs to be scanned. You could pivot this to be player lookup, match scanned or add another stat map for players so both can be lookup based.

This was built and tested on Linux so other operating systems may not work.

# Assumptions
- Match ids are numerical but not ordinal
- Each Match is complete. Some error handling is done but may be incomplete for some unknown edge cases.