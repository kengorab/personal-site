---
title: "Writing Snake in Javascript with Kotlin: Part 0"
date: "2017-04-07T23:29:04-04:00"
categories:
  - kotlin
  - kotlinx
  - javascript
keywords:
  - kotlin
  - kotlinx
  - kotlinx.html
  - kotlin 1.1
  - javascript
  - tutorial
  - snake
  - game

---

Continuing from my [previous post about Kotlin](/article/kotlin-to-javascript/) and its newly-added Javascript build target,
I wanted to play around with the (also recently released) [kotlinx.html](https://github.com/Kotlin/kotlinx.html) library. If
you've used [anko](https://github.com/Kotlin/anko) in the past (a Kotlin library for defining views in Android, among other
utilities), `kotlinx.html` is essentially the same idea; it provides a nice "DSL" in Kotlin for creating HTML elements.

I put "DSL" in quotes, because while it may *look* like some other language, it *is* still just normal Kotlin code, albeit taking
advantage of language features like [function literals with receivers](https://kotlinlang.org/docs/reference/lambdas.html#function-literals-with-receiver).

So, using Kotlin and Kotlinx.html, let's try to write the game Snake and run it in the browser. All of the code will be available on
my github, and there will be a tag for steps along the way, in case you wanted to try it for yourself.

This is going to be a multi-part article, so let's get started! 🐍🐍🐍

# Step 0: Project Setup

I'm going to start with the [kotlin-js-boilerplate](https://github.com/kengorab/kotlin-javascript-boilerplate) that we built up in my
previous post about Kotlin and Javascript, so you can fork that if you want to follow along. 

After copying the template, renaming the project in the `settings.gradle` file, and clearing out the README (we'll fill it in later),
I replaced the `index.html` file with this:

```html
<html>
<head>
    <title>🐍 Snake</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.css">
</head>
<body class="container">
<h1>🐍 Snake</h1>

<script src="node_modules/kotlin/kotlin.js"></script>
<script src="build/js/module.js"></script>
</body>
</html>
```

This is nearly the same as it was in the boilerplate, just removing some unnecessary html. The same scripts get pulled in
(if you're unsure what these javascript files are, or where they come from, you should read through [my previous post](http://localhost:1313/article/kotlin-to-javascript/).

By serving up the root project using any method you like (I like `python -m SimpleHTTPServer` since it's available by default on any
OS with python installed), you'll see a very boring page with an `h1` tag, and nothing else.  As of now, the `Main.kt` file still just 
prints `'Hello World!'` to the brower console, so you should see that too. Remember to do an `npm install`/`yarn` before running, 
since the template project pulls in the kotlin-js standard library via npm.

But we didn't come here to write HTML, we came here to write Kotlin!

## Using kotlinx.html

Head over to your `build.gradle` file. You should see the boilerplate/template stuff, applying the `kotlin2js` plugin, and pulling in
the kotlin-js standard lib. Change the `dependencies` section to include the `kotlinx-html-js` dependency:

```gradle
dependencies {
  compile "org.jetbrains.kotlin:kotlin-stdlib-js:$kotlin_version"
  compile 'org.jetbrains.kotlinx:kotlinx-html-js:0.6.3'
}
```

*Note that the version may be different by the time of your reading; you can see what the latest version is by checking the
[releases](https://github.com/Kotlin/kotlinx.html/releases) page on the kotlinx.html github.*

In order to install this dependency, we need to tell gradle where it can be found online, since it's not in the maven central repo.
Change your `repositories` section to look like this:

```gradle
repositories {
  mavenCentral()
  jcenter()
}
```

*Note that this is the top-level `repositories` section, not the one nested under `buildscript` at the top.*

Now, let's head back to our `index.html` file, and remove the line with the `h1` tag. Refreshing our browser tab that loaded that file
should result in a blank page (duh).

Let's change our `Main.kt` file to render this line, using the `kotlinx.html` library. Here's what it should look like:

```kotlin
package co.kenrg.snake

import kotlinx.html.dom.append
import kotlinx.html.js.h1
import kotlin.browser.document

fun main(args: Array<String>) {
    document.body?.append {
        h1 { +"🐍 Snake" }
    }
}
```

*If you're confused what exactly this is doing here (and what that plus sign is doing before the String) you're not alone. I was
mystified by this library at first too. I explain what's going on here [further](#how-does-kotlinx-html-work) down the page, 
after we get it working.*

Run `./gradlew build`, and it should complete successfully, resulting in the generation of the `module.js` file within the
`build/js` directory (there are other files generated in there too, see my previous post for more info on that). 

Our `index.html` file is already set up to load the `build/js/module.js` Javascript file, as well as the kotlin-js standard library
from `node_modules` (if you haven't run a `npm install`/`yarn` yet, do it now), so let's refresh the page.

There should be an error that appears in the browser console, saying something resembling:

```
module.js:11 Uncaught Error: Error loading module 'module'. Its dependency 'kotlinx-html-js' was not found. Please, check whether 'kotlinx-html-js' is loaded prior to 'module'.
```

This is because our module depends not only on the kotlin-js standard library, but on the kotlinx-html-js library as well. In my last
post when I built up the boilerplate project, [I mentioned](/article/kotlin-to-javascript/#the-build-gradle-file)
how the kotlin-js standard library could either be extracted from the kotlin-stdlib-js dependency jar using a `build.doLast` gradle 
task, or by adding a `package.json` and installing it as a node dependency, since the standard lib was installable as an npm package. 
This is unfortunately not the case (at least not yet) for the kotlinx-html-js library. So we'll need to add that `build.doLast` step 
after all.

## Loading the kotlinx-html-js library

In the Kotlin-to-Javascript setup instructions, JetBrains mentions a `build.doLast` step that you can add to your `build.gradle` file
in order to extract the standard lib from a jar. Since we'll need to do that for the kotlinx-html-js library anyway (and this task
extracts all `.js` files from jars on the classpath) we'll no longer need to reference the kotlin-js standard library from the
`node_modules` directory. So we can go ahead and delete `node_modules` and the `package.json`, and add this to your `build.gradle`:

```gradle
build.doLast {
  configurations.compile.each { File file ->
    copy {
      includeEmptyDirs = false

      from zipTree(file.absolutePath)
      into "${projectDir}/build/js"
      include { fileTreeElement ->
        def path = fileTreeElement.path
        path.endsWith(".js") && (path.startsWith("META-INF/resources/") || !path.startsWith("META-INF/"))
      }
    }
  }
}
```

Let's run a `./gradlew build` and see now that there are additional files generated in the `build/js` directory, including: `kotlin.js` and `kotlinx-html-js.js`. Update the `index.html` file to include the following script tags instead of what was previously there:

```html
<script src="build/js/kotlin.js"></script>
<script src="build/js/kotlinx-html-js.js"></script>
<script src="build/js/module.js"></script>
```

Refresh the page and you should see our `h1` tag appear! Awesome, we've generated some DOM elements using Kotlin, compiled to 
Javascript! We've paved the way for the remainder of the project.

## How does kotlinx-html work?

*Note: This code will not be included in the github repo for this project*

This is what our main function looks like in `Main.kt`:

```kotlin
package co.kenrg.snake

import kotlinx.html.dom.append
import kotlinx.html.js.h1
import kotlin.browser.document

fun main(args: Array<String>) {
    document.body?.append {
        h1 { +"🐍 Snake" }
    }
}
```

The first thing we do is get a handle on `document.body`. This corresponds to the HTML node created by the `<body>` tag. In our
`index.html` file, this is empty and has a class of `'container'`. The `.append` function is an [extension function](https://kotlinlang.org/docs/reference/extensions.html#extension-functions)
on the `Node` class, of which `document.body` is an instance. Actually, it is a nullable instance, which is why we need the
null-safe operator (`?.`) when calling `apply`. The `apply` function has the following signature:

```kotlin
fun Node.append(block : TagConsumer<HTMLElement>.() -> Unit) : List<HTMLElement>
```

The `block` parameter is a function/closure with a [receiver](https://kotlinlang.org/docs/reference/lambdas.html#function-literals-with-receiver)
of `TagConsumer<HTMLElement>`, which means that any code in that block will be executed as if it were an extension function on 
`TagConsumer<HTMLElement>`. This is how the kotlinx-html library achieves its DSL-like syntax.

Within the function/closure/block (I've seen it called all three) we call the `h1` function, which has the following signature:

```kotlin
fun TagConsumer<HTMLElement>.h1(classes : String? = null, block : H1.() -> Unit = {}) : HTMLHeadingElement
```

As expected, since it's executed within the block passed to `body.apply`, the `h1` function is a function on `TagConsumer<HtmlElement>` 
(an extension function to be precise, which is how all of these functions seem to be implemented). We could have
equivalently written our `main` function as follows, with the same exact result:

```kotlin
fun main(args: Array<String>) {
    document.body?.append {
        this.h1 { +"🐍 Snake" }
    }
}
```

where the `this` keyword in `this.h1` refers to the `TagConsumer<HTMLElement>` instance that the block passed to `.apply` will be
executing within. This is definitely on the more confusing side, but I encourage you to read through the Kotlin documentation for
[extension functions](https://kotlinlang.org/docs/reference/extensions.html#extension-functions) and [function literals with receiver](https://kotlinlang.org/docs/reference/lambdas.html#function-literals-with-receiver)
and it should help. Also, playing around with the [HTML Builder example](https://try.kotlinlang.org/#/Examples/Longer%20examples/HTML%20Builder/HTML%20Builder.kt)
on the Kotlin playground page will help a lot too (it definitely helped me).

The only other weird thing is the `+"🐍 Snake"` line within the `h1` block.

The HTML Builder example linked above differs slightly from the implementation of the kotlinx.html library, but it can definitely
provide us some insight into what's happening here. In that example, we see this definition in the `TagWithText` class:

```kotlin
operator fun String.unaryPlus() {
  children.add(TextElement(this))
}
```

Kotlin provides us the ability to [overload operators](https://kotlinlang.org/docs/reference/operator-overloading.html), which means
we can define custom implementations for the standard operators. In this case, the unary plus operator (the counterpart to the unary
minus operator, which allows us to define negative numbers) is being overridden to mean "set the text content of this element". This,
in my opinion, is the most unintuitive part of the kotlinx.html library, but it's a nice shortcut for defining the text content of
a DOM node. There is another (possibly less-idiomatic, but also possibly clearer) way of doing it, but first I need to show how the
library handles setting a node's attributes, and how to nest child nodes.

The `block` parameter that's passed into the `h1` function executes within the context of an instance of the `H1` class, 
meaning that setting the `id` or the `tabIndex` properties of an `h1` is done like:

```kotlin
h1 {
  id = "some-id"
  tabIndex = "0"
}
```
*All of the attributes have type `String`, which corresponds well to the DOM, since all attributes are passed as strings, but isn't
extraordinarily type-safe, since `tabIndex` should probably be an `Int`. I have no inside sources or anything, but I'd expect this
to change over time as the library gets more mature.*

Here is some pseudo-code to illustrate what's happening here with this block:

```
val h1 = H1()
h1.id = "some-id"
h1.tabIndex = "0"
```

Nested DOM nodes can be defined in this way too, by adding code to the block passed to the parent's function. For example, creating
a div with a span and a button inside of it would look like:

```kotlin
div {
  span { +"Some label" }
  button { 
    +"Click me"
    onClickFunction = { event -> println("Button clicked!") } 
  }
}
```

Here is some pseudo-code to illustrate what's happening here with this block:

```
val div = DIV()

val span = SPAN()
span.add(TextElement("Some label"))
div.addChild(span)

val button = BUTTON()
button.add(TextElement("Click me"))
button.onClickFunction = { event -> println("Button clicked!") }
div.addChild(button)
```

This isn't at all what the underlying Kotlin code is doing (or at least, not *all* that it's doing), but it provides a good way to
conceptualize this "DSL".

I'm still using the `+`/`unaryPlus` operator in that example above, but now that we understand nesting within these blocks, we could
substitute it with a call to the `text` function:

```kotlin
div {
  span { text("Some label") }
  button { 
    text("Click me")
    onClickFunction = { event -> println("Button clicked!") } 
  }
}
```

I think it's clearer what the intent is when we use the `text` function, but it is slightly more verbose, especially when considering
that setting the text content of a node is one of the most common use cases. It may seem unintuitive at first, but the unary plus 
operator does quickly become a useful shortcut.

## To be continued...

I don't want these articles to be too long, and I think this is a good stopping point for now, so we'll continue this in the next
one (Part 1). All of the code is [available on my github](https://github.com/kengorab/kotlin-js-snake/tree/step-0), under the tag 
`step-0`. There will be future tags for future articles. Stay tuned for more!
