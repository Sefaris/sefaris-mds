/**
 * Stub for the `#preload` virtual module used during tests under `tests/`.
 * The real implementation lives in `packages/preload`, but it imports
 * `electron`, which cannot be evaluated in a Vitest environment. Tests that
 * exercise renderer code mock the individual functions via `vi.mock('#preload')`.
 */
export {};
