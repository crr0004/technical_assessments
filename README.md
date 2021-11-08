# Quickstart
`npm install`

`npm run test`

You can lint with `npm run lint`.

# Notes
The basic structure of the program is a state machine and delegating frame scoring and finishing to classes.

The reason for mixing classes and more functional style is that state machines work a bit better with functional style programming. The classes allow for inhertiance for the scoring and finished frame functions. You can do this with just functional programming of course.

The commit time logs aren't accurate for all time spent programming, I took breaks.

# Areas of Improvement With More Time
- Split the types and classes out into their own files
- Fix up LastFrame and rollLastFrame handling
- Maybe move more functions into the classes
- Create a stronger architectural barrier between the classes and the state machine.
- Use typescript indexing so don't have to keep accessing rolls[n]
- Add more tests around different combinations of games
- Add function and class signature documentation