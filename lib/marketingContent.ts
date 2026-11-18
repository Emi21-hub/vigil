// Vigil marketing content, generated from TEMPLATES with real product facts.
// It is not AI content and includes no testimonials, user numbers or press logos.
// Facts that can be stated today: it uses no cameras; the ladder goes from "you" to trusted
// contacts to a hand-off to a person; alerts are simulated; it is a student demo.

import type { Card } from "./marketingEngine";

export const BRAND_CARD: Card = {
  id: "brand",
  kind: "brand",
  title: "Brand system",
  text: [
    "Name: Vigil",
    "Promise: alerts you if someone enters your home and notifies trusted people in order, without recording your home.",
    "Voice: calm, direct and honest. Short sentences. Says what exists today and what is only a plan.",
    "Words we use: alert, trusted contacts, ladder, no cameras, prototype.",
    "Words we avoid: the best, revolutionary, 100% safe, guaranteed, total protection.",
    "Color: near-black background (#0a0a0a), light text and a single amber accent for urgent things.",
    "Typography: the same as the product, system sans-serif.",
    "Honesty rule: every alert is simulated today and Vigil does not call emergency services.",
  ].join("\n"),
};

export const PERSONA_CARD: Card = {
  id: "persona",
  kind: "persona",
  title: "Target persona (fictional, working)",
  text: [
    "LABEL: fictional persona built from the Segment A hypothesis. It is not an interview or a real person.",
    "Camila, 31, freelance designer who rents an apartment in Narvarte, Mexico City.",
    "Situation: lives alone, has no alarm. A camera inside her home feels invasive.",
    "Pain: if someone broke in, nobody would find out in time, and notifications from an app nobody answers are useless.",
    "What she wants: for her brother and a trusted neighbor to be notified, in order, without her home being recorded.",
    "What holds her back: she does not trust apps that ask for too much data; she does not want to pay for something she does not understand.",
    "Where we find her (hypothesis): Instagram and TikTok, neighborhood groups, recommendations from friends.",
    "Validation pending: there are no real conversations recorded with this profile yet.",
  ].join("\n"),
};

export const LANDING_CARD: Card = {
  id: "landing",
  kind: "landing",
  title: "Home page copy",
  text: [
    "Headline A: Intrusion alerts for your home, without cameras",
    "Headline B: If someone breaks in, let someone who answers find out",
    "Subtitle: Vigil alerts you first, then your trusted contacts, and finally hands the alert to a person. It does not record your home.",
    "Button A: Try the demo",
    "Button B: Try the demo for free",
    "How it works: 1) You arm your property. 2) If something triggers it, the alert climbs the ladder. 3) Someone responds and the incident is kept in the history.",
    "Visible disclaimer: it is a student demo, alerts are simulated and Vigil does not contact emergency services.",
    "FAQ: Does it use cameras? No. Vigil does not record images or audio of your home.",
  ].join("\n"),
};

const FOOT = "Student demo: alerts are simulated.";

export const POSTS: Card[] = [
  { id: "post-1", kind: "post", title: "Post 1 (Instagram): the 3 a.m. question",
    text: ["If someone enters your home while you sleep, who finds out?", "Almost nobody. That is why I built Vigil: an alert that climbs a ladder of trusted people, without cameras.", "Try it: vigil-vigil21.vercel.app", FOOT, "#nocameras #security #cdmx"].join("\n\n") },
  { id: "post-2", kind: "post", title: "Post 2 (X): one sentence",
    text: ["An alarm that only sends you a notification solves nothing if nobody answers it. Vigil tests another idea: you, then your contacts, then a person.", "vigil-vigil21.vercel.app", FOOT].join("\n\n") },
  { id: "post-3", kind: "post", title: "Post 3 (LinkedIn): the problem",
    text: ["Living alone and not wanting cameras inside your home leaves many people with no protection at all.", "I am testing a prototype, Vigil, for that case: an alert that escalates through trusted contacts and does not record the home.", "It is a course project. Today the alerts are simulated and I am looking for opinions, not customers.", "vigil-vigil21.vercel.app"].join("\n\n") },
  { id: "post-4", kind: "post", title: "Post 4 (Instagram): how it works",
    text: ["How Vigil works in 3 steps:", "1. You arm your property.\n2. If something triggers it, the alert climbs: you, your contacts, a person.\n3. Someone responds and it is logged.", "In the demo the timings are 60 and 120 seconds so you can see it.", FOOT].join("\n\n") },
  { id: "post-5", kind: "post", title: "Post 5 (X): honesty",
    text: ["What Vigil does today: arm, escalate, history, contacts.\nWhat it does NOT do yet: real SMS, sensors, accounts.", "We prefer to say it clearly. Details at vigil-vigil21.vercel.app/product"].join("\n\n") },
  { id: "post-6", kind: "post", title: "Post 6 (Instagram): no cameras",
    text: ["Why no cameras?", "Because a camera inside your home records your life, not just an intrusion. Vigil keeps only what happened and who was notified.", FOOT, "#privacy #nocameras"].join("\n\n") },
  { id: "post-7", kind: "post", title: "Post 7 (LinkedIn): research",
    text: ["Before building Vigil I reviewed 5 global cases and 8 competitors, each with a source and a confidence level. What I could not verify I marked as not verified.", "It is published at vigil-vigil21.vercel.app/research"].join("\n\n") },
  { id: "post-8", kind: "post", title: "Post 8 (X): open question",
    text: ["A real question: if a relative who lives alone could alert you when someone enters their home, would you use it? Who should pay?", "I answer everything: vigil-vigil21.vercel.app", FOOT].join("\n\n") },
  { id: "post-9", kind: "post", title: "Post 9 (Instagram): trusted contacts",
    text: ["The part of Vigil that matters most is not the alarm: it is who it notifies.", "You define level 1 and level 2 contacts. If the first does not respond, the next one follows.", "Try it with your own sample contacts.", FOOT].join("\n\n") },
  { id: "post-10", kind: "post", title: "Post 10 (LinkedIn): what comes next",
    text: ["What is next for Vigil: validating with real people whether they would pay for this and how much, before adding SMS or sensors.", "If you live alone, or have a relative who lives alone, 10 minutes of your opinion would help me.", "vigil-vigil21.vercel.app"].join("\n\n") },
];

