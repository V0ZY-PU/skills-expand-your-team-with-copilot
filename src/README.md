# Mergington High School Activities

A super simple website application that allows students to view and sign up for extracurricular activities.

## Features

- View all available extracurricular activities
- Sign up for activities
- Share activities with friends through Facebook, X, WhatsApp, or a copied link

## Sharing an activity

Use the sharing buttons at the bottom of any activity card. Social links open
in a new tab; **Copy link** copies a direct link you can paste into a message.
On supported devices, **More options** opens your device's sharing menu.
If automatic copying is unavailable, select and copy the link shown on the card.

Friends opening a shared link will be taken to the highlighted activity.
Sharing is available without logging in, including for full activities.
Shared messages include only public activity details and a link, never participant
emails or teacher information. No social account connection is required by this
website; the selected social platform may ask you to log in before posting.

## Development Guide

For detailed setup and development instructions, please refer to our [Development Guide](../docs/how-to-develop.md).

Sharing link tests can be run from the repository root with Node.js 22.7 or later:

```bash
node --test src/tests/sharing.test.js
```
