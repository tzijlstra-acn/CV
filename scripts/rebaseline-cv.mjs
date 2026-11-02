#!/usr/bin/env node
/**
 * npm run qa:rebaseline-cv: after an intentional CV change (content.json, cv.html, the PDF, or the
 * CV stylesheet and script), record the new hashes so the boundary tests guard the new state.
 * The pre-rebuild baseline in qa/baseline/legacy-hashes.txt is never rewritten.
 */
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const file = path.join(root, 'qa/baseline/cv-hashes.json')
const current = JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (f) => createHash('sha256').update(fs.readFileSync(path.join(root, f))).digest('hex')
for (const f of ['cv.html', 'assets/Thomas_Zijlstra_CV.pdf', 'styles.css', 'script.js']) current[f] = sha(f)
current.updatedAt = new Date().toISOString().slice(0, 10)
fs.writeFileSync(file, JSON.stringify(current, null, 2) + '\n')
console.log('[qa:rebaseline-cv] recorded', Object.keys(current).filter((k) => !k.startsWith('$') && k !== 'updatedAt').join(', '))
