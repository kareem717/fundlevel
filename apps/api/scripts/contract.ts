import fs from "node:fs";
import { minifyContractRouter } from "@orpc/contract";
import { appRouter } from "../src/orpc/routers/_app";

const minifiedRouter = minifyContractRouter(appRouter);

fs.writeFileSync("./contract.json", JSON.stringify(minifiedRouter));
