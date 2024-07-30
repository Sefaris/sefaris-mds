import { shell } from 'electron';

export function openWebsite(href: string) {
  shell.openExternal(href);
}
