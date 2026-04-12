import { contextBridge } from 'electron';
import * as preloadApi from './index';

const EXPOSED_PREFIX = '__electron_preload__';

for (const [key, value] of Object.entries(preloadApi)) {
  contextBridge.exposeInMainWorld(EXPOSED_PREFIX + key, value);
}
