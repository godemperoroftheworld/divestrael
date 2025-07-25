import { Key } from '@prisma/client';

import prisma from '@/prisma';

export default class KeyService {
  private static _keys: Key[] = [];

  public static async keys(): Promise<Set<string>> {
    if (!this._keys.length) {
      this._keys = await prisma.key.findMany();
    }
    return new Set(this._keys.map((k) => k.key));
  }
}
