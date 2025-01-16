#!/usr/bin/env node
import { program } from 'commander';
import { quicktype, InputData } from 'quicktype-core';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import axios from 'axios';
import glob from 'glob';
import { Config } from './types';

// 读取配置文件
async function loadConfig(configPath: string): Promise<Config> {
  try {
    if (await fs.pathExists(configPath)) {
      const config = await fs.readJSON(configPath);
      return config;
    }
    return {};
  } catch (error) {
    console.warn(chalk.yellow('Error loading config file, using defaults'));
    return {};
  }
}

// 从 URL 获取 JSON
async function fetchJsonFromUrl(url: string, timeout: number = 5000): Promise<string> {
  try {
    const response = await axios.get(url, { timeout });
    return JSON.stringify(response.data);
  } catch (error) {
    throw new Error(`Failed to fetch JSON from URL: ${error.message}`);
  }
}

// 生成类型定义
async function generateTypes(
  input: string, 
  outputFile: string, 
  typeName: string,
  isUrl: boolean = false
) {
  try {
    // 获取 JSON 字符串
    const jsonString = isUrl 
      ? await fetchJsonFromUrl(input)
      : await fs.readFile(input, 'utf8');

    const inputData = new InputData();
    const source = {
      name: typeName,
      samples: [jsonString],
    };

    await inputData.addSource('json', source, () => ({ acronymStyle: 'original' }));

    const result = await quicktype({
      inputData,
      lang: 'typescript',
      rendererOptions: {
        'just-types': 'true',
        'runtime-typecheck': 'false'
      }
    });

    await fs.ensureDir(path.dirname(outputFile));
    await fs.writeFile(outputFile, result.lines.join('\n'));
    console.log(chalk.green(`✨ Generated types at ${outputFile}`));
  } catch (error) {
    console.error(chalk.red(`Error generating types for ${input}:`), error);
    throw error;
  }
}

// 处理目录
async function processDirectory(
  inputDir: string,
  outputDir: string,
  config: Config
) {
  const files = glob.sync('**/*.json', {
    cwd: inputDir,
    ignore: config.excludePatterns || [],
    absolute: true
  });

  console.log(chalk.blue(`Found ${files.length} JSON files to process`));

  for (const file of files) {
    const relativePath = path.relative(inputDir, file);
    const outputPath = path.join(
      outputDir,
      relativePath.replace(/\.json$/, '.ts')
    );
    
    const typeName = path.basename(file, '.json')
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/^[^a-zA-Z_]/, '_');

    try {
      await generateTypes(file, outputPath, typeName);
    } catch (error) {
      console.error(chalk.yellow(`Skipping ${file} due to error`));
    }
  }
}

program
  .name('json2ts')
  .description('Convert JSON to TypeScript types')
  .version('1.0.0');

// 单文件转换命令
program
  .command('convert')
  .description('Convert single JSON file or URL to TypeScript')
  .requiredOption('-i, --input <path>', 'Input JSON file path or URL')
  .option('-o, --output <path>', 'Output TypeScript file path')
  .option('-n, --name <name>', 'Root type name', 'RootObject')
  .option('-c, --config <path>', 'Config file path', 'json2ts.config.json')
  .action(async (options) => {
    try {
      const config = await loadConfig(options.config);
      const isUrl = options.input.startsWith('http');
      const outputPath = options.output || (isUrl 
        ? `${path.basename(options.input, '.json')}.ts`
        : options.input.replace(/\.json$/, '.ts'));

      await generateTypes(
        options.input,
        outputPath,
        options.name,
        isUrl
      );
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

// 目录处理命令
program
  .command('batch')
  .description('Convert all JSON files in a directory')
  .requiredOption('-i, --input <dir>', 'Input directory')
  .option('-o, --output <dir>', 'Output directory')
  .option('-c, --config <path>', 'Config file path', 'json2ts.config.json')
  .action(async (options) => {
    try {
      const config = await loadConfig(options.config);
      const outputDir = options.output || path.join(options.input, 'types');
      await processDirectory(options.input, outputDir, config);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program.parse();