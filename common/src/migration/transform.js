const seedData = require("./SeedBeds.json");

const { writeFileSync } = require("fs");

const origin = seedData.features[0].geometry.coordinates[0][0];

function transformPoint(p) {
  return [
    (p[0] - origin[0]) / 0.0254 - 46.3373,
    (p[1] - origin[1]) / 0.0254 - 37.2513,
  ];
}

for (const feature of seedData.features) {
  for (const shape of feature.geometry.coordinates) {
    shape.forEach((c, i) => {
      shape[i] = transformPoint(c);
    });
  }
}

[...seedData.bbox] = [
  ...transformPoint([seedData.bbox[0], seedData.bbox[1]]),
  ...transformPoint([seedData.bbox[2], seedData.bbox[3]]),
];

writeFileSync("./SeedBedsInches.json", JSON.stringify(seedData, undefined, 2));
