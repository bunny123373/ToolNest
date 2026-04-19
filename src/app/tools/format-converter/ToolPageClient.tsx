'use client';

import { useState, useCallback } from 'react';

type FormatType = 'json' | 'xml' | 'yaml';

export default function ToolPageClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [inputFormat, setInputFormat] = useState<FormatType>('json');
  const [outputFormat, setOutputFormat] = useState<FormatType>('yaml');
  const [error, setError] = useState('');

  const parseInput = (text: string, format: FormatType): unknown => {
    if (!text.trim()) return null;
    
    switch (format) {
      case 'json':
        return JSON.parse(text);
      case 'xml':
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) throw new Error('Invalid XML');
        return xmlToObj(xmlDoc.documentElement);
      case 'yaml':
        return yamlToJson(text);
      default:
        throw new Error('Unknown format');
    }
  };

  const xmlToObj = (element: Element): unknown => {
    const obj: Record<string, unknown> = {};
    if (element.attributes.length > 0) {
      obj['@attributes'] = {};
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        (obj['@attributes'] as Record<string, string>)[attr.name] = attr.value;
      }
    }
    for (let i = 0; i < element.childNodes.length; i++) {
      const node = element.childNodes[i];
      if (node.nodeType === Node.ELEMENT_NODE) {
        const childElement = node as Element;
        const childObj = xmlToObj(childElement);
        if (obj[childElement.tagName]) {
          if (!Array.isArray(obj[childElement.tagName])) {
            obj[childElement.tagName] = [obj[childElement.tagName]];
          }
          (obj[childElement.tagName] as unknown[]).push(childObj);
        } else {
          obj[childElement.tagName] = childObj;
        }
      } else if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim();
        if (text) obj['#text'] = text;
      }
    }
    return obj;
  };

  const yamlToJson = (yaml: string): unknown => {
    const lines = yaml.split('\n');
    const result: Record<string, unknown> = {};
    let currentKey = '';
    let currentIndent = 0;
    const stack: { obj: Record<string, unknown>; indent: number }[] = [{ obj: result, indent: -1 }];

    for (const line of lines) {
      if (!line.trim() || line.trim().startsWith('#')) continue;
      const indent = line.search(/\S/);
      const match = line.match(/^(\s*)([^:]+):\s*(.*)$/);
      
      if (match) {
        const [, , key, value] = match;
        currentKey = key.trim();
        
        while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
          stack.pop();
        }

        if (value.trim()) {
          let val: unknown = value.trim();
          if (val === 'true') val = true;
          else if (val === 'false') val = false;
          else if (!isNaN(Number(val))) val = Number(val);
          stack[stack.length - 1].obj[currentKey] = val;
        } else {
          const newObj: Record<string, unknown> = {};
          stack[stack.length - 1].obj[currentKey] = newObj;
          stack.push({ obj: newObj, indent });
        }
      }
    }
    return result;
  };

  const objToYaml = (obj: unknown, indent = 0): string => {
    if (obj === null || obj === undefined) return '';
    if (typeof obj !== 'object') return String(obj);
    
    const spaces = '  '.repeat(indent);
    const lines: string[] = [];
    
    if (Array.isArray(obj)) {
      for (const item of obj) {
        if (typeof item === 'object' && item !== null) {
          lines.push(`${spaces}-`);
          lines.push(objToYaml(item, indent + 1));
        } else {
          lines.push(`${spaces}- ${item}`);
        }
      }
    } else {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value) && value.length === 0) {
            lines.push(`${spaces}${key}: []`);
          } else if (Object.keys(value as object).length === 0) {
            lines.push(`${spaces}${key}: {}`);
          } else {
            lines.push(`${spaces}${key}:`);
            lines.push(objToYaml(value, indent + 1));
          }
        } else {
          lines.push(`${spaces}${key}: ${value}`);
        }
      }
    }
    return lines.join('\n');
  };

  const convert = useCallback(() => {
    setError('');
    setOutput('');
    
    if (!input.trim()) return;
    
    try {
      const parsed = parseInput(input, inputFormat);
      if (parsed === null) return;
      
      if (outputFormat === 'json') {
        setOutput(JSON.stringify(parsed, null, 2));
      } else if (outputFormat === 'xml') {
        setOutput(objToXml(parsed, 'root'));
      } else {
        setOutput(objToYaml(parsed));
      }
    } catch (err) {
      setError(`Conversion error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [input, inputFormat, outputFormat]);

  const objToXml = (obj: unknown, tag = 'root'): string => {
    if (obj === null || obj === undefined) return '';
    if (typeof obj !== 'object') return `<${tag}>${obj}</${tag}>`;
    
    let xml = '';
    if (Array.isArray(obj)) {
      for (const item of obj) {
        xml += objToXml(item, tag);
      }
    } else {
      xml += `<${tag}>`;
      for (const [key, value] of Object.entries(obj)) {
        if (key === '@attributes') continue;
        xml += objToXml(value, key);
      }
      xml += `</${tag}>`;
    }
    return xml;
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      alert('Failed to copy');
    }
  };

  const sampleJson = '{"name":"ToolNest","version":"1.0","features":["json","xml","yaml"]}';

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-4">
            <span className="text-3xl">🔄</span>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Format Converter</h1>
          <p className="text-text-secondary">Convert between JSON, XML, and YAML formats</p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <label className="text-text-primary font-medium">From:</label>
            <select
              value={inputFormat}
              onChange={(e) => setInputFormat(e.target.value as FormatType)}
              className="px-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="json">JSON</option>
              <option value="xml">XML</option>
              <option value="yaml">YAML</option>
            </select>
          </div>
          
          <button
            onClick={convert}
            className="px-6 py-2 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-all"
          >
            Convert
          </button>
          
          <div className="flex items-center gap-2">
            <label className="text-text-primary font-medium">To:</label>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as FormatType)}
              className="px-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary focus:outline-none focus:border-primary"
            >
              <option value="json">JSON</option>
              <option value="xml">XML</option>
              <option value="yaml">YAML</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-text-primary font-medium">Input</label>
              <button 
                onClick={() => setInput(sampleJson)} 
                className="text-text-secondary hover:text-text-primary text-sm"
              >
                Sample
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Enter ${inputFormat.toUpperCase()} here...`}
              className="w-full h-64 px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary resize-none font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-text-primary font-medium">Output</label>
              <button onClick={() => { setInput(''); setOutput(''); }} className="text-text-secondary hover:text-text-primary text-sm">
                Clear
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="Converted result will appear here..."
              className="w-full h-64 px-4 py-3 bg-surface-elevated border border-border rounded-xl text-text-primary placeholder-text-secondary resize-none font-mono text-sm"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-center">
            {error}
          </div>
        )}

        {output && (
          <div className="flex justify-center">
            <button
              onClick={copyOutput}
              className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-xl transition-all hover:shadow-glow flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Output
            </button>
          </div>
        )}
      </div>
    </div>
  );
}