"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateApiTypes = void 0;
const swagger_parser_1 = __importDefault(require("@apidevtools/swagger-parser"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function generateApiTypes(swaggerPath, outputDir) {
    try {
        // 解析 Swagger 文档
        const swagger = await swagger_parser_1.default.parse(swaggerPath);
        // 获取所有 API 端点
        const apis = extractApiEndpoints(swagger);
        // 确保输出目录存在
        await fs_extra_1.default.ensureDir(outputDir);
        // 生成类型文件
        for (const api of apis) {
            await generateEndpointTypes(api, outputDir);
        }
        console.log('✨ API types generated successfully!');
    }
    catch (error) {
        console.error('Error generating API types:', error);
    }
}
exports.generateApiTypes = generateApiTypes;
function extractApiEndpoints(swagger) {
    const apis = [];
    Object.entries(swagger.paths).forEach(([path, methods]) => {
        Object.entries(methods).forEach(([method, spec]) => {
            // 使用路径和方法创建 operationId
            const operationId = `${method}${path.replace(/\//g, '_').replace(/[{}]/g, '')}`
                .replace(/_/g, '')
                .replace(/-/g, '');
            apis.push({
                path,
                method: method.toUpperCase(),
                operationId,
                summary: spec.summary,
                parameters: spec.parameters,
                requestBody: spec.requestBody,
                responses: spec.responses
            });
        });
    });
    return apis;
}
async function generateEndpointTypes(api, outputDir) {
    const fileName = `${api.operationId}.ts`;
    const filePath = path_1.default.join(outputDir, fileName);
    let content = `// ${api.summary || ''}\n`;
    content += `// ${api.method} ${api.path}\n\n`;
    // 生成请求参数类型
    if (api.parameters || api.requestBody) {
        content += generateRequestTypes(api);
    }
    // 生成响应类型
    if (api.responses) {
        content += generateResponseTypes(api);
    }
    await fs_extra_1.default.writeFile(filePath, content);
}
function generateRequestTypes(api) {
    var _a, _b;
    let content = '';
    // 路径参数
    const pathParams = (_a = api.parameters) === null || _a === void 0 ? void 0 : _a.filter(p => p.in === 'path');
    if (pathParams === null || pathParams === void 0 ? void 0 : pathParams.length) {
        content += `export interface ${api.operationId}Request {\n`;
        pathParams.forEach(param => {
            content += `  ${param.name}: ${mapSwaggerType(param.schema)};\n`;
        });
        content += '}\n\n';
    }
    // 请求体
    if (api.requestBody) {
        const schema = (_b = api.requestBody.content['application/json']) === null || _b === void 0 ? void 0 : _b.schema;
        if (schema) {
            content += `export interface ${api.operationId}RequestBody {\n`;
            content += generateTypeFromSchema(schema);
            content += '}\n\n';
        }
    }
    return content;
}
function generateResponseTypes(api) {
    let content = '';
    Object.entries(api.responses).forEach(([statusCode, response]) => {
        var _a, _b;
        const schema = (_b = (_a = response.content) === null || _a === void 0 ? void 0 : _a['application/json']) === null || _b === void 0 ? void 0 : _b.schema;
        if (schema) {
            content += `export interface ${api.operationId}Response {\n`;
            content += generateTypeFromSchema(schema);
            content += '}\n\n';
        }
    });
    return content;
}
function generateTypeFromSchema(schema) {
    let content = '';
    if (schema.type === 'object' && schema.properties) {
        Object.entries(schema.properties).forEach(([propName, prop]) => {
            content += `  ${propName}: ${mapSwaggerType(prop)};\n`;
        });
    }
    return content;
}
function mapSwaggerType(schema) {
    if (!schema)
        return 'any';
    switch (schema.type) {
        case 'integer':
        case 'number':
            return 'number';
        case 'string':
            return 'string';
        case 'boolean':
            return 'boolean';
        case 'array':
            return `${mapSwaggerType(schema.items)}[]`;
        case 'object':
            return 'Record<string, any>';
        default:
            return 'any';
    }
}
