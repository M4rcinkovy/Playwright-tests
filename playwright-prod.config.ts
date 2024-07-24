import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

require('dotenv').config();

export default defineConfig<TestOptions>({

  use: {
    globalsQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/#Photo%20Manager',
    baseURL: 'http://localhost:4201/',
  },

  projects: [
    {
      name: 'chromium',
    }
  ],
});
