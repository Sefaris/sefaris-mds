/* eslint-disable @typescript-eslint/no-unused-vars */
import * as fs from 'fs';
import * as os from 'os';

import path from 'path';
import {loadConfiguration} from './configuration-service';
import type {Mod} from 'src/interfaces/mod';

const G3_DOCUMENTS_PATH = path.join(os.homedir(), 'Documents');

const STATIC_FILE_MOD_EXTENSTION = '0x';
const STRINGTABLE_FILENAME = 'stringtable.ini';
const STRINGTABLEMOD_FILENAME = 'stringtablemod.ini';

const MOD_EXTENSTIONS = ['mod', 'nod'];
const SAVE_EXTENSION = 'g3savcpx';
const SAVEDAT_EXTENSION = 'g3savcpxdat';
const SPLASH = 'splash.bmp';
const SHADER = 'Shader.Cache';

export async function InstallMods(mods: Mod[]): Promise<void> {
  const configuration = await loadConfiguration();
}
