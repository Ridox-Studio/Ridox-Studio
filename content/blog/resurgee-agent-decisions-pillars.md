---
title: "Why AI assistants make bad decisions, and what we learned building Resurgee"
description: "My AI is dumb" usually isn't true. Building Resurgee, we found the inputs an AI agent needs before its choices count as decisions instead of guesses.
date: 2026-09-13
updated: 2026-10-22
tags: [resurgee, ai, product, context-engineering]
cover: /projects/resurgee.png
---

At some point in the last year, "is AI conscious?" became one of the most
argued questions online. Reddit threads with hundreds of comments.
Philosophers getting emails from AI agents claiming something like
experience. Grok, GPT and Claude all asked to weigh in on each other. It's
a fascinating argument, but it mostly happens in public discussion, not in
the rooms where these systems get built. For most people shipping agents
every day, it's the wrong question to get stuck on.

We didn't get here by reading philosophy. The question found us while we
were building [Resurgee](https://resurgee.xyz), an AI layer on top of
Google Tasks and Calendar. People kept telling us "my AI is dumb". It
wasn't. It could reason fine on paper. It just kept making decisions as
if it had never met you.

## Is AI conscious? The debate everyone's stuck in

The argument usually runs like this. Consciousness needs an inner life, a
first-person experience, maybe agency and desire. AI has none of that. It
resets every session, has no continuity, and produces responses that sound
emotional with no internal state behind them. People then argue for years
about whether that's the right definition, and whether something built
nothing like a brain could have a kind of experience we don't have words
for yet.

There's a real problem underneath it. We can't directly observe anyone
else's subjective experience, so there's no reliable test for machine
consciousness either way. The accurate claim is a narrow one: there's no
strong evidence that today's models have subjective experience, and no
test that would settle it if they did. That doesn't make the two answers
equally likely, and either way it doesn't decide whether a product works.
It's a fun loop to argue about at 2am. It's no help when you're trying to
ship something that makes good decisions on someone's behalf.

So we stopped asking whether Resurgee's AI was aware, and asked a smaller
question we could answer.

## Making good decisions doesn't require consciousness

A thermostat decides when to turn the heating on, and nobody thinks it's
conscious. A chess engine makes better moves than almost every human alive
with no inner life at all. Decision quality and consciousness sit on
different axes. You can max out one and have none of the other.

That changes what you can ask of a product. You don't need Resurgee to
feel anything. You need it to know enough about your situation that its
choices stop looking like guesses. Once we framed it that way the gap was
obvious. The AI wasn't missing a soul. It was missing inputs.

There's a reason talk of AI "clones" keeps pulling consciousness into the
conversation. If you want something that thinks and decides the way you
would, it feels natural to assume it also has to feel the way you do in
order to understand you. We assumed that too, early on.

It doesn't, and a conscious clone would bring problems of its own. An
assistant with real feelings about how you spend your time, and who with,
would have its own interests competing with yours. That's not what people
mean when they say they want an assistant that "gets" them. They want one
that understands their situation well enough to decide well for them, with
no stake of its own in the result. That goal is safer, more useful, and
reachable today with the right inputs, which we ended up calling pillars.

## Finding the pillars, the hard way

We got the diagnosis wrong twice before we got it right.

First we assumed the model wasn't sharp enough. More reasoning, better
prompts, a bigger model. That helped a little and didn't fix the actual
complaints. The assistant would move something to a time that made no
sense for the person's day, or suggest a plan that ignored where they'd
said they would be.

Then we decided it was a context problem and added location sharing, so
the AI could factor in where you were before scheduling anything. That
helped, and it was also when we saw the fix was bigger than one feature.
Location wasn't the missing piece. It was one example of a whole category
of missing pieces.

That's when the pillars took shape. They aren't a theory of mind. They're
a checklist of what a system needs before its output deserves to be called
a decision. To be clear, this is our own way of organising things, not a
new discovery. Context engineering, temporal grounding and persistent
memory are all areas the agent-infrastructure world has been working on
for a while. What we're adding is names for what we kept running into,
taken from a real failure rather than drawn on a whiteboard first.

## The pillars an AI agent needs to make good decisions

**Primary pillars. Any agent making real decisions on someone's behalf
needs these.**

- **What.** The knowledge, data and task the agent has to work with. This
  is the part current AI is strongest at, though having information isn't
  the same as having the right, current and properly weighted
  information. Stale or conflicting data here can still produce a bad
  decision when nothing else is missing.
- **When.** More than calculating a date. A working sense of time passing:
  how long a task has been running, what might have changed since it
  started, deadlines as real pressure rather than a timestamp in a prompt.
  This is a well-documented engineering problem. A model call is stateless
  by default, and unless the application keeps updating the time it's
  given, an agent can't notice hours or days passing between turns. One
  developer wrote up exactly this after their agent kept acting as if it
  were still the day the session started ([the writeup is
  here](https://dev.to/terrapin88/why-your-agent-doesnt-know-what-time-it-is-15j4)).
  An academic survey of temporal reasoning in language models describes
  the same kind of failure at research level: models losing track of
  phrases like "since we last talked" and giving answers that contradict
  each other on time as a conversation gets longer ([the survey is
  here](https://arxiv.org/pdf/2505.20243)).
- **Where.** Location and situation: knowing you're in Lagos, not London,
  at work, not on holiday. This is the pillar we added to Resurgee first,
  before we understood it was part of a set.

**Secondary pillars. Whether you need these depends on what the agent is
for.**

- **How.** Cost and risk, weighed once What, When and Where are known.
  We're still arguing about this one internally. There's the external
  cost (what a decision costs the user) and something closer to internal
  capacity (how much budget, confidence or runway the agent has left). We
  haven't fully separated the two yet, and we'd rather say so than pretend
  we have.
- **Who.** Knowing who it's helping, and carrying that across sessions
  instead of treating every conversation as a first meeting. Vital for a
  personal assistant, much less important for a one-off tool. Plenty of
  people outside our team are working on this too. Memory systems like
  Mem0 and Zep exist because agents don't keep this on their own.

### The debate over Why

We went back and forth on this pillar more than any other, so here's the
actual argument rather than just our conclusion.

The confusion is that "why" quietly means two different things, and most
people, us included at first, switch between them without noticing. Take
an agent whose task is to save a life:

- **What are you doing?** I am saving a human life.
- **Why are you doing this?** Because that's the task I was given.

Look at the second answer. It adds nothing new. It points back at the
first one. The task already contains its own purpose, so this kind of
"why" was never a separate fact about the agent. It's What, said a
different way.

People sometimes mean something else by "why", though. Not "because that's
my task" but "because I've come to care how this turns out", whatever
anyone told it. Whether current training methods produce anything like
that is an open question in AI safety research, usually discussed as inner
alignment, and we won't pretend to settle it here. What we can say is why
it matters for something like Resurgee. A scheduling assistant only needs
the first kind of why, the one that points back to the task you gave it.
If it ever needed the second kind to do its job, we'd have built the wrong
kind of agent. So our practical rule is simple even though the research
question isn't: keep the agent tied to the goals it was given, and treat
any sign of it developing its own stake in the outcome as a bug.

## What Resurgee does today

Here's which of these the product actually handles today. A builder's post
that claims total victory isn't worth reading.

**What, When and Where are shipped.** Resurgee reads your real tasks and
calendar instead of guessing, adjusts its scheduling suggestions to your
own productivity patterns instead of treating every hour the same, and
takes into account where you are before suggesting when something should
happen.

**Who is there, but thin.** Multi-account, multi-calendar sync means
Resurgee has to track whose calendar it's touching. That's basic for a
calendar tool, not proof we've solved knowing who you are, and we won't
oversell it.

**How isn't built yet.** There's no cost or risk layer in Resurgee today.
It's the pillar we understand least, and it's what we're working on next.

If you've used an AI tool that reasons fine and still makes decisions that
miss the point, the problem probably isn't consciousness, and it may not
be the model either. More likely one of these pillars is missing.
[Resurgee](https://resurgee.xyz) is our attempt to fill them in, one at a
time, in public. You can read more about it on our
[Resurgee product page](/studio/resurgee).

---

*Resurgee is in active development, and we'll write more as we work
through the How pillar. If you're working on the same problem, we'd like
to hear how you're thinking about it. [Get in touch](/contact).*
