// Repo-shape checks for every surface that installs these skills: the Claude marketplace, the
// Cursor manifest, the Agent Plugins package Hermes installs, the skills CLI, and the skills.sh page.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SKILLS_DIR = 'plugins/mcp/skills';
const MCP_URL = 'https://mcp.aave.com';
const AGENT_PLUGINS_SCHEMAS = 'https://agent-plugins.org/schemas/1.0.0';
const errors = [];
const fail = (m) => errors.push(m);

const json = (p) => {
  try {
    return JSON.parse(readFileSync(p, 'utf8'));
  } catch (e) {
    fail(`${p}: ${e.message}`);
    return null;
  }
};

for (const p of [
  '.claude-plugin/marketplace.json',
  '.cursor-plugin/marketplace.json',
  'plugins/mcp/.claude-plugin/plugin.json',
  'plugins/mcp/.cursor-plugin/plugin.json',
  'plugins/mcp/plugin.json',
  'plugins/mcp/mcp.json',
  'plugins/mcp/.mcp.json',
  'skills.sh.json',
]) {
  if (!existsSync(p)) fail(`${p}: missing`);
  else json(p);
}

// .mcp.json is the Claude and Cursor shape; mcp.json is the Agent Plugins shape, which names the
// transport differently and carries a $schema. Both must reach the same server.
const claudeMcp = json('plugins/mcp/.mcp.json');
if (claudeMcp && claudeMcp.mcpServers?.aave?.url !== MCP_URL) {
  fail(`plugins/mcp/.mcp.json does not point at ${MCP_URL}`);
}
const portableMcp = json('plugins/mcp/mcp.json');
if (portableMcp) {
  if (portableMcp.$schema !== `${AGENT_PLUGINS_SCHEMAS}/mcp.schema.json`) {
    fail('plugins/mcp/mcp.json: $schema is not Agent Plugins 1.0.0');
  }
  const aave = portableMcp.mcpServers?.aave;
  if (aave?.type !== 'streamable-http' || aave?.url !== MCP_URL) {
    fail(`plugins/mcp/mcp.json: aave must be streamable-http at ${MCP_URL}`);
  }
}
const portable = json('plugins/mcp/plugin.json');
if (portable && portable.$schema !== `${AGENT_PLUGINS_SCHEMAS}/plugin.schema.json`) {
  fail('plugins/mcp/plugin.json: $schema is not Agent Plugins 1.0.0');
}
// The cursor-agent CLI has been reported to drop a config holding a streamable-http entry.
const cursor = json('plugins/mcp/.cursor-plugin/plugin.json');
if (cursor && cursor.mcpServers !== './.mcp.json') {
  fail('plugins/mcp/.cursor-plugin/plugin.json: mcpServers must stay ./.mcp.json');
}

const names = new Set();
for (const dir of readdirSync(SKILLS_DIR)) {
  const p = join(SKILLS_DIR, dir, 'SKILL.md');
  if (!existsSync(p)) {
    fail(`${dir}: no SKILL.md`);
    continue;
  }
  const src = readFileSync(p, 'utf8');
  const fm = src.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) {
    fail(`${p}: no frontmatter`);
    continue;
  }
  const name = fm[1].match(/^name:\s*(.+)$/m)?.[1].trim();
  const desc = fm[1].match(/^description:\s*(.+)$/m)?.[1].trim();
  if (!name) fail(`${p}: frontmatter has no name`);
  if (!desc) fail(`${p}: frontmatter has no description`);
  if (name && name !== dir) fail(`${p}: name "${name}" does not match directory "${dir}"`);
  if (name) names.add(name);

  // A skill installed by `npx skills add` arrives without the MCP server, so each one
  // has to say where its tools come from.
  if (!src.includes(MCP_URL)) fail(`${p}: does not tell the reader to add ${MCP_URL}`);
}

const sh = json('skills.sh.json');
for (const g of sh?.groupings ?? []) {
  for (const s of g.skills ?? []) {
    if (!names.has(s)) fail(`skills.sh.json: group "${g.title}" lists unknown skill "${s}"`);
  }
}

const listed = new Set((sh?.groupings ?? []).flatMap((g) => g.skills ?? []));
for (const n of names) {
  if (!listed.has(n)) fail(`skills.sh.json: skill "${n}" is in no group`);
}

if (errors.length) {
  console.error(errors.map((e) => `  ${e}`).join('\n'));
  process.exit(1);
}
console.log(`ok: ${names.size} skills, every manifest parses`);
