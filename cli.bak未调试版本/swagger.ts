import SwaggerParser from '@apidevtools/swagger-parser';
import fs from 'fs-extra';
import path from 'path';

interface ApiEndpoint {
  path: string;
  method: string;
  operationId: string;
  summary?: string;
  parameters?: any[];
  requestBody?: any;
  responses?: any;
}

export async function generateApiTypes(swaggerPath: string, outputDir: string) {
  try {
    // 解析 Swagger 文档
    const swagger = await SwaggerParser.parse(swaggerPath);
    
    // 获取所有 API 端点
    const apis = extractApiEndpoints(swagger);
    
    // 确保输出目录存在
    await fs.ensureDir(outputDir);

    // 生成类型文件
    for (const api of apis) {
      await generateEndpointTypes(api, outputDir);
    }

    console.log('✨ API types generated successfully!');
  } catch (error) {
    console.error('Error generating API types:', error);
  }
}

function extractApiEndpoints(swagger: any): ApiEndpoint[] {
  const apis: ApiEndpoint[] = [];
  
  Object.entries(swagger.paths).forEach(([path, methods]: [string, any]) => {
    Object.entries(methods).forEach(([method, spec]: [string, any]) => {
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

async function generateEndpointTypes(api: ApiEndpoint, outputDir: string) {
  const fileName = `${api.operationId}.ts`;
  const filePath = path.join(outputDir, fileName);

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

  await fs.writeFile(filePath, content);
}

function generateRequestTypes(api: ApiEndpoint): string {
  let content = '';

  // 路径参数
  const pathParams = api.parameters?.filter(p => p.in === 'path');
  if (pathParams?.length) {
    content += `export interface ${api.operationId}Request {\n`;
    pathParams.forEach(param => {
      content += `  ${param.name}: ${mapSwaggerType(param.schema)};\n`;
    });
    content += '}\n\n';
  }

  // 请求体
  if (api.requestBody) {
    const schema = api.requestBody.content['application/json']?.schema;
    if (schema) {
      content += `export interface ${api.operationId}RequestBody {\n`;
      content += generateTypeFromSchema(schema);
      content += '}\n\n';
    }
  }

  return content;
}

function generateResponseTypes(api: ApiEndpoint): string {
  let content = '';

  Object.entries(api.responses).forEach(([statusCode, response]: [string, any]) => {
    const schema = response.content?.['application/json']?.schema;
    if (schema) {
      content += `export interface ${api.operationId}Response {\n`;
      content += generateTypeFromSchema(schema);
      content += '}\n\n';
    }
  });

  return content;
}

function generateTypeFromSchema(schema: any): string {
  let content = '';

  if (schema.type === 'object' && schema.properties) {
    Object.entries(schema.properties).forEach(([propName, prop]: [string, any]) => {
      content += `  ${propName}: ${mapSwaggerType(prop)};\n`;
    });
  }

  return content;
}

function mapSwaggerType(schema: any): string {
  if (!schema) return 'any';

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