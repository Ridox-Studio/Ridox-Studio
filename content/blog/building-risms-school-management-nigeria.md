---
title: "Building the best school management system in Nigeria: RISMS"
description: We didn't start with an AI pitch for education. We started by asking why adaptation, not money, is the thing actually holding Nigerian schools back, and built RISMS from the answer.
date: 2026-09-10
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

## The gap isn't money, it's adaptation

The overwhelming majority of schools in Nigeria have not gone digital. Not
because the software doesn't exist, and not only because of cost. The
sharper problem is adaptation. Core administrative work that could be
digital in most institutions still runs on paper and manual process: JAMB
offers and admission letters get printed and physically handed over,
transcripts get typed and stamped, and records live in filing cabinets, not
databases.

That shows up most sharply at registration. Universities and schools across
Nigeria put students through slow, manual form registration and course
registration every session, a process that eats a huge amount of a
student's time before a single class has even started, and does it at the
exact moment a student is already under pressure to begin the term well.
It is demotivating before the term begins, and it has nothing to do with
whether the school could afford better software.

## What that means for bringing AI into education

If a sector has not adapted to something as basic as digitising a
registration form, it is not going to adapt smoothly to AI either, and
trying to introduce AI on top of a system that has not adopted the basics
yet is solving the wrong layer of the problem first.

The way in is not "here is an AI feature," it's finding the thing that
already stresses both sides of the relationship, the student *and* the
school's management, and fixing that first. Registration and admin
overhead is exactly that shared pressure point: it wastes a school's staff
time and it demoralises the student, at the same time, for the same
underlying reason. That is the problem RISMS was built to remove, and it
is the foundation any real AI layer for African education would need to
sit on top of, not the other way around.

## Building RISMS

[RISMS](/studio/risms) covers academics, staff, students, timetabling and
fees, split across four persona surfaces so no single screen has to serve
every audience at once. A school admin, a teacher, a bursar and a parent
are not looking for the same thing, and forcing them through one interface
is part of what makes existing school software feel heavier than it needs
to.

![The RISMS dashboard](/blog/risms-dashboard.png)

A few decisions came directly out of watching how Nigerian schools actually
run, not how school software usually assumes they run:

- **Timetabling refuses conflicts at entry.** Every timetable slot is
  checked against both the teacher's schedule and the class's schedule
  before it's allowed to exist, so a double-booking is refused when someone
  tries to create it, not discovered afterward by a teacher standing in the
  wrong room.
- **Cash is a first-class payment method.** Most school fees in Nigeria are
  still paid in cash over a counter, and RISMS treats a cash payment as its
  own gateway alongside the card processor: same receipt, same ledger
  entry, same audit trail, instead of bolting it on as an afterthought.
- **The school keeps its own money.** Each institution connects its own
  payment credentials, so fees a parent pays land straight in the school's
  account rather than sitting in ours first. RISMS records the transaction,
  it never holds the money.

None of these are AI features. They are the unglamorous administrative
friction that stresses a school's staff and its students at the same time,
the layer that has to work before anything smarter can be built on top of
it, and the layer most school software in this market has not actually
gotten right yet.

---

*RISMS is in active development. If you run a school and want to see the
current build, [get in touch](/contact); we are onboarding pilot schools
now.*