export const SCRIPTS: Card[] = [
  { id: "script-1", kind: "script", title: "Script 1 (30 s): the ladder in action",
    text: ["0-5 s  Screen: Arm button. Voice: I arm my home with one click.", "5-12 s  Screen: Simulate intrusion. Voice: Someone gets in. Vigil records nothing, it only alerts.", "12-22 s  Screen: counter and level 2. Voice: It alerts me first. If I do not respond, it climbs to my trusted contacts.", "22-30 s  Screen: level 3. Voice: At the end it hands the alert to a person. In the demo the timings are short.", "On-screen close: Student demo, simulated alerts."].join("\n") },
  { id: "script-2", kind: "script", title: "Script 2 (30 s): why no cameras",
    text: ["0-6 s  Voice to camera: A camera in your living room records your whole life.", "6-16 s  Screen: Vigil history. Voice: Vigil keeps only what happened, when and who was notified.", "16-26 s  Screen: /product page. Voice: And it tells you honestly what exists today and what is only a plan.", "26-30 s  Close: Try it at vigil-vigil21.vercel.app"].join("\n") },
  { id: "script-3", kind: "script", title: "Script 3 (45 s): behind the project",
    text: ["0-8 s  Voice to camera: This is a course project and everything is a prototype.", "8-20 s  Screen: /research. Voice: First I researched cases and competitors, with a source and a confidence level.", "20-34 s  Screen: /pricing. Voice: Then I calculated revenue with assumptions that I myself marked as possible errors.", "34-45 s  Screen: home. Voice: I am looking for opinions from people who live alone or have relatives who live alone."].join("\n") },
];

export const CALENDAR_DAYS: { day: number; channel: string; piece: string; goal: string }[] = [
  { day: 1, channel: "Instagram", piece: "Post 1", goal: "Introduce the central question" },
  { day: 2, channel: "X", piece: "Post 2", goal: "Traffic to the demo" },
  { day: 3, channel: "TikTok / Reels", piece: "Script 1", goal: "Show the ladder in action" },
  { day: 4, channel: "LinkedIn", piece: "Post 3", goal: "Explain the problem" },
  { day: 5, channel: "Instagram", piece: "Post 4", goal: "Explain how it works" },
  { day: 6, channel: "X", piece: "Post 5", goal: "Build trust through honesty" },
  { day: 7, channel: "TikTok / Reels", piece: "Script 2", goal: "Defend the no-camera approach" },
  { day: 8, channel: "Instagram", piece: "Post 6", goal: "Privacy" },
  { day: 9, channel: "LinkedIn", piece: "Post 7", goal: "Show the research" },
  { day: 10, channel: "X", piece: "Post 8", goal: "Get validation responses" },
  { day: 11, channel: "TikTok / Reels", piece: "Script 3", goal: "Show the process" },
  { day: 12, channel: "Instagram", piece: "Post 9", goal: "Explain trusted contacts" },
  { day: 13, channel: "LinkedIn", piece: "Post 10", goal: "Ask for 10 minutes of opinion" },
  { day: 14, channel: "Internal", piece: "Review", goal: "Read the A/B results and decide what to change" },
];

export const CALENDAR_CARD: Card = {
  id: "calendar",
  kind: "calendar",
  title: "14-day campaign calendar",
  text: CALENDAR_DAYS.map((d) => `Day ${d.day} · ${d.channel} · ${d.piece}: ${d.goal}`).join("\n"),
};

export const ALL_CARDS: Card[] = [BRAND_CARD, PERSONA_CARD, LANDING_CARD, ...POSTS, ...SCRIPTS, CALENDAR_CARD];
