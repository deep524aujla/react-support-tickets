import fs from 'node:fs';
import path from 'node:path';
import { parse } from '@babel/parser';
import _generate from '@babel/generator';

const generate = _generate.default ?? _generate;

const srcRoot = path.resolve('src');

function walkDir(dir, list = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) {
      walkDir(full, list);
    } else if (name.endsWith('.jsx')) {
      list.push(full);
    }
  }
  return list;
}

function exprToJsx(expr, multiline = false) {
  if (!expr) {
    return '';
  }
  if (expr.type === 'StringLiteral') {
    return expr.value;
  }
  if (expr.type === 'NumericLiteral') {
    return `{${expr.value}}`;
  }
  if (expr.type === 'BooleanLiteral') {
    return expr.value ? '={true}' : '={false}';
  }
  if (expr.type === 'NullLiteral') {
    return '{null}';
  }
  if (expr.type === 'Identifier') {
    return `{${expr.name}}`;
  }
  if (expr.type === 'MemberExpression' || expr.type === 'CallExpression' || expr.type === 'ConditionalExpression' || expr.type === 'LogicalExpression' || expr.type === 'BinaryExpression' || expr.type === 'UnaryExpression' || expr.type === 'OptionalMemberExpression' || expr.type === 'OptionalCallExpression' || expr.type === 'ArrowFunctionExpression' || expr.type === 'TemplateLiteral' || expr.type === 'ObjectExpression' || expr.type === 'ArrayExpression') {
    return `{${generate(expr).code}}`;
  }
  if (expr.type === 'JSXElement' || expr.type === 'JSXFragment') {
    return generate(expr).code;
  }
  return `{${generate(expr).code}}`;
}

function propsToAttrs(props) {
  if (!props || props.type !== 'ObjectExpression') {
    return '';
  }
  let attrs = '';
  let childrenExpr = null;
  for (const prop of props.properties) {
    if (prop.type === 'SpreadElement') {
      attrs += `{...${generate(prop.argument).code}} `;
      continue;
    }
    const key = prop.key.name ?? prop.key.value;
    if (key === 'children') {
      childrenExpr = prop.value;
      continue;
    }
    const val = prop.value;
    if (val.type === 'StringLiteral') {
      attrs += `${key}="${val.value}" `;
    } else if (val.type === 'BooleanLiteral' && val.value === true) {
      attrs += `${key} `;
    } else {
      attrs += `${key}={${generate(val).code}} `;
    }
  }
  return { attrs: attrs.trim(), childrenExpr };
}

function callToJsx(call) {
  const callee = call.callee;
  const name = callee.name;
  const tagArg = call.arguments[0];
  const propsArg = call.arguments[1];

  if (name === 'jsx' || name === 'jsxs') {
    let tag;
    if (tagArg.type === 'StringLiteral') {
      tag = tagArg.value;
    } else {
      tag = generate(tagArg).code;
    }
    const { attrs, childrenExpr } = propsToAttrs(propsArg);
    const isComponent = tagArg.type !== 'StringLiteral';
    const open = isComponent ? `<${tag}${attrs ? ' ' + attrs : ''}>` : `<${tag}${attrs ? ' ' + attrs : ''}>`;
    const close = isComponent ? `</${tag}>` : `</${tag}>`;

    if (!childrenExpr) {
      return `${open}${close}`;
    }
    if (name === 'jsx') {
      const child = exprToJsx(childrenExpr, true);
      if (child.startsWith('{') && !childrenExpr.type?.includes?.('JSX')) {
        return `${open}${child}${close}`;
      }
      return `${open}${child}${close}`;
    }
    if (childrenExpr.type === 'ArrayExpression') {
      const parts = childrenExpr.elements
        .filter(Boolean)
        .map((el) => {
          if (el.type === 'CallExpression') {
            return callToJsx(el);
          }
          return exprToJsx(el);
        })
        .join('');
      return `${open}${parts}${close}`;
    }
    if (childrenExpr.type === 'CallExpression') {
      return `${open}${callToJsx(childrenExpr)}${close}`;
    }
    return `${open}${exprToJsx(childrenExpr)}${close}`;
  }
  if (name === 'Fragment') {
    const props = propsArg;
    const childrenExpr = props?.properties?.find((p) => p.key?.name === 'children')?.value;
    if (childrenExpr?.type === 'ArrayExpression') {
      const parts = childrenExpr.elements.filter(Boolean).map((el) => (el.type === 'CallExpression' ? callToJsx(el) : exprToJsx(el))).join('');
      return `<>{${parts}}</>`;
    }
  }
  return generate(call).code;
}

function transformSource(code) {
  if (!code.includes('react/jsx-runtime')) {
    return code;
  }
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  });

  const pureComments = [];
  for (const comment of ast.comments ?? []) {
    if (comment.value.includes('@__PURE__')) {
      pureComments.push(comment);
    }
  }

  let output = code.replace(/\/\*\s*@__PURE__\s*\*\//g, '');

  const callReplacements = [];
  function visit(node) {
    if (!node || typeof node !== 'object') {
      return;
    }
    if (node.type === 'CallExpression') {
      const n = node.callee?.name;
      if (n === 'jsx' || n === 'jsxs') {
        const start = node.start;
        const end = node.end;
        const jsxStr = callToJsx(node);
        callReplacements.push({ start, end, jsxStr });
      }
    }
    for (const key of Object.keys(node)) {
      const child = node[key];
      if (Array.isArray(child)) {
        child.forEach(visit);
      } else if (child && typeof child.type === 'string') {
        visit(child);
      }
    }
  }
  visit(ast);

  callReplacements.sort((a, b) => b.start - a.start);
  for (const rep of callReplacements) {
    output = output.slice(0, rep.start) + rep.jsxStr + output.slice(rep.end);
  }

  output = output.replace(/^import\s+\{[^}]*\}\s+from\s+["']react\/jsx-runtime["'];\s*\n?/m, '');
  output = output.replace(/^import\s+\{\s*Fragment,\s*jsx,\s*jsxs\s*\}\s+from\s+["']react\/jsx-runtime["'];\s*\n?/m, '');
  output = output.replace(/^import\s+\{\s*jsx,\s*jsxs\s*\}\s+from\s+["']react\/jsx-runtime["'];\s*\n?/m, '');
  output = output.replace(/^import\s+\{\s*Fragment,\s*jsx\s*\}\s+from\s+["']react\/jsx-runtime["'];\s*\n?/m, '');
  output = output.replace(/\(\/\*\s*@__PURE__\s*\*\/\s*new Date\(\)\)/g, 'new Date()');
  output = output.replace(/export\s+\{\s*(\w+)\s*\};\s*$/m, 'export { $1 };');

  if (output.includes('Fragment') && !output.includes("from 'react'") && !output.includes('from "react"')) {
    output = `import { Fragment } from 'react';\n${output}`;
  }

  return output;
}

const files = walkDir(srcRoot);
for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  if (!code.includes('react/jsx-runtime')) {
    continue;
  }
  try {
    const next = transformSource(code);
    fs.writeFileSync(file, next);
    console.log('ok', path.relative(srcRoot, file));
  } catch (error) {
    console.error('fail', file, error.message);
  }
}
