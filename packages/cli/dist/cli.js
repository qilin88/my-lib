#!/usr/bin/env node;
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const swagger_1 = require("./swagger");
commander_1.program
    .name('json2ts')
    .description('Generate TypeScript types from JSON or Swagger')
    .version('1.0.0');
// 添加 swagger 命令
commander_1.program
    .command('swagger')
    .description('Generate types from Swagger/OpenAPI specification')
    .option('-u, --url <url>', 'Swagger API URL')
    .option('-f, --file <path>', 'Local Swagger file path')
    .option('-o, --output <dir>', 'Output directory', './types')
    .action(async (options) => {
    await (0, swagger_1.generateTypesFromSwagger)({
        url: options.url,
        file: options.file,
        output: options.output
    });
});
commander_1.program.parse();
