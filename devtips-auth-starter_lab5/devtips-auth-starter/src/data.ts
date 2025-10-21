import type { TTip } from "./types";
import { randomUUID } from "crypto";

type TUser = { id: string; username: string; password: string; tips: TTip[] };

let database: TUser[] = [
  {
    id: "A0328Xhf8",
    username: "jimmy123",
    password: "jimmy123!",
    tips: [
      {
        id: "1",
        text: "Prefer const over let when you can.",
        likes: 2,
        createdAt: Date.now() - 10000,
      },
    ],
  },
  {
    id: "BFGZ8328X",
    username: "sandra123",
    password: "sandra123!",
    tips: [
      {
        id: "2",
        text: "Name things clearly, future you will thank you.",
        likes: 5,
        createdAt: Date.now() - 5000,
      },
    ],
  },
];

// TODO: Add a userId field and modify inner logic to use it
export function getTips(userId: string) {
  if (!userId) return [];
  const user = database.find((u) => u.id === userId);
  // return database[0]?.tips;
  return user ? user.tips : [];
}

// TODO: Add a userId field and modify inner logic to use it
export function addTip(userId: string, text: string) {
  const user = database.find((u) => u.id === userId);
  if (!user) return null;

  const tip: TTip = {
    id: randomUUID(),
    text: text,
    likes: 0,
    createdAt: Date.now(),
  };
  user.tips.push(tip);
  return tip;
}

// TODO: Add a userId field and modify inner logic to use it
export function like(userId: string, id: string) {
  const user = database.find((u) => u.id === userId);
  const foundTip = user?.tips.find((t) => t.id === id);
  if (foundTip) {
    foundTip.likes++;
  }
  return foundTip;
}

// TODO: Add a userId field and modify inner logic to use it
export function dislike(userId: string, id: string) {
  const user = database.find((u) => u.id === userId);
  const foundTip = user?.tips.find((t) => t.id === id);
  if (foundTip && foundTip.likes > 0) {
    foundTip.likes--;
  }
  return foundTip;
}

// TODO: Add a userId field and modify inner logic to use it
export function remove(userId: string, id: string) {
  const user = database.find((u) => u.id === userId);
  const tipToDelete = user?.tips.findIndex((t) => t.id === id);
  if (user != undefined && tipToDelete != undefined && tipToDelete != -1) {
    user.tips.splice(tipToDelete, 1);
  }
}

//helper function
export function findUser(username: string, password: string) {
  return database.find(
    (u) => u.username === username && u.password === password
  );
}
