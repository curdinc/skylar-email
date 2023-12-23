# Contributing to Skylar

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help. 🎉

> We are also always available on [Discord](https://discord.gg/Hdws2uyCU7) if you want to just hop in for a quick chat!

## Table of Contents

- [I Have a Question](#i-have-a-question)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Pull Requests](#pull-requests)
- [Styleguides](#styleguides)

## I Have a Question

Drop by our [discord](https://discord.gg/Hdws2uyCU7) and ask away!

## Reporting Bugs

A good bug report should be self contained and easily reproducible. We want to everyone to have the best possible experience so help us help you. Please complete the following steps in advance to help us fix any potential bug as fast as possible.

> You must never report security related issues, vulnerabilities or bugs including sensitive information to the issue tracker, or elsewhere in public. Instead sensitive bugs must be sent by email to curdcorp+security@gmail.com.

We use GitHub issues to track bugs and errors. If you run into an issue with the project:

- Check to see if other users have experienced (and potentially already solved) the same issue you are having, check if there is not already a bug report existing for your bug or error in the [bug tracker](https://github.com/curdinc/skylar-email/issues?q=label%3Abug).
- [Create a new issue](https://github.com/curdinc/skylar-email/issues/new/choose) and fill out each section with as much details as possible and describe the _reproduction steps_ that someone else can follow to recreate the issue on their own.

Once it's filed:

- We will look through the issue and label the issue accordingly.
- We will try to reproduce the issue with your provided steps. If we are unable to do so, we will likely mark it as `needs-repro` and follow-up. Bugs with the `needs-repro` tag will not be addressed until they are reproduced.
- Once we are able to reproduce the issue, it will be marked `needs-fix`, and potentially other tags.
- We welcome [contributions](#your-first-code-contribution)!

## Suggesting Features

This section guides you through submitting feature requests and suggestion for Skylar,

- [Search](https://github.com/curdinc/skylar-email/issues) to see if this feature has already been requested in some shape or form. If it has, add to the existing issue instead of opening a new one.
- [File a new feature request](https://github.com/curdinc/skylar-email/issues/new/choose). As always, more information and detail makes it easier to convince us this should be prioritized over anything else!
- You may want to **include screenshots and animated GIFs** which help you demonstrate the steps or point out the part which the suggestion is related to. You can use [this tool](https://www.cockos.com/licecap/) to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.

## Your First Code Contribution

> ### Legal Notice
>
> When contributing to this project, you must agree that you have authored 100% of the content, that you have the necessary rights to the content and that the content you contribute may be provided under the project licence.

### Repo Overview

Here is the outline of the repo along with what each package does

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ backend
  |   ├─ Hono
  |   ├─ TRPC middleware
  |   └─ Mostly just handles decrypting user refresh token
  └─ frontend
      ├─ Next.js 13
      ├─ React 18
      ├─ Tailwind CSS with shadcn ui
      |─ E2E Typesafe API Server & Client via tRPC
      └─ Contains most of the UI for managing messages and threads
packages
  ├─ api
  |   |─ Implement logic that's exposed by Hono
  |   └─ tRPC v10 router definition.
  ├─ client-db
  |   └─ CRUD operation for managing local messages cache
  ├─ gmail-api
  |   └─ Typesafe wrapper to all the REST calls to the Gmail API
  ├─ message-manager
  |   └─ Collection of functions to compose or extract info reply or forwarded messages so
  |      they can thread well in other clients and be displayed properly
  ├─ logger
  |   └─ abstract class that wraps axiom for logging purposes
  ├─ logic
  |   └─ global state manager based on zustand
  ├─ parsers-and-types
  |   └─ Collection of type parsers, constants, and types shared across the various packages
  ├─ db
  |   └─ Used to track alpha list emails
  └─ tinykeys
     └─ Fork of jamiebuilds/tinykeys which colliding shortcut sequences. e.g. `g` and `g i`
stacks
  └─ SST config for IAC deployments on AWS
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

### Quick Start Development Env

To get it running, follow the steps below:

> Note you'll see me use `nr` in place of `pnpm` at times. That's because I use @antfu/ni which basically makes sure I use the right package manager all the time when jumping between different repos. Highly recommend.

#### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env

# THe following three lines is only needed for the first time
# This will deploy the SST development stack.
# See SST docs for more details.
cd apps/backend
pnpm run dev
cd ../../
```

#### 2. Run the development env

```bash
pnpm run dev
```

#### 3. When it's time to add a new package

To add a new package, simply run `pnpm turbo gen init`` in the monorepo root. Follow the prompt to init a new package.

The generator sets up the `package.json`, `tsconfig.json` and a `index.ts`, as well as configures all the necessary configurations for tooling around package formatting, linting and typechecking.

## Pull Requests

In general, it'll be helpful if a PR did one thing really well. If you have multiple changes, don't be afraid to open multiple PRs!

### Improving The Documentation

Feel free to open PRs for any typos that you see. Prefix the PR titles with `[DOCS]` so it's clear that it's likely around typos // wording and we'll get to that as fast as we can!

## Styleguides

This is pretty subjective, but we tend to be nit pick to get the code into as similar of a structure and mental model wherever we can to what we have. Of course, we are open to changing our practices and adopting new ones as we deemed fit. We are also learning like everyone else!

### Commit Messages

We follow the conventional commit structure. See [the cheat sheet for more](https://kapeli.com/cheat_sheets/Conventional_Commits.docset/Contents/Resources/Documents/index)
