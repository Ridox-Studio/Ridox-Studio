---
title: "Building the best school management system in Nigeria: RISMS"
description: We didn't start with an AI pitch for education. We started by asking why adaptation, not money, is the thing actually holding Nigerian schools back, and built RISMS from the answer.
date: 2026-09-12
tags: [risms, education, product]
cover: /projects/risms.png
---

The Ridox team has spent a lot of time this year on the same question
everyone building software has: how does the rise of AI actually change
education, and specifically, what does it change for West Africa, and for
Nigeria in particular. It is an easy question to get excited about and a
much harder one to answer honestly, because we are a software team, not an
education policy team. We do not have deep standing in how Nigerian
curricula, exam boards or ministries actually operate day to day.

So we did not start by trying to import AI into the classroom. We started
by looking at what was actually happening on the ground, without assuming
we already understood it.

## The scale problem, in one dataset

Nigeria's own [Federal Ministry of Education Management Information
System](https://emis.education.gov.ng/) puts a number on how far there is
to go: as of the 2024/2025 school year, there are 222,888 schools
nationally, and only 55.7% of them have reported data at all, according to
the [Ministry's public data portal](https://emis.education.gov.ng/portal/).
That reporting rate is itself the finding. It means that for nearly half
the schools in the country, there is no reliable digital record of
enrollment, staffing or classroom conditions at the national level, not
because the schools don't exist, but because the basic pipeline for
getting their data anywhere doesn't.

That gap isn't evenly a money problem. It's an infrastructure and
maintenance problem, and the closer you look, the more specific the
failure mode gets.

## Adaptation isn't the same as "having a portal"

Assuming a school has gone digital because it has a website or a portal is
a mistake we made ourselves before looking closer. Some schools have
tried. That is arguably the more instructive case, because it shows what
happens after the initial build.

Looking at schools within reach of us, out of roughly twenty, only two had
a portal that actually worked for a parent or student trying to use it.
One of those two belongs to a group of schools maintained centrally by a
single company across multiple campuses, which is close to what a managed
platform looks like. The other was self-hosted, and carried the risk that
comes with that: a single point of failure, with no one clearly
responsible for keeping it patched or online.

We looked at a handful of others outside our immediate area too. One
school's site was built well enough on a general website builder, but had
no working link to any student portal at all, which defeats the purpose of
having one. Another had a portal link that resolved to an "expired
hosting" notice, suggesting the school's student data was sitting behind a
lapsed bill, if it still existed at all. A third had a portal that was
live, but threw a raw, unhandled application error directly to the public
the moment we tried to log in, the kind of failure that exposes server
file paths to anyone who happens to click through, and one that had
clearly been sitting untouched for a while.

None of these are hypothetical edge cases. They are what "we digitized"
looks like a year or two after the person who built it moved on, no one
renewed the hosting, and no one was watching for the day it broke. A
school that goes through the effort of commissioning a portal and still
ends up here isn't behind on ambition. It's carrying software with no one
accountable for keeping it alive, which in practice is often worse than
having stayed on paper: paper doesn't silently disappear when a hosting
invoice goes unpaid.

## Why this blocks AI specifically, not just digitization

This is where the AI-in-education question we started with actually
connects back to something concrete. Personalized, AI-assisted learning
only works if there's a reliable, ongoing record of each student: what
they've covered, where they're ahead, where they're stuck, and how that
changes week to week. Students are not uniform. Some grasp a topic
quickly, some need it repeated a different way, and any system that
claims to adapt to that needs a real, continuously updated source of truth
to adapt from.

A school without a functioning portal has no such source. Its data, if it
exists at all, is scattered across paper registers, one-off spreadsheets,
or a database sitting behind an expired hosting plan. There is nothing
for an AI layer to read from, and nothing that would still be there
reliably a term later even if there were. Trying to bring adaptive
learning tools into that environment isn't introducing a new capability on
solid ground, it's asking a system to personalize instruction for students
it has no consistent way to see.

Put plainly: a school that can't keep a portal online long enough to
survive one hosting renewal cycle is not close to being able to run AI
tools that need a stable, longitudinal record of every student and
teacher to be useful. Digitizing the basics isn't a nice-to-have that
happens alongside AI adoption. It's the precondition for it, and right
now, for a large share of Nigerian schools, that precondition isn't met.

## Building RISMS

[RISMS](https://risms.school/) covers academics, staff, students,
timetabling and fees, split across four persona surfaces so no single
screen has to serve every audience at once. A school admin, a teacher, a
bursar and a parent are not looking for the same thing, and forcing them
through one interface is part of what makes existing school software feel
heavier than it needs to.

A few decisions came directly out of watching how these failures actually
happen, not how school software usually assumes a school operates:

- **Timetabling refuses conflicts at entry.** Every timetable slot is
  checked against both the teacher's schedule and the class's schedule
  before it's allowed to exist, so a double-booking is refused when
  someone tries to create it, not discovered afterward by a teacher
  standing in the wrong room.
- **Cash is a first-class payment method.** Most school fees in Nigeria
  are still paid in cash over a counter, and [RISMS](https://risms.school/)
  treats a cash payment as its own gateway alongside the card processor:
  same receipt, same ledger entry, same audit trail, instead of bolting it
  on as an afterthought.
- **The school keeps its own money.** Each institution connects its own
  payment credentials, so fees a parent pays land straight in the school's
  account rather than sitting in ours first. [RISMS](https://risms.school/)
  records the transaction, it never holds the money.
- **A lapsed subscription freezes data, it doesn't delete it.** If a
  school fails to renew, their records are locked, not lost. Deletion only
  happens on the school's own request. The hosting-expiry failure we saw
  elsewhere is exactly what this is built to prevent.
- **A custom subdomain is included by default.** A school never has to
  separately manage or renew a domain to keep its portal reachable, and
  can bring their own domain later without re-platforming.
- **We maintain and patch the software centrally.** No school is carrying
  a one-off build that quietly stops getting updated the day the person
  who built it moves on to something else.
- **Bulk import from existing records.** Schools coming from Excel
  spreadsheets or paper registers don't have to re-enter years of student
  and staff data by hand. [RISMS](https://risms.school/) accepts bulk
  import so a school's existing records become the starting point, not a
  blocker to switching over.
- **Opening balances carry forward.** A student's unpaid fees from before
  a school adopted [RISMS](https://risms.school/) aren't lost or written
  off in the switch. Schools can record an opening balance per student, so
  outstanding bills from the old system stay tracked instead of quietly
  disappearing on transition.

None of these are AI features. They are the unglamorous administrative and
operational discipline that most self-hosted school software in this
market doesn't have, and it's the layer that has to hold before anything
adaptive or AI-driven can be built on top of it responsibly.

Cost is part of that discipline too. [RISMS](https://risms.school/) is
built with different plans so a school pays for what it actually needs
rather than one fixed package, and pricing on our site currently runs
roughly ₦150-250 per student per term depending on plan, well under what
we've seen schools quoted elsewhere in the ₦700-1,000 range. The core
argument of this piece is that adaptation, not money, is the harder
problem, but that doesn't mean cost shouldn't also stop being a reason a
school delays making the switch.

## Beyond the portal: closing the data gap the Ministry itself flagged

The 55.7% reporting rate we opened with is not just a statistic about the
past, it's a live gap that shapes decisions today. Government and NGO
programs aimed at improving ICT infrastructure in schools can only reach
where there's visibility. A school with no functioning digital record is,
in practice, invisible to that kind of intervention, which means the
schools furthest behind are also the hardest ones to identify and help.

As schools adopt [RISMS](https://risms.school/), we're positioning it to
help close that visibility gap rather than sit next to it. Aggregated,
anonymized data on IT and ICT adoption across the schools on our platform,
things like how much of a school's record-keeping is still manual at the
point they join, and how that changes over time, gives a picture of where
slow digital integration is actually happening. That's information the
Ministry's own [DNEMIS system](https://emis.education.gov.ng/) is already
trying to gather nationally. Longer-term, we want
[RISMS](https://risms.school/) to make it easier to have that conversation
with government and NGO partners: not by replacing DNEMIS, but by giving
it more of the ground-level visibility it needs to find and prioritize the
schools that need help most.

This isn't built yet. It's the direction the platform is heading in as
more schools come on board, and it's part of why getting schools onto a
proper system matters beyond any one school's own convenience. Any data
shared this way would be aggregated and anonymized at the school level,
never tied back to an individual student, teacher, or family without
their consent.

---

*RISMS is in active development. If you run a school and want to see the
current build, [get in touch](/contact); we are onboarding pilot schools
now.*
