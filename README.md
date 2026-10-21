<div align="center">

UI Prototype

A study in visual design, interaction, and motion.

A personal UI prototype exploring a distinctive visual direction through layout, typography, colour, responsive components, and animated interactions.

<br />






Original UI concept · Responsive design · Motion-led interactions

</div>

Overview

This project is a UI prototype focused on developing and presenting an original visual style. It explores how typography, spacing, colour, layered surfaces, and motion can work together to create a cohesive digital experience.

The emphasis is on the interface itself: its visual identity, interaction patterns, responsive behaviour, and reusable components.

Design Direction

Distinctive visual language — a consistent approach to composition, hierarchy, spacing, and detail.

Typography-led layouts — clear headings, readable body text, and deliberate contrast between text styles.

Dark-first interface — a dark default theme with an optional light appearance.

Colour and surface treatment — coordinated backgrounds, accent colours, borders, and layered UI elements.

Motion and transitions — purposeful animations that support the experience rather than distract from it.

Responsive composition — layouts and components adapted for desktop, tablet, and mobile.

Reusable components — consistent UI patterns that are easier to maintain and refine.

Tech Stack

Technology

Role

Next.js App Router

Application structure and routing

TypeScript

Type-safe development

Tailwind CSS v4

Styling and responsive layouts

Framer Motion

Transitions and interface animation

next/image

Image optimisation

next/font

Font loading and optimisation

Getting Started

Requirements

Node.js 18.18+ (Node.js 20.x recommended)

npm

Installation

# Install dependencies
npm install

# Start the development server
npm run dev

Open http://localhost:3000 in your browser.

Available Commands

Command

Description

npm run dev

Run the development server

npm run build

Build for production

npm start

Run the production build

npm run typecheck

Check TypeScript types

npm run assets

Regenerate interface artwork and icons

Interface Structure

The UI is built from reusable sections and components, keeping presentation separate from content where practical.

app/                  Pages, routes, metadata, and API route
components/ui/        Reusable interface components
components/sections/  Individual page sections
components/seo/       Structured metadata
data/site.ts          Content and interface data
lib/                  Helpers, theme, motion, and form logic
public/               Images, generated artwork, and icons
scripts/              Asset-generation utilities
styles/globals.css    Design tokens, theme, and motion styles

Visual System

Colour and Theme

The interface uses a dark-first theme with a light-mode option. Theme preference is stored locally so the selected appearance can persist between visits.

Typography and Layout

Typography, spacing, alignment, and content hierarchy are used to create rhythm across the page. Responsive layouts help preserve readability and visual balance across screen sizes.

Motion and Interaction

Framer Motion supports selected transitions and interactive states. Animations are designed to feel deliberate, with reduced-motion preferences respected for visitors who disable non-essential movement.

Components

Reusable buttons, chips, dialogs, navigation elements, cards, and other UI primitives help maintain consistent interaction and styling across sections.

Updating the UI

Most of the displayed content is configured in data/site.ts. This makes it possible to refine text, section content, project cards, navigation, and contact details without editing every component individually.

Global design tokens and motion rules are defined in styles/globals.css. Reusable components are located in components/ui/, while page sections are organised in components/sections/.

Quality Checklist

Before sharing the prototype:

Check the layout at desktop, tablet, and mobile widths.

Review typography, spacing, colour contrast, and component consistency.

Test interactive states, navigation, and dialogs.

Verify animations and reduced-motion behaviour.

Check keyboard navigation and visible focus states.

Run npm run typecheck.

Run npm run build.

Replace any development placeholders before presenting the UI as finished.

<div align="center">

Original concept. Thoughtful details. Intentional interactions.

</div>
