#!/usr/bin/env node;
import { program } from 'commander';
import { generateTypesFromSwagger } from './swagger';

program
  .name('json2ts')
  .description('Generate TypeScript types from JSON or Swagger')
  .version('1.0.0');

// 添加 swagger 命令
program
  .command('swagger')
  .description('Generate types from Swagger/OpenAPI specification')
  .option('-u, --url <url>', 'Swagger API URL')
  .option('-f, --file <path>', 'Local Swagger file path')
  .option('-o, --output <dir>', 'Output directory', './types')
  .action(async (options) => {
    await generateTypesFromSwagger({
      url: options.url,
      file: options.file,
      output: options.output
    });
  });

program.parse();