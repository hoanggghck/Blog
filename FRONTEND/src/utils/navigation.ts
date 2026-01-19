// utils/navigation.ts
let routerPush: ((path: string) => void) | null = null;

export const setRouter = (fn: (path: string) => void) => {
  routerPush = fn;
};

export const navigateTo = (path: string) => {
  if (routerPush) {
    routerPush(path);
  }
};