---
date: 2017-10-06T21:18:45-04:00
title: Min Triangle Sum (Coding Challenge)
categories:
  - coding challenge
  - javascript
  - kotlin
  - java
  - clojure
keywords:
  - javascript
  - kotlin
  - java
  - clojure
  - functional programming
  - language comparison
  - interview questions

---

# Preamble / Motivation

Recently, in between working on various projects and other hobbies, I've been doing programming "brainteaser" problems,
like testing to see if a binary tree is a mirror image of itself. You know, the types of questions you get asked during
a SWE interview which don't really prove that you can design and write scalable, well-architected software, but rather
allow the interviewer to get a glimpse of your thought process, and to see which data structures and strategies you 
immediately reach for.

The types of questions that, if you're not ready for them, can really make you look bad.

Or, looking at it in a different way, are actually a lot of _fun_ to do when the pressure is off. When you're not in the
hot seat with someone staring over your shoulder, they feel more like Sudoku or crossword puzzles rather than a test. I
encourage anyone who's intimidated by these types of problems to sit down and try to do a couple each day. I'm not promising
that you'll find the joy in it that I've found, but if you do, and you head into your next interview looking forward to
the problem rather than dreading it, I'll bet you'll do better. Not only will the interviewer pick up on your enthusiasm,
but you'll probably be less nervous and instead be more excited.

Anyway, onto the problem of the day.

# The Problem of the Day

Given a triangle, find the minimum path sum from top to bottom. Each step you may move to adjacent numbers on the row below.

For example, given the following triangle

```
                    2 
                    
                  3   4
                  
                6   5   7
                
              4   1   8   3
```
The minimum path sum from top to bottom is 11 (`2 + 3 + 5 + 1 = 11`).

_Note: Bonus points if you are able to do this using only O(n) extra space, where n is the total number of rows in the triangle._

---

This problem came from a site called [ProgramCreek](https://www.programcreek.com/2013/01/leetcode-triangle-java/), which
has a [ton of these types of problems](https://www.programcreek.com/2012/11/top-10-algorithms-for-coding-interview/), split
out by categories of data structures used to solve it. I'd definitely recommend checking it out.

Before reading further, you should take a couple of minutes to think through how you'd solve this problem.

## Thinking Through It

The naïve way of doing this would be to start from the top and form all of the possible sums, then find the minimum
at the end. So, the possibilities would be

- `2 3 6 4` (`15`)
- `2 3 6 1` (`12`)
- `2 3 5 1` (`11`)
- `2 3 5 8` (`18`)
- `2 4 5 1` (`12`)
- `2 4 5 8` (`19`)
- `2 4 7 8` (`21`)
- `2 4 7 3` (`16`)

and the solution would be `2 3 5 1`. This may seem fine for such a small triangle, but each additional row that gets added
will produce twice as many possibilities, and eventually you notice its inefficiency (this has an exponential runtime
complexity, of `O(2^(n - 1))`). As interviewers are wont to do, they'll try to get you to think about this after you've
finished, and ask you something along the lines of "okay, but what happens when we run this with a triangle that has 
10,000,000 rows?".

Well, 10,000,000 isn't an exact [Triangular Number](https://en.wikipedia.org/wiki/Triangular_number),
but let's do some rounding. (`10,000,000 = (n)(n + 1) / 2` yields approximately 4,472 rows in this triangle). That means
that, in order to determine which path results in the minimum sum, we'd need to make `2^4471` calculations (which is a
number several orders of magnitude larger than the total number of particles in the universe (approximately `10*78`)).

Let's try a different approach.

Rather than starting at the top and working our way down, let's start at the bottom and work our way up.
