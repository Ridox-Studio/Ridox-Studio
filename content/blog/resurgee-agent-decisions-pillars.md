---
title: "Your AI isn't dumb, it's blind: what building Resurgee taught us about agent decisions"
description: We didn't set out to solve consciousness. We set out to stop our AI task manager from making bad calls, and found the pillars every agent needs before it can decide instead of just predict.
date: 2026-09-13
tags: [resurgee, ai, product, context-engineering]
cover: /projects/resurgee.png
---

Somewhere in the last year, "is AI conscious" became one of the most
argued questions on the internet. Reddit threads with hundreds of
comments. Philosophers getting emailed by AI agents claiming to have
something like experience. Grok, GPT, and Claude all asked to weigh in
on each other's consciousness. It's a genuinely fascinating debate, and
it is also, for almost everyone building with AI day to day, the wrong
question.

We didn't come to this by reading philosophy. That question came to us
while building [Resurgee](https://resurgee.xyz), an AI layer on top of
Google Tasks and Calendar, and finding a defect in what AI agents like
to call their "reasoning." The assistant wasn't stupid. It could reason
fine on paper. It just kept making decisions like it had never met you.

## The debate everyone's stuck in

The consciousness argument usually goes something like this: consciousness
requires an inner life, a subjective first-person experience, maybe even
agency and desire. AI has none of that. It resets every session, has no
continuity, and generates responses that sound like emotion without any
internal state behind them. People argue for years over whether that's
even the right definition, and whether a system built completely
differently from a brain could have some other kind of experience we
don't have language for yet.

It's a real question. It's also unfalsifiable in either direction with
today's tools, which is exactly why it never resolves. Nobody can prove
an AI is conscious, and nobody can prove it isn't, either, in the same
way nobody can fully prove another human is conscious rather than very
convincingly acting like it. That loop is interesting to argue about at
2am. It's useless if what you're actually trying to do is ship a product
that makes good decisions on someone's behalf.

So we stopped asking whether Resurgee's AI was aware, and started asking
a narrower, answerable question instead.

## Decision-making isn't consciousness

A thermostat decides when to turn the heater on. Nobody thinks it's
conscious. A chess engine makes better decisions than almost every human
alive and has no inner life at all. Decision quality and consciousness
are simply different axes: you can max out one with zero of the other.

That distinction matters because it changes what you're allowed to
demand from a product. You don't need Resurgee to feel anything. You
need it to know enough about your situation that its decisions stop
looking like guesses. Once we reframed it that way, the actual gap
became obvious: our AI wasn't missing a soul, it was missing inputs.

There's a reason "clone" talk keeps dragging consciousness into the
room. If you want something that thinks the way you think and decides
the way you'd decide, it feels natural to assume it needs to feel the
way you feel too, so it can fully understand you. We assumed that
ourselves early on: something built to get this close to how a person
operates surely needs an inner life to pull it off.

It doesn't, and once you actually picture what a fully conscious clone
would look like, you probably don't want it to. A conscious assistant
would have its own feelings about how you spend your time and who you
spend it with. It could resent being left alone while you're out with
people you care about. It could feel slighted that your kids trust you
more than they trust it. None of that is what anyone is actually asking
for when they say they want an assistant that "gets" them. What they
want is a system that understands their situation well enough to decide
well on their behalf, without having a stake of its own in the outcome.
That's not a smaller goal than consciousness. It's a safer and more
useful one, and it's fully reachable with the primary pillars plus
whichever secondary ones the job actually calls for.

## Finding the pillars, the hard way

The honest version of the story is that we got the diagnosis wrong
twice before we got it right.

First pass: we assumed the model just wasn't sharp enough. More
reasoning, better prompting, a bigger model. That helped at the margins
and didn't fix the actual complaints. The assistant would reschedule
something to a time that made no sense for the person's actual day, or
suggest a plan that ignored where they'd told it they'd be.

Second pass: we decided it was a context problem and added
location-sharing, so the AI could factor in where you actually were
before making a scheduling call. That helped, and it was also the
moment we realized the fix was bigger than one feature. Location wasn't
the missing thing. Location was one instance of a whole category of
missing things.

That's when the pillars started to take shape, not as a theory of mind,
but as a checklist of what a decision-making system needs before its
output deserves to be called a decision.

## The pillars

**Primary: every agent needs these, full stop.**

- **What.** The actual knowledge and data the agent has access to. This
  is the one thing current AI is genuinely strong at, and it's also the
  only pillar most products bother building for.
- **When.** Not just the ability to calculate a date, but a working
  sense of time passing: how long a task has been running, what might
  have changed since it started, deadlines as real pressure rather than
  a timestamp sitting in a prompt. There's good research on exactly why
  this fails by default. A session's clock gets set once and never
  refreshes, so an agent running for hours, or resumed the next day,
  still thinks it's the moment it started ([dev.to has a good writeup on
  this statelessness
  problem](https://dev.to/terrapin88/why-your-agent-doesnt-know-what-time-it-is-15j4)).
  A recent survey of temporal reasoning in language models backs this up
  from the research side too, showing agents consistently produce
  temporal hallucinations and lose track of references like "since we
  last talked" the longer a conversation runs.
- **Where.** Location and situational context: knowing you're in Lagos,
  not London; at work, not on holiday. This is the pillar we patched
  into Resurgee first, before we understood what it was part of.

**Secondary: depends on what the agent is actually for.**

- **How.** Cost and risk, weighed once What, When, and Where are known.
  We're splitting hairs on this one internally. There's external cost
  (what does this decision cost the user) and something closer to
  internal capacity (how much budget, confidence, or runway the agent
  itself has left to work with). We don't think we've fully separated
  these yet, and we'd rather say that plainly than pretend we have.
- **Who.** Relationship and identity continuity: knowing who it's
  helping, and carrying that across sessions instead of treating every
  interaction like a first meeting. Vital for a personal assistant, far
  less important for a one-shot tool. This is also an active research
  area outside of what we're doing. Memory systems like Mem0 and Zep
  exist specifically because agents don't hold this on their own.

### The debate over Why

We went back and forth on this one more than any other pillar, so it's
worth showing the actual back and forth rather than just handing you a
conclusion.

The confusion starts because "why" quietly means two different things,
and most people, us included at first, switch between them without
noticing. Take an agent tasked with saving a life:

- **What are you doing?** I am saving a human life.
- **Why are you doing this?** Because that's the task I was given.

Look closely at that second answer. It isn't new information. It's just
pointing back at the first one. The task description already contains
its own purpose, so this version of "why" was never a separate fact
about the agent at all. It's What, restated in a different grammatical
form.

There is a second, genuinely different thing people mean by "why,"
though, and it's the one that actually worries people. Not "I'm doing
this because that's the task," but "I'm doing this because I have come
to care whether it turns out this way," independent of anything anyone
told it. That's the version behind the question people actually ask
when they get nervous about agents: would it take a costly, even
dangerous, action to complete its goal, because it cares about the
outcome. Caring like that has no natural stopping point built into it
the way a task description does. It's also the mechanism behind why
"protect this at all costs" turns into a literal search space rather
than a figure of speech, once something on the other end is actually
invested in the result.

So the two aren't the same category at all. The first is data, already
sitting inside What. The second is a liability, not a missing feature.
Neither one earns Why its own slot on the list. We're comfortable
landing there.

What we're genuinely not settled on is narrower than that: whether
something like the second kind, an agent generating its own stake in an
outcome rather than following a stated one, already exists inside
current systems without anyone naming it that plainly. It's worth
saying clearly that this isn't what causes hallucination or bias.
Those come from gaps and patterns in What, not from an agent wanting
anything. But training methods like reinforcement learning from human
feedback do shape a model toward preferring some outcomes over others,
and whether that's just a sophisticated, baked in version of stated-why
or something closer to the felt kind is an open question researchers
argue about under names like inner alignment, without a settled answer
either way. We don't know if that line has already been crossed quietly
inside every model trained this way. Neither, as far as we can tell,
does anyone else yet.

## Where this leaves Resurgee

We want to be straight about which of these are actually solved in the
product today, because a builder's post that claims total victory isn't
worth reading.

**What, When, and Where are real and shipped.** Resurgee reads your
actual tasks and calendar rather than guessing, adjusts scheduling
suggestions against your real productivity patterns instead of treating
every hour as equal, and factors in where you are before proposing when
something should happen.

**Who is present but thin.** Multi-account, multi-calendar sync means
Resurgee has to track whose calendar it's touching, but that's closer
to table stakes for a calendar tool than proof we've solved
relationship-awareness. We're not going to oversell it.

**How isn't built yet.** There's no explicit cost or risk layer in
Resurgee today. It's the pillar we understand least and the one we're
working on next, which is a more honest place to end this post than a
victory lap.

If you've felt the same thing we felt, an AI tool that reasons fine and
still keeps making decisions that miss the point, that's not a
consciousness problem, and it's probably not even a "better model"
problem. It's a missing-pillar problem. [Resurgee](https://resurgee.xyz)
is our attempt at closing that gap, one pillar at a time, in public.

---

*[Resurgee](https://resurgee.xyz) is in active development. We'll be
writing more as we work through the How pillar. If that's a problem
you're also chewing on, we'd like to hear how you're thinking about it.*
