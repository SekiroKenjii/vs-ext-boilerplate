/**
 * Pure formatting helper, deliberately free of the `vscode` API so it can be
 * unit-tested without any host or mock. This is the recommended place for
 * business logic: keep it out of files that import `vscode`.
 */
export function formatGreeting(greeting: string, subject: string): string {
  const normalized = greeting.trim() || 'Hello';
  return `${normalized}, ${subject}!`;
}
