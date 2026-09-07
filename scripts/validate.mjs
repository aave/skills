// Repo-shape checks for every surface that installs these skills:
// the Claude marketplace, the Cursor manifest, the skills CLI, and the skills.sh repo page.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SKILLS_DIR = 'plugins/mcp/skills';
const MCP_URL = 'https://mcp.aave.com';
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
  'plugins/mcp/mcp.json',
  'plugins/mcp/.mcp.json',
  'skills.sh.json',
]) {
  if (!existsSync(p)) fail(`${p}: missing`);
  else json(p);
}

// The two MCP configs are read by different clients and must not drift apart.
const a = json('plugins/mcp/mcp.json');
const b = json('plugins/mcp/.mcp.json');
if (a && b && JSON.stringify(a) !== JSON.stringify(b)) {
  fail('plugins/mcp/mcp.json and plugins/mcp/.mcp.json disagree');
}
if (a && a.mcpServers?.aave?.url !== MCP_URL) {
  fail(`plugins/mcp/mcp.json does not point at ${MCP_URL}`);
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
