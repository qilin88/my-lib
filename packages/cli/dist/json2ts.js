#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const quicktype_core_1 = require("quicktype-core");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
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
async function generateTypes(input, outputFile, typeName) {
    try {
        const inputPath = path_1.default.resolve(input);
        if (!await fs_extra_1.default.pathExists(inputPath)) {
            throw new Error(`Input file not found: ${inputPath}`);
        }
        const jsonString = await fs_extra_1.default.readFile(inputPath, 'utf8');
        // 添加错误类型处理
        try {
            JSON.parse(jsonString);
        }
        catch (e) {
            // 验证是否是 Error 类型
            if (e instanceof Error) {
                throw new Error(`Invalid JSON in file: ${inputPath}\n${e.message}`);
            }
            // 如果不是 Error 类型，提供一个通用错误信息
            throw new Error(`Invalid JSON in file: ${inputPath}`);
        }
        const jsonInput = (0, quicktype_core_1.jsonInputForTargetLanguage)("typescript");
        await jsonInput.addSource({
            name: typeName,
            samples: [jsonString]
        });
        const inputData = new quicktype_core_1.InputData();
        inputData.addInput(jsonInput);
        const result = await (0, quicktype_core_1.quicktype)({
            inputData,
            lang: "typescript",
            rendererOptions: {
                "just-types": "true",
                "runtime-typecheck": "false"
            }
        });
        await fs_extra_1.default.outputFile(outputFile, result.lines.join('\n'));
        console.log(chalk_1.default.green(`✨ Types generated successfully at ${outputFile}`));
    }
    catch (error) {
        // 错误处理
        if (error instanceof Error) {
            console.error(chalk_1.default.red('Error generating types:'), error.message);
        }
        else {
            console.error(chalk_1.default.red('Error generating types:'), 'An unknown error occurred');
        }
        process.exit(1);
    }
}
commander_1.program
    .name('json2ts')
    .description('Convert JSON to TypeScript types')
    .version('1.0.0')
    .requiredOption('-i, --input <path>', 'Input JSON file path')
    .option('-o, --output <path>', 'Output TypeScript file path', './types.ts')
    .option('-n, --name <name>', 'Root type name', 'RootObject')
    .action(async (options) => {
    try {
        const inputPath = path_1.default.resolve(options.input);
        const outputPath = path_1.default.resolve(options.output);
        await generateTypes(inputPath, outputPath, options.name);
    }
    catch (error) {
        console.error(chalk_1.default.red('Error:'), error);
        process.exit(1);
    }
});
commander_1.program.parse();
