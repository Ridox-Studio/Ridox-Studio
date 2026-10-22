---
title: "Why Nigerian school portals keep failing, and how we built RISMS"
description: Only 55.7% of Nigeria's schools report data to the Ministry. What we found checking school portals, and how it shaped RISMS, our school management system.
date: 2026-09-12
updated: 2026-10-22
tags: [risms, education, product]
cover: /projects/risms.png
---

Like most software teams this year, we kept coming back to one question:
what does AI actually change for education in West Africa, and in Nigeria
in particular? It's an easy question to get excited about and a hard one
to answer honestly. We're a software team, not an education policy team,
and we don't have deep knowledge of how Nigerian curricula, exam boards or
ministries work day to day.

So we didn't start by trying to bring AI into the classroom. We started by
looking at what schools around us were actually running, without assuming
we already knew.

## How many Nigerian schools have usable digital records?

Nigeria's [Federal Ministry of Education Management Information
System](https://emis.education.gov.ng/) (DNEMIS) gives a useful starting
number. For the 2024/2025 school year it lists 222,888 schools nationally,
and only 55.7% of them have reported any data, according to the
[Ministry's public data portal](https://emis.education.gov.ng/portal/).

That reporting rate tells you more than the school count does. For nearly
half the schools in the country there's no reliable national record of
enrolment, staffing or classroom conditions. The schools exist. The
pipeline that would get their data anywhere doesn't.

We don't think that's mainly about money. From what we've seen it's about
infrastructure and maintenance, and the closer you look, the more specific
the problems get.

## What we found when we checked school portals

We assumed at first that a school with a website or a portal had already
gone digital. That turned out to be wrong, and the schools that had tried
were the most useful to look at, because they show what happens after the
first build.

Of roughly twenty schools within reach of us, only two had a portal that
worked for a parent or student trying to use it. One belongs to a group of
schools whose portals are maintained centrally by one company across
several campuses, which is close to what a managed platform looks like.
The other was self-hosted, with the usual risk: one point of failure and
nobody clearly responsible for keeping it patched or online.

We looked at a few more schools further away. One had a decent site built
on a general website builder but no working link to a student portal at
all. Another's portal link led to an "expired hosting" notice, so the
school's student data was sitting behind an unpaid bill, if it still
existed. A third had a live portal that showed a raw application error to
the public as soon as we tried to log in. Errors like that can expose
server file paths to anyone who clicks through, and this one had clearly
been there a while.

These were real schools, not made-up examples. This is what "we went
digital" tends to look like a year or two later, after the person who
built the portal has moved on and nobody renewed the hosting or noticed it
break. The schools in these stories had the ambition and paid for a
portal. What they didn't have was anyone responsible for keeping it
running. In some ways that's worse than staying on paper, because paper
doesn't disappear when a hosting invoice goes unpaid.

## Why AI in Nigerian classrooms has to wait for the basics

This is where our original AI question comes back in. Personalised,
AI-assisted learning needs a reliable, ongoing record of each student:
what they've covered, where they're ahead, where they're stuck and how
that changes week to week. Students learn at different speeds. Any system
that claims to adapt to them needs an up-to-date record to adapt from.

A school without a working portal doesn't have that record. Whatever data
it has is spread across paper registers, one-off spreadsheets or a
database behind an expired hosting plan. An AI tool would have nothing
consistent to read, and nothing guaranteed to still be there next term.

If a school can't keep its portal online through one hosting renewal, it
isn't close to running AI tools that depend on years of student and
teacher records. Getting the basics digital comes first. Right now, for a
large share of Nigerian schools, that first step hasn't happened.

## How we built RISMS around those failures

[RISMS](https://risms.school/) is school management software for Nigerian
schools. It covers academics, staff, students, timetables and fees, with
separate views for admins, teachers, bursars and parents. Those four
people want different things from the same system, and putting them all
through one screen is part of why a lot of school software feels heavier
than it needs to.

Several decisions came straight from the failures above:

- **Timetables refuse clashes when you enter them.** Every slot is checked
  against the teacher's schedule and the class's schedule before it's
  saved. A double booking is refused at the point someone creates it, so
  a teacher doesn't find out by standing in the wrong room.
- **Cash is treated as a real payment method.** Most school fees in
  Nigeria are still paid in cash at a counter. RISMS records a cash
  payment the same way as a card payment: same receipt, same ledger entry,
  same audit trail.
- **The school keeps its own money.** Each school connects its own
  payment account, so fees a parent pays online go straight to the
  school. RISMS records the transaction and never holds the money.
- **A lapsed subscription freezes data. It never deletes it.** If a school
  doesn't renew, its records are locked until it does. We only delete a
  school's data when the school asks us to. That's the expired-hosting
  problem from earlier, designed out.
- **Every school gets its own subdomain.** Each school's portal lives at
  its own address on risms.school, so there's no separate domain to
  manage or forget to renew. On the Growth and Established plans a school
  can also use its own domain, without starting over.
- **We maintain and patch it centrally.** No school is left running a
  one-off build that stops getting updates when the developer moves on.
- **Bulk import from Excel or paper records.** Schools don't have to
  retype years of student and staff data. They import what they already
  have and start from there.
- **Old balances come with you.** Fees a student owed before the school
  joined RISMS can be entered as an opening balance, so they stay on the
  books after the switch.

None of these are AI features. They're the dull operational work that a
lot of self-hosted school software skips, and they have to be solid
before anything adaptive can be built on top responsibly.

## What RISMS includes

Here's what a school gets today, grouped the way the
[RISMS knowledge base](https://risms.school/docs) is.

- **Student records and classes.** Create classes, add students one by
  one or import them in bulk, and manage transfers, tags and each
  student's profile. Students sign in with their admission number, so
  they don't need an email address.
- **Staff and permissions.** Starting roles for admins, bursars, teaching
  and non-teaching staff, plus custom roles if a school needs its own.
  Each person only sees what their role allows.
- **Fees and payments.** Set up fee items, bill whole classes, take
  online payments through the school's own Paystack account or record
  cash, and handle wallets, refunds, receipts and reconciliation.
- **Timetable and attendance.** Set up subjects, assign them to classes,
  build the weekly timetable with breaks and events, and take attendance
  by class. Clashes are refused when a slot is entered.
- **Results and report cards.** Set assessment weightings and a grading
  scale, enter scores, approve results, and produce printable term report
  cards. Students can download theirs as a PDF. Promotions to the next
  class run from the same records.
- **Student portal.** Results, timetable, attendance, fees and a prepaid
  wallet for paying online.
- **Guardian portal.** Parents follow each child's results, report cards,
  timetable and balance, top up a wallet, pay bills and download
  receipts. One guardian can have several children, and switch between
  RISMS schools from one login.
- **Your school's own address.** A subdomain on risms.school on every
  plan, your own logo and branding, and a custom domain on the Growth and
  Established plans.

## What RISMS costs

Cost still matters, even if it isn't the main thing holding schools back.
RISMS plans are a flat price for a school's size, with no per-student
fees. On our [current pricing](https://risms.school/pricing/compare), the
Starter plan is ₦75,000 a term for up to 200 students, and the Growth and
Established plans are ₦200,000 and ₦280,000 a year for up to 400 and 800
students. With a full school, that works out to roughly ₦120 to ₦375 per
student per term. Quotes we've seen schools get elsewhere were in the ₦700
to ₦1,000 range. There's also a free three-day trial.

## Helping close the Ministry's data gap

The 55.7% reporting rate isn't only a fact about the past. Government and
NGO programmes that fund ICT in schools can only reach schools they can
see. A school with no digital records is invisible to them, which means
the schools furthest behind are also the hardest to find and help.

As more schools join RISMS, we want it to help with that. Aggregated,
anonymised figures on ICT adoption across schools on the platform, such as
how much record-keeping is still manual when a school joins and how that
changes over time, would show where digital adoption is slow. That's the
kind of information [DNEMIS](https://emis.education.gov.ng/) is already
trying to collect nationally. Longer term, we'd like RISMS to support
those conversations with government and NGO partners, adding ground-level
detail to DNEMIS rather than replacing it.

We haven't built this yet. It's where we want the platform to go as more
schools come on, and it's one more reason getting schools onto a proper
system matters beyond one school's convenience. Any data shared this way
would be aggregated and anonymised at school level, and never tied to an
individual student, teacher or family without their consent.

---

*RISMS is in active development and schools are already using it. If you
run a school, you can [start a free trial](https://risms.school/) or
[talk to us](/contact). You can also read more about
[RISMS as a studio product](/studio/risms).*
