# Practice flow

Status: ready-for-agent

## Problem Statement

Students who cannot reliably read an analog clock have no good place to
practice. A middle school teacher who wants to shore up this basic skill can
find worksheets and can find games buried in advertising, but nothing that is
simply a clock, a question, and honest feedback. He also has no way of knowing
whether a student actually practiced, short of standing over them.

Students who do practice tend to practice one half of the skill. They get good
at looking at a Clock Face and naming the time, and stay bad at hearing a time
and picturing the clock. And almost all of them carry the same specific
misconception: at 3:45 the hour hand is nearly touching the 4, so they say it is
4:45. Worksheets mark that wrong without ever explaining it.

## Solution

A student opens clockliteracy.com, picks a Level and how long they want to
practice, and works through a Round. Questions alternate between the two
Directions, so they practice reading a Clock Face and picturing one from a time
in the same sitting. Feedback is immediate, and a wrong answer does not just
show the right one — it names the hand the student misread and states the rule
they missed.

At the end they see their score, see the Questions they missed redrawn as
clocks, and can print a one-page Practice Report with their name on it to hand
to their teacher. Nothing is stored anywhere but their own browser and no
account is ever created.

## User Stories

1. As a student, I want to pick my Level before starting, so that I can practice
   at a difficulty that is not humiliating or boring.
2. As a student, I want to choose whether a Round is 5, 10, or 20 Questions, so
   that I can fit practice into the time I actually have.
3. As a student, I want the Round to default to 10 Questions, so that I can just
   start without making a decision.
4. As a student, I want to see a clear Clock Face with the hour numbers and
   minute ticks, so that I have the same information a real clock gives me.
5. As a student at the Easy Level, I want the minute hand to land only on the
   quarter hours, so that I can learn the shape of o'clock, quarter past, half
   past and quarter to before anything else.
6. As a student at the Medium Level, I want the minute hand to land on any
   five-minute mark, so that I practice counting around the dial by fives.
7. As a student at the Hard Level, I want the minute hand to land on any minute,
   so that I have to count individual ticks.
8. As a student at the Easy or Medium Level, I want to choose from four answers,
   so that I have a way in even when I am unsure.
9. As a student at the Hard Level, I want to type the time myself, so that I
   cannot guess my way to a right answer.
10. As a student typing a time, I want separate boxes for the hour and the
    minute, so that I never have to worry about how to punctuate it.
11. As a student typing a time on a tablet or phone, I want a number keypad, so
    that I am not hunting through a full keyboard.
12. As a student typing a minute, I want to be able to enter 7 rather than 07,
    so that I am not marked wrong for formatting.
13. As a student, I want some Questions to show me a time and ask which Clock
    Face matches, so that I practice the skill in both Directions.
14. As a student, I want both Directions to appear in roughly equal numbers
    within a Round, so that I cannot accidentally avoid the harder one.
15. As a student, I want the order of Directions to feel unpredictable, so that
    I stay attentive rather than settling into a rhythm.
16. As a student, I want to be told immediately whether I was right, so that I
    am not carrying uncertainty through the rest of the Round.
17. As a student who answers correctly, I want the Round to move on by itself
    after a moment, so that practice keeps its momentum.
18. As a student who answers wrongly, I want the Round to wait for me to click,
    so that I am not rushed past the explanation.
19. As a student who answers wrongly, I want the Clock Face to stay on screen
    with the hand I misread highlighted, so that I can see my mistake on the
    actual clock rather than in the abstract.
20. As a student who committed an Hour Slip, I want to be told that the hour
    hand is between two numbers and has not reached the later one yet, so that I
    learn the rule instead of just the answer.
21. As a student who swapped the hands, I want to be told which hand is which
    and that the shorter one is the hour hand, so that the correction addresses
    the mistake I actually made.
22. As a student, I want the wrong answers offered to me to be plausible times I
    might have derived from the clock, so that guessing does not work and the
    exercise is honest.
23. As a student, I want the hour hand to sit correctly between the numbers as
    the hour progresses, so that I am learning to read real clocks and not a
    simplified fiction.
24. As a student, I want to see an AM or PM label beside every clock, so that a
    time always arrives attached to a part of the day.
25. As a student, I do not want to have to decide or enter whether a time is AM
    or PM, so that I am never asked to guess something the dial cannot tell me.
26. As a student, I want no time limit or countdown, so that I can think.
27. As a student, I want no repeated times within a Round, so that practice
    covers ground rather than circling.
28. As a student, I want a results screen with my score, so that I know how I
    did.
29. As a student, I want the Questions I missed redrawn on the results screen,
    so that I can review my mistakes together at the end.
30. As a student, I want to start another Round in one click, so that practicing
    twice is easy.
