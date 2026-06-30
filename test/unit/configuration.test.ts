import { beforeEach, describe, expect, it } from 'vitest';

import { getConfig } from '../../src/config/configuration';
import { resetConfig, seedConfig } from '../mocks/vscode';

describe('getConfig', () => {
  beforeEach(() => {
    resetConfig();
  });

  it('returns built-in defaults when nothing is configured', () => {
    expect(getConfig()).toEqual({ greeting: 'Hello', enableStatusBar: true });
  });

  it('reflects configured values', () => {
    seedConfig('vsExtBoilerplate', { greeting: 'Hi', enableStatusBar: false });
    expect(getConfig()).toEqual({ greeting: 'Hi', enableStatusBar: false });
  });
});
