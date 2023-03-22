import { MigrationInterface, Polygon } from "typeorm";
import { features } from "./SeedBeds.json";
import fs from "fs";
import path from "path";
import { SVG, Container, registerWindow } from "@svgdotjs/svg.js";
//@ts-ignore
import { createSVGWindow } from "svgdom";
import { Garden, Bed, Variety, Family } from "@mendel/common";
import { dataSource } from "../dataSource";

export class SeedData1603059702825 implements MigrationInterface {
  public async up(): Promise<void> {
    const garden = await dataSource.getRepository(Garden).save({
      name: "2307 Stillwater",
      location: {
        type: "Point",
        coordinates: [-93.003347, 44.968675],
      },
    });

    await dataSource.getRepository(Bed).save(
      features
        .filter((f) => f.geometry.type === "Polygon")
        .map((f) => ({
          shape: f.geometry as Polygon,
          startDate: new Date(2019, 5, 15),
          garden: garden,
        }))
    );

    const window = createSVGWindow();
    const document = window.document;
    registerWindow(window, document);

    const draw = SVG(document.documentElement) as Container;

    const svgs = await Promise.all([
      this.loadSvg(draw, "tomato"),
      this.loadSvg(draw, "cherry tomato"),
      this.loadSvg(draw, "potato"),
    ]);

    const tomato = new Family("Tomato", "#ff4518", svgs[0], 10);

    const cherry = new Family("Cherry Tomato", "#ff4518", svgs[1], 8);

    const potato = new Family("Potato", "#d9cbaf", svgs[2], 4);

    await dataSource.getRepository(Family).save([tomato, cherry, potato]);

    await dataSource
      .getRepository(Variety)
      .save([
        new Variety("Cherokee Purple", "#98082f", tomato),
        new Variety("Yellow Pear", "#fadc17", cherry),
        new Variety("Black Krum", "#6c0521", cherry),
      ]);
  }

  private async loadSvg(draw: Container, name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, `./icons/${name}.svg`), (err, data) => {
        if (err) {
          reject(err);
        } else {
          const svgString = data.toString();
          const start = svgString.indexOf("<svg");

          draw.svg(svgString.substr(start));

          const svg = draw.findOne("svg");

          const artboard = svg?.findOne("svg>rect:first-child");

          if (artboard?.attr("id")) {
            artboard.remove();
          }

          const symbol = draw
            .symbol()
            .attr("viewBox", svg?.attr("viewBox"))
            .attr("style", svg?.attr("style"));

          svg?.children().forEach((c) => symbol.add(c));

          let result = symbol.svg();

          result = result.replace("fill:none;", "");

          svg?.remove();
          symbol.remove();

          resolve(result);
        }
      });
    });
  }

  public async down(): Promise<void> {
    // TODO: delete seed data?
  }
}