31. As a student, I want to type my name when I print, so that my teacher knows
    whose work it is.
32. As a student, I want my name remembered next time, so that I am not retyping
    it every session.
33. As a student on a shared device, I want the remembered name shown in an
    editable box when I print, so that I notice and fix it when it belongs to
    whoever used this Chromebook before me.
34. As a student, I want to print a one-page Practice Report, so that I have
    something physical to hand in.
35. As a student, I want the Practice Report to redraw the clocks I got wrong,
    so that my teacher can see what confused me rather than just that I was
    wrong.
36. As a student, I want a Save as PDF option through the normal print dialog,
    so that I can send the file instead of printing paper.
37. As a student who started a new Round before printing the last one, I want to
    be offered the earlier Round to print, so that my work is not lost by a
    stray click.
38. As a student, I do not want to create an account or log in, so that I can
    start practicing in one click.
39. As a student on a phone, I want the four candidate clocks in a 2x2 grid, so
    that I can see all four at once and compare them.
40. As a student on a phone, I do not want to scroll to see the fourth clock, so
    that comparison is possible at all.
41. As a student using a screen reader, I want the Clock Face described by where
    its hands point rather than by the time it shows, so that the exercise is
    still an exercise.
42. As a student at a whiteboard, I want the clock and controls to scale up, so
    that the class can see what I am doing.
43. As a teacher, I want to tell my class to do a specific Level, so that the
    whole room is practicing the same thing.
44. As a teacher, I want to hand out a link that opens straight to a Level, so
    that I do not spend the first five minutes on setup instructions.
45. As a teacher, I want the Practice Report to carry the student's name, the
    date, the Level and the score, so that it works as evidence of practice.
46. As a teacher, I want the Practice Report to fit one page, so that collecting
    thirty of them is manageable.
47. As a teacher, I want no student data to leave the device, so that I do not
    have to think about privacy paperwork.
48. As a teacher, I want nothing to administer, so that using this costs me no
    setup time.
49. As a teacher, I want the tool to work on Chromebooks, iPads, phones and the
    classroom whiteboard, so that it works with whatever my room has that day.

## Implementation Decisions

### Levels and time generation

Three Levels form a ladder in what times can appear, not in what the Clock Face
looks like. Easy draws minutes from the quarter hours only. Medium draws from
the twelve five-minute marks. Hard draws from any of the sixty minutes. The hour
is always 1 to 12.

The Clock Face is identical at every Level: twelve hour numerals, sixty minute
ticks, no outer minute numbers, ever. There is no scaffolding toggle. This is a
reversal of an earlier design that varied the dial by Level, and it means the
feedback text carries all of the teaching load.

### Meridiem

Every Question carries a Meridiem, chosen at random per Question, displayed
above and to the right of the Clock Face. It is context only. No Question
depends on it, it is never entered, and it is never a Distractor dimension. In
the Time-to-Clock Direction a single Meridiem label sits above the group of four
candidate clocks rather than one label per clock, so that it can never be used
to eliminate an option without reading a dial. It is styled as a quiet label
rather than a control so that students do not hunt for something to do with it.

### Hand geometry

The hour hand is positioned proportionally within the hour at every Level: at
3:45 it sits three quarters of the way from the 3 to the 4. This is the single
most important rendering decision in the project, because the misconception the
tool exists to correct depends on the clock being honest about it.

### Round construction

A Round is built up front from a Level and a length of 5, 10 or 20. Directions
are split as evenly as the length allows and then shuffled, so a 5-Question
Round is 3 and 2 rather than 5 and 0. No time repeats within a Round; the 20
maximum sits comfortably inside the 48 distinct times the Easy Level can
produce.

### Distractors

Each multiple-choice Question offers exactly four unique options, one correct.
Distractors model real student errors rather than random times:

- **Hour Slip** — naming the hour the minute hand is approaching rather than the
  one it has left. Always included when the minute is past 30, because that is
  precisely when the hour hand appears closer to the next numeral.
- **Swapped hands** — the hour read from where the minute hand points and the
  minute read from where the hour hand points.
- **Off by five minutes** — a miscount while counting by fives. Used at Medium.
- **Off by one or two ticks** — a miscount of individual minutes. Used at Hard.
- At Easy, where only four minute values exist, the pool fills from the other
  quarter hours alongside an Hour Slip.

Every option must be a time a student could plausibly have derived from that
Clock Face. Options are deduplicated before display.

### Feedback

Correct answers show a brief confirmation and advance automatically after
roughly a second. Wrong answers keep the Clock Face on screen, highlight the
misread hand, and require a click to continue. The explanation is selected by
which Distractor the student chose, so an Hour Slip and a swapped-hands error
receive different wording. Explanations name the hand, state the rule, then give
the answer, in short sentences.

