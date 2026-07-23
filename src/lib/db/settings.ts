import { cache } from 'react';
import { prisma } from '../prisma';

export async function getSetting(key: string): Promise<string | null> {
  const setting = await prisma.siteSetting.findUnique({
    where: { key },
  });
  return setting?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export const getAllSettings = cache(async (): Promise<Record<string, string>> => {
  const settings = await prisma.siteSetting.findMany();
  return settings.reduce(
    (acc, s) => {
      acc[s.key] = s.value;
      return acc;
    },
    {} as Record<string, string>,
  );
});
