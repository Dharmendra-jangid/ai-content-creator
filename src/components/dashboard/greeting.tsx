"use client";

import { useSyncExternalStore } from "react";

type GreetingProps = {
  name: string;
};

function getGreeting(date: Date) {
  const hour = date.getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

function subscribe() {
  return () => {};
}

function getClientGreeting() {
  return getGreeting(new Date());
}

function getServerGreeting() {
  return "Welcome back";
}

export function Greeting({ name }: GreetingProps) {
  const greeting = useSyncExternalStore(
    subscribe,
    getClientGreeting,
    getServerGreeting,
  );
  const first = name.split(" ")[0] ?? name;

  return (
    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
      {greeting}, {first}
    </h1>
  );
}
