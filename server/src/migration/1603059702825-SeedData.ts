import type { MigrationInterface } from "typeorm";
import type { Polygon, GardenLocal, FamilyLocal } from "@mendel/common";
import seedBeds from "./SeedBeds.json" assert { type: "json" };
import { readdir, readFile } from "fs/promises";
import { parse, join } from "path";
import type { Container} from "@svgdotjs/svg.js";
import { SVG, registerWindow } from "@svgdotjs/svg.js";
//@ts-ignore
import { createSVGWindow } from "svgdom";
import { Garden, Family } from "@mendel/common";
import { getDataSource } from "../dataSource.js";

async function loadSvgs(container: Container): Promise<Map<string, string>> {
  const files = await readdir(join(__dirname, "./icons"), {
    withFileTypes: true,
  });

  const svgs = await Promise.all(
    files.map(async (file) => {
      const d = await readFile(join(__dirname, `./icons/${file.name}`));

      const svgString = d.toString();
      const start = svgString.indexOf("<svg");

      container.svg(svgString.substring(start));

      const svg = container.findOne("svg");

      if (!svg) {
        throw new Error(`No svg found parsing file ${file.name}.`);
      }

      const artboard = svg.findOne("svg>rect:first-child");

      if (artboard?.attr("id")) {
        artboard.remove();
      }

      const symbol = container
        .symbol()
        .attr("viewBox", svg.attr("viewBox"))
        .attr("style", svg.attr("style"));

      svg.children().forEach((c) => symbol.add(c));

      let result = symbol.svg();

      result = result.replace("fill:none;", "");

      svg.remove();
      symbol.remove();

      return result;
    }),
  );

  return new Map(files.map((f, i) => [parse(f.name).name, svgs[i]]));
}

export class SeedData1603059702825 implements MigrationInterface {
  public async up(): Promise<void> {
    const garden: GardenLocal = {
      name: "2307 Stillwater",
      location: {
        type: "Point",
        coordinates: [-93.003347, 44.968675],
      },
      beds: [],
      plans: [],
    };

    garden.beds = seedBeds.features
      .filter((f) => f.geometry.type === "Polygon")
      .map((f) => ({
        shape: f.geometry as Polygon,
        startDate: new Date(2019, 5, 15),
      }));

    garden.plans = [
      {
        name: "Test plan",
        description: "A dummy plan created automatically.",
        year: 2023,
        createdDate: new Date(),
        draft: false,
        updatedDate: new Date(),
        plantings: [],
      },
    ];

    await getDataSource().getRepository(Garden).save(garden);

    const window = createSVGWindow();
    const document = window.document;
    registerWindow(window, document);

    const container = SVG(document.documentElement) as Container;

    const svgs = await loadSvgs(container);

    await getDataSource()
      .getRepository(Family)
      .save<FamilyLocal>([
        {
          name: "Tomato",
          color: "#ff4518",
          icon: svgs.get("tomato") ?? "",
          spacing: 24,
          varieties: [
            {
              name: "Cherokee Purple",
              color: "#98082f",
              plantings: [],
            },
            {
              name: "Black Krim",
              color: "#6c0521",
              plantings: [],
            },
          ],
        },
        {
          name: "Cherry Tomato",
          color: "#ff4518",
          icon: svgs.get("cherry tomato") ?? "",
          spacing: 12,
          varieties: [
            {
              name: "Yellow Pear",
              color: "#fadc17",
              plantings: [],
            },
            {
              name: "Tommy Toe",
              color: "#E03518",
              plantings: [],
            },
          ],
        },
        {
          name: "Potato",
          color: "#d9cbaf",
          icon: svgs.get("potato") ?? "",
          spacing: 4,
          varieties: [
            {
              name: "Butterball",
              color: "#EAD284",
              plantings: [],
            },
            {
              name: "Purple Viking",
              color: "#907096",
              plantings: [],
            },
          ],
        },
        {
          name: "Radish",
          color: "#C8172E",
          icon: svgs.get("radish") ?? "",
          spacing: 3,
          varieties: [
            {
              name: "Radish",
              color: "#C8172E",
              plantings: [],
            },
          ],
        },
        {
          name: "Carrot",
          color: "#F76610",
          icon: svgs.get("carrot") ?? "",
          spacing: 3,
          varieties: [
            {
              name: "Carrot",
              color: "#F76610",
              plantings: [],
            },
          ],
        },
        {
          name: "Garlic",
          color: "#DEDAD7",
          icon: svgs.get("garlic") ?? "",
          spacing: 8,
          varieties: [
            {
              name: "Garlic",
              color: "#DEDAD7",
              plantings: [],
            },
          ],
        },
        {
          name: "Hot Pepper",
          color: "#B81F14",
          icon: svgs.get("pepper") ?? "",
          spacing: 15,
          varieties: [
            {
              name: "Hot Pepper",
              color: "#B81F14",
              plantings: [],
            },
          ],
        },
        {
          name: "Broccoli",
          color: "#A6C653",
          icon: svgs.get("broccoli") ?? "",
          spacing: 18,
          varieties: [
            {
              name: "Broccoli",
              color: "#A6C653",
              plantings: [],
            },
          ],
        },
        {
          name: "Pea",
          color: "#86A71F",
          icon: svgs.get("pea") ?? "",
          spacing: 4,
          varieties: [
            {
              name: "Sweet Pea",
              color: "#86A71F",
              plantings: [],
            },
          ],
        },
        {
          name: "Eggplant",
          color: "#5C3F5B",
          icon: svgs.get("eggplant") ?? "",
          spacing: 24,
          varieties: [
            {
              name: "Eggplant",
              color: "#5C3F5B",
              plantings: [],
            },
          ],
        },
        {
          name: "Winter Squash",
          color: "#F1B56B",
          icon: svgs.get("winter squash") ?? "",
          spacing: 30,
          varieties: [
            {
              name: "Butternut Squash",
              color: "#F1B56B",
              plantings: [],
            },
          ],
        },
        {
          name: "Pumpkin",
          color: "#E45604",
          icon: svgs.get("pumpkin") ?? "",
          spacing: 30,
          varieties: [
            {
              name: "Pumpkin",
              color: "#E45604",
              plantings: [],
            },
          ],
        },
      ]);
  }

  public async down(): Promise<void> {
    // TODO: delete seed data?
  }
}
