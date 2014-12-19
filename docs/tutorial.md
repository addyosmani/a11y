#Tutorial

This brief tutorial will help you get a feel for using `a11y` CLI to audit sites with accessibility issues.

The examples we will use are are taken from the W3C [resources](http://www.w3.org/WAI/demos/bad/) on optimizing for the [Web Content Accessibility Guidelines (WCAG) 2.0](http://www.w3.org/TR/WCAG20/).

 1. First, make sure you have `a11y` installed as a global utility. You can do this by running `npm install -g a11y` if you haven't already.
 2. Choose a demo from the [Examples](#examples) list below to use for the rest of this tutorial.
 3. Run `a11y` followed by the `Before` URL of the selected demo. For example, for the 'Home page' example, run `a11y http://www.w3.org/WAI/demos/bad/before/home.html`
 4. Observe the results returned. There should be at a handful of accessibility issues with each of the before pages.
 5. Run `a11y` followed by the `After` URL of the demo. For the `Home page` example this would be `a11y http://www.w3.org/WAI/demos/bad/after/home.html`. Notice that most of the accessibility issues highlighted in the last audit are fixed in this version.

![](http://i.imgur.com/QnDS92L.png)

Note: Each Before/After demo has a `Show Annotations` button that looks like this:

![](http://i.imgur.com/sCGdv72.png)

Click it to toggle annotation information for each section of the page with an accessibility issue:

![](http://i.imgur.com/CI41X00.png)

Each numeric entry can be clicked to display more information about the problem (Before) and solution (After):

![](http://i.imgur.com/k6jX3O8.png)

## Examples

 ### Example 1: Home page

 [Before](http://www.w3.org/WAI/demos/bad/before/home.html)

 [After](http://www.w3.org/WAI/demos/bad/after/home.html)

 ### Example 2: News page

 [Before](http://www.w3.org/WAI/demos/bad/before/news.html)

 [After](http://www.w3.org/WAI/demos/bad/after/news.html)

 ### Example 3: Tickets page

 [Before](http://www.w3.org/WAI/demos/bad/before/tickets.html)

 [After](http://www.w3.org/WAI/demos/bad/after/tickets.html)

 ### Example 4: Survey page

 [Before](http://www.w3.org/WAI/demos/bad/before/survey.html)

 [After](http://www.w3.org/WAI/demos/bad/after/survey.html)
