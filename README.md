# Personal Site Source
The source for my personal site.

This repo holds the sources for my site, which are built using [hugo](http://gohugo.io) into static html pages. Those pages
are stored in the `public/` directory, which is a submodule to 
[kengorab.github.io](https://github.com/kengorab/kengorab.github.io), the repository which will actually be served via
Github Pages.

This is kind of a bit of a workaround, in order to not have my "deployed" site in the same repository as the sources. For
personal sites, the `gh-pages` branch paradigm isn't supported, so this is the only thing I could think of.

## Building & Deploying the Site

This will most likely be scripted in the future, but here are the steps to deploy changes:

  - Make whatever changes desired (editing markdown files under `content/`, or making new articles)
    - New articles can be made using hugo: `hugo new article/<filename>.md`, or just by copying existing ones
  - Run `hugo` to generate the static html pages, and copy other static assets
  - Commit and publish changes to the `public/` directory: `cd public && git commit -am "Publishing blog" && git push`
    - This will push changes to the kengorab.github.io repository, thereby deploying changes to the site
  - Commit the changes in the root directory: `cd .. && git commit -am "<message>" && git push`

At this point, the changes have been built and deployed to the site, and the original sources have been commited to this repo.

... I'll definitely script this at some point.
