import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const scriptPath = 'scripts/check-m0-web-legal.mjs'

test('m0 web legal gate passes for current repository', () => {
  const result = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: 'utf8',
  })
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /M0 web legal gate passed/)
})
