# No accounts: localStorage plus a printed report

A teacher wants to see how students did, which normally argues for accounts and
a class dashboard. We chose instead to keep the current and previous Round in
the browser's localStorage and give the student a printable Practice Report to
hand in, so no student name or score ever leaves the device and the app stays a
static deploy with no backend, no auth, and nothing to administer.

## Consequences

There is deliberately no class view, no roster, no long-term progress history,
and no way for a teacher to pull results themselves — the student is the
transport. Only the last two Rounds survive, so that a student who starts a new
Round before printing can still recover the one before it. Shared classroom devices mean the stored name belongs to
whoever used the machine last, which is why the report asks the student to
confirm their name rather than assuming it.