### Modules

- A **time** module owning the representation of a time, generation per Level,
  and formatting.
- A **hand geometry** module converting a time to the two hand rotations.
- A **distractors** module producing the wrong-answer pool per Level.
- A **round** module composing the above into a Round: length, Direction
  balance, no repeats.
- A **storage** module wrapping localStorage: the current Round, the previous
  Round, the student name, and a printed flag per Round.
- Presentation components for the Clock Face, the two-box time input, the choice
  grid, and the feedback panel.

The Clock Face is rendered as SVG rather than canvas, per the project's stated
preference for DOM elements, and sized in viewport-relative units so that it
scales from phone to whiteboard without a separate presentation mode. Its
accessible label describes hand positions rather than the time, so that it does
not hand the answer to a screen reader user.

### Routes and persistence

The landing page keeps the root route. The practice route owns the entire flow —
setup, Questions, results — as steps within one route, and accepts a Level as a
query parameter so a teacher can link directly into a Level. A separate report
route holds the printable page, which keeps print styles off the interactive
screens.

Only the current and previous Round are persisted, per ADR-0001. There is no
long-term history and no start-screen display of past scores. The previous Round
is surfaced in exactly one situation: the results screen offers it for printing
when it exists and was never printed.

The Practice Report is produced by a print stylesheet and the browser's own
print dialog, not by a PDF library, so that the page stays DOM, stays
accessible, and prints to paper as readily as to a file. It covers the Round
just finished, carries name, date, Level, score and length, and redraws missed
Questions as black-and-white miniature clocks capped at six to hold one page.

### Build and deployment

The project deploys to Vercel using the Vercel adapter rather than the automatic
adapter it was scaffolded with, matching the one existing Vercel project in this
workspace. The product is named Clock Literacy and lives at clockliteracy.com.

## Testing Decisions

A good test here asserts the behaviour a caller can observe and says nothing
about how it was produced. It should survive a rewrite of the internals. Tests
assert properties over many generated Rounds using a seeded random source rather
than golden values, because the output is deliberately random and pinning exact
sequences would test the shuffle rather than the rules.

**One seam: the domain module's public surface**, exercised through two entry
points — building a Round from a Level, a length and a seeded random source, and
converting a time to hand rotations. Everything that can genuinely be wrong sits
behind that seam and is pure and deterministic.

What gets asserted:

- Generated minutes fall in the right set for each Level.
- Direction counts are balanced for even lengths and off by at most one for odd.
- No time repeats within a Round.
- Every multiple-choice Question carries exactly four unique options including
  the correct one.
- An Hour Slip appears whenever the minute is past 30.
- Distractors are drawn only from the modelled error types for that Level.
- Hand rotations are correct for known times, including that 3:45 places the
  hour hand three quarters of the way from 3 to 4.

**Prior art:** `tap-to-track` in this workspace keeps its pure logic in a domain
directory with colocated test files run under vitest, and has no component or
end-to-end tests. This project follows that pattern, including adding vitest to
the project's dependencies, which it currently lacks.

Deliberately untested: components, the localStorage wrapper, and the print
stylesheet. Component tests would require a DOM environment and assertions
against SVG structure, which is a second seam bought mostly in brittleness.

## Out of Scope

- Accounts, logins, rosters, and any teacher-facing dashboard or class view. See
  ADR-0001; the student is the transport for results.
- Dragging the hands to set a clock at the Hard Level. See ADR-0002.
- Long-term progress history. Only the last two Rounds survive.
- Minute numbers printed outside the dial, or any scaffolding that varies the
  Clock Face by Level.
- Asking the student to determine or enter AM or PM.
- A whiteboard presentation mode that hides answers until the teacher reveals
  them. Deferred pending confirmation of how the whiteboard is actually used.
- 24-hour times, worded times such as "quarter past three", elapsed-time
  problems, and languages other than English.
- Offline or installable app behaviour.
- The landing page itself, which is owned separately.

## Further Notes

Another agent is working in this repository concurrently and owns the landing
page at the root route, which it left the practice route free for. Its work was
uncommitted at the time of writing; this work starts only once that is
committed.

Three files owned by that agent need changes that are part of this work: the
Svelte config, to switch adapters; the landing page, to rebrand from the working
name to Clock Literacy; and the package manifest, to add vitest.

Development servers in this workspace must be started through the workspace port
allocator rather than directly, because multiple agents work here at once.

One question remains open with the teacher: whether the classroom whiteboard is
used by him to demonstrate to the class, or by students taking turns at it. The
build assumes students taking turns, which needs nothing beyond responsive
sizing. If he demonstrates, a reveal step replaces the automatic advance.
