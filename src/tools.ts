export interface JsonSchemaObject {
  type: "object";
  properties?: Record<string, unknown>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface ToolContract {
  name: string;
  description: string;
  inputSchema: JsonSchemaObject;
}

