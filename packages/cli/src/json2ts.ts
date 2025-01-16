#!/usr/bin/env node
import { program } from 'commander';
import { quicktype, InputData, jsonInputForTargetLanguage,JSONSchemaInput } from 'quicktype-core';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

// async function generateTypes(input: string, outputFile: string, typeName: string) {
//   try {
//     // 使用 path 模块处理路径
//     const inputPath = path.resolve(input);
    
//     // 检查文件是否存在
//     if (!await fs.pathExists(inputPath)) {
//       throw new Error(`Input file not found: ${inputPath}`);
//     }

//     // 读取并解析 JSON
//     const jsonString = await fs.readFile(inputPath, 'utf8');
    
//     // 验证 JSON 是否有效
//     try {
//       JSON.parse(jsonString);
//     } catch (e) {
//       throw new Error(`Invalid JSON in file: ${inputPath}\n${e.message}`);
//     }

//     const jsonInput = jsonInputForTargetLanguage("typescript");
    
//     await jsonInput.addSource({
//       name: typeName,
//       samples: [jsonString]
//     });

//     const inputData = new InputData();
//     inputData.addInput(jsonInput);

//     const result = await quicktype({
//       inputData,
//       lang: "typescript",
//       rendererOptions: {
//         "just-types": "true",
//         "runtime-typecheck": "false"
//       }
//     });

//     await fs.outputFile(outputFile, result.lines.join('\n'));
//     console.log(chalk.green(`✨ Types generated successfully at ${outputFile}`));
//   } catch (error) {
//     console.error(chalk.red('Error generating types:'), error.message);
//     process.exit(1);
//   }
// }
async function generateTypes(input: string, outputFile: string, typeName: string) {
  try {
    const inputPath = path.resolve(input);
    
    if (!await fs.pathExists(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    const jsonString = await fs.readFile(inputPath, 'utf8');
    
    // 添加错误类型处理
    try {
      JSON.parse(jsonString);
    } catch (e: unknown) {
      // 验证是否是 Error 类型
      if (e instanceof Error) {
        throw new Error(`Invalid JSON in file: ${inputPath}\n${e.message}`);
      }
      // 如果不是 Error 类型，提供一个通用错误信息
      throw new Error(`Invalid JSON in file: ${inputPath}`);
    }

    const jsonInput = jsonInputForTargetLanguage("typescript");
    
    await jsonInput.addSource({
      name: typeName,
      samples: [jsonString]
    });

    const inputData = new InputData();
    inputData.addInput(jsonInput);

    const result = await quicktype({
      inputData,
      lang: "typescript",
      rendererOptions: {
        "just-types": "true",
        "runtime-typecheck": "false"
      }
    });

    await fs.outputFile(outputFile, result.lines.join('\n'));
    console.log(chalk.green(`✨ Types generated successfully at ${outputFile}`));
  } catch (error: unknown) {
    // 错误处理
    if (error instanceof Error) {
      console.error(chalk.red('Error generating types:'), error.message);
    } else {
      console.error(chalk.red('Error generating types:'), 'An unknown error occurred');
    }
    process.exit(1);
  }
}

program
  .name('json2ts')
  .description('Convert JSON to TypeScript types')
  .version('1.0.0')
  .requiredOption('-i, --input <path>', 'Input JSON file path')
  .option('-o, --output <path>', 'Output TypeScript file path', './types.ts')
  .option('-n, --name <name>', 'Root type name', 'RootObject')
  .action(async (options) => {
    try {
      const inputPath = path.resolve(options.input);
      const outputPath = path.resolve(options.output);
      await generateTypes(inputPath, outputPath, options.name);
    } catch (error) {
      console.error(chalk.red('Error:'), error);
      process.exit(1);
    }
  });

program.parse();