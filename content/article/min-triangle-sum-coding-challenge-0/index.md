---
date: 2017-10-07T21:09:45-04:00
title: Min Triangle Sum (Coding Challenge)
categories:
  - coding challenge
  - javascript
  - kotlin
  - java
keywords:
  - javascript
  - kotlin
  - java
  - functional programming
  - language comparison
  - interview questions
  - coding challenge

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
number several orders of magnitude larger than the total number of particles in the universe).

Let's try a different approach. Rather than starting at the top and working our way down, let's start at the bottom and
work our way up.

Let's start by allocating a new array, which consists of the elements of the last row. This is well within the rules of
the "bonus points", so let's create `[4, 1, 8, 3]`. This array will represent the best (minimum) possible sum after each
iteration of the algorithm. Starting from the second-to-last row in the triangle, we compare the sums of each element and
the two adjacent numbers in the lower row.

For example, starting at the `6`, we could either sum it with the `4` or the `1`; we'd pick the `1` since it results 
in the minimal value. We'd then do the same for the `5` and the `7` in that row. So, after one iteration of our algorithm,
comparing sums and updating the array, we're left with the array `[7, 6, 10, 3]` (each round will update 1 item fewer in
the array each time, which is why the 3) is left over from the start.

Running the algorithm again, we are comparing `7 + 3` with `6 + 3`, so we take `9` and place that in the first element of
the array; then we compare `6 + 4` with `10 + 4`, so we take `10` and place it in the second position in the array. Now,
the array looks like `[9, 10, 10, 3]`. Note again that the `10` and `3` are left over from last time. We _could_ alter
the algorithm to replace these with `null` or something to make it less confusing, but just know that we only care about
the first `n` elements of the array, where `n` is the row in the triangle we're currently processing.

The final run of the algorithm is comparing `9 + 2` with `10 + 2`, so we take `11` and put it in the first place in the
array. Now that we've run out of rows in the triangle, the 0th element of the array is our solution, and if we trace back
the values we had summed along the way to arrive at this value, we see it's `2 + 3 + 5 + 1`.

This algorithm will iterate over the number of rows in the triangle, and in each row iterate over the number of elements.
Therefore, its runtime complexity is `O(n^2)`, which is nothing compared to the exponential runtime in the naïve approach.

## Implementation (Javascript)

Now that we've talked through the solution at a high level, let's see what this looks like in code. I'm going to write
this solution in a few languages, just for some variety. If you're a functional programmer, you were reading the second
approach and thinking "wow, this sounds like `reduce` (AKA `foldl`)" then you're ahead of the game! I'll be using `reduce`
in my javascript solution.

```js
function minTriangleSum(triangleRows) {
  const triangle = triangleRows.reverse();
  const [lastRow, ...rows] = triangle;
  const results = rows.reduce(
    (acc, row) => {
      return row.map((item, index) => {
        return item + Math.min(acc[index], acc[index + 1]);
      });
    },
    lastRow
  );
  return results[0];
}

const triangle = [
     [2],
    [3, 4],
   [6, 5, 7],
  [4, 1, 8, 3]
];

console.log(minTriangleSum(triangle));  // 11

```

Now _technically_ this solution does allocate more space than a single `O(n)` array, but I wanted to talk about the
functional, declarative solution first, since it's a more direct translation of how I like to think about these problems.
Note also that each iteration of the reduction also returns an array with the correct number of elements in it (when I
walked through the solution conceptually a moment ago, I had mentioned that the resulting array would contain extra elements
carried over from previous iterations).

Let's see what an imperative solution looks like, which doesn't allocate anything other than the `O(n)` requirement for
the bonus points:

```js
function minTriangleSum(triangleRows) {
  let totals = [];
  const lastRow = triangleRows[triangleRows.length - 1];
  for (let i = 0; i < lastRow.length; i++) {
    totals.push(lastRow[i]);
  }
  
  // The block above could be replaced with:
  //   let totals = [...triangleRows[triangleRows.length - 1]];

  // Iterate in reverse
  for (let i = triangleRows.length - 2; i >= 0; i--) {
    const row = triangleRows[i];
    for (let j = 0; j < row.length; j++) {
      totals[j] = row[j] + Math.min(totals[j], totals[j + 1]);
    }
  }
  return totals[0];
}

const triangle = [
     [2],
    [3, 4],
   [6, 5, 7],
  [4, 1, 8, 3]
];

console.log(minTriangleSum(triangle));

```

This reads more like the javascript of yore, without making use of the `reduce` or `map` functions. As I mentioned in
the comment in the code, the first block could have been replaced with a single line but I felt that, if I was going
to be using `for`-loops anyway, I may as well go ahead and not take advantage of _any_ of the features of modern
javascript. 

## Implementation (Java)

The imperative java implementation isn't terribly different from the javascript one:

```java
int minPathSum(int[][] triangleRows) {
    int numRows = triangleRows.length;
    int[] totals = new int[numRows];
    System.arraycopy(triangleRows[numRows - 1], 0, totals, 0, triangleRows[numRows - 1].length);

    // Iterate in reverse
    for (int i = triangleRows.length - 2; i >= 0; i--) {
        int[] upperRow = triangleRows[i];
        for (int j = 0; j < upperRow.length; j++) {
            totals[j] = upperRow[j] + Math.min(totals[j], totals[j + 1]);
        }
    }

    return totals[0];
}
```

The call to `System.arraycopy` is a [more performant](https://stackoverflow.com/a/18639042) (albeit slightly more
obfuscated) way to copy arrays in java rather than using a `for`-loop, since it's a call into native VM code, which copies
blocks of memory rather than copying single array elements one at a time.

Trying to write the more declarative solution in java, using `Streams`, I got annoyed. See, while the java language
developers made a good effort to bring some aspects of functional/declarative programming to java in Java 8, there is
no `mapIndexed` method on a `Stream`, so in order to write the same algorithm, you'd need to have a `for`-loop within
the `reduce` function, which is hideous. In Kotlin for example, a language with an incredibly robust collections API,
the `mapIndexed` function exists. Also, there's a `foldRight` function as well, which saves us from first having to
reverse the rows manually. Seriously, the Kotlin language developers aren't slouches, take a look at the 
[documentation for their collections APIs](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)
and imagine how much of an improvement it is over java's.

# Conclusion

So that's it! There's nothing spectacular or particularly groundbreaking in this post, I just wanted to talk for a bit
about coding challenges / SWE interview questions, and why they're important. And more importantly, why they should be
viewed as a fun challenge rather than a test or a chore.

I definitely recommend checking out the problems on
[ProgramCreek](https://www.programcreek.com/2012/11/top-10-algorithms-for-coding-interview/) (which I had linked above
earlier on), and try to do one or two of them a day. They're important to do, even if you're not thinking of changing
jobs anytime soon.

If you have any questions/comments, please feel free to leave them below. Thanks for reading!
