---
title: "New Year, New Website: The Sequel"
description: "Just when you thought it was safe to bookmark my site, I've gone and redesigned it again. Because apparently, I can't resist tinkering with my own solutions."
pubDate: 2025-05-24
---

Well, here we are again. If you're reading this, you might be thinking, "Didn't you just redesign your website in January?" And you'd be absolutely right! In my defense, I can't help it - I'm like a kid in a candy store when it comes to web development, except the candy is code and the store is my terminal.

## The Backstory

Back in January, I wrote about [my transition to Ghost](/blog/new-year-new-site) and how excited I was about the new features it brought. But as any developer knows, the itch to build something custom never really goes away. It's like having a perfectly good chair but thinking, "You know what? I could probably build a better one... with RGB lighting and a built-in coffee warmer!"

## Why Another Change?

The truth is, while Ghost is an excellent platform (and I still recommend it for many use cases), I found myself wanting more control over my site's architecture. I'm a tinkerer at heart, and sometimes the best way to learn is to build something yourself. Plus, I had some specific ideas about how I wanted to structure my content and present it to you, my wonderful readers.

## What's New?

This time around, I've built the site using [Astro](https://astro.build), a modern static site generator that's been gaining popularity for its excellent performance and developer experience. Some highlights of the new setup:

- **Lightning Fast Performance**: Static site generation means your browser gets exactly what it needs, nothing more.
- **Content Collections**: A more organized way to manage my blog posts and other content.
- **Custom Components**: The ability to create exactly the UI elements I want, how I want them.
- **TypeScript Support**: Because type safety is like having a safety net while coding - you hope you never need it, but you're glad it's there when you do.

## Custom Features

One of the most exciting aspects of this redesign is the addition of several custom features that enhance both the user experience and the site's functionality:

### Stripe Integration for Tips

I've implemented a seamless tipping system using Stripe that allows readers to support my work in two ways:

- **One-time Tips**: For those who want to show their appreciation for a specific article or project
- **Monthly Subscriptions**: For readers who want to provide ongoing support

The system is fully integrated with a beautiful modal interface that makes it easy to choose an amount and complete the transaction. Plus, it's all handled securely through Stripe's infrastructure, so you can tip with confidence.

### Intelligent Search

I've built a custom search implementation that makes it easy to find content across the site:

- **Real-time Results**: As you type, the search updates instantly
- **Fuzzy Matching**: Even if you don't remember the exact title, the search will find what you're looking for
- **Content Filtering**: Search through blog posts, projects, or everything at once
- **Keyboard Navigation**: Full keyboard support for power users

### Smooth View Transitions

One of my favorite new features is the implementation of view transitions, which creates a smooth, app-like experience when navigating between pages:

- **Animated Page Transitions**: Elements smoothly animate between pages
- **Persistent Elements**: The header and navigation maintain their state during transitions
- **Reduced Layout Shift**: Pages transition without jarring jumps or reloads
- **Progressive Enhancement**: The site still works perfectly even if transitions aren't supported

These features work together to create a more engaging and polished experience while maintaining the site's performance and accessibility.

## The Development Process

Building this site was a journey of discovery. I learned more about:

- Modern web development practices
- Content management strategies
- Performance optimization
- The importance of good documentation (which I'm still working on, by the way)

## What's Next?

I promise I'll try to keep this version around for at least... oh, I don't know, maybe until the next shiny framework catches my eye? (Just kidding! Maybe.)

In all seriousness, this redesign represents my commitment to providing you with the best possible reading experience while maintaining the flexibility to experiment and improve. I'm excited to share more content, more projects, and more of my journey in tech with you.

## A Note to My Future Self

Dear Future Michael,
If you're reading this and thinking about another redesign, please remember:

1. It's only been a few months
2. The current site works perfectly fine
3. Maybe go outside and touch some grass instead?

But knowing you, you'll probably ignore this note and start tinkering again anyway. Such is the life of a developer who can't resist building their own solutions.

To everyone else: thanks for sticking with me through these changes. Your support means the world, even if I do keep moving the furniture around. Here's to many more posts, projects, and probably a few more redesigns (but let's not tell Future Michael that).

Stay curious, stay coding, and remember: the best solution is often the one you build yourself... even if you have to rebuild it every few months!
