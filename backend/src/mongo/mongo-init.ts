export async function initMongoIndexes(models: any[]) {
  await Promise.all(models.map((m) => m.init())); // builds declared indexes
}
