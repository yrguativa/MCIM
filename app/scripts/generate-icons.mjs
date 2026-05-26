import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const PUBLIC_DIR = resolve(import.meta.dirname, '../public')
const ICONS_DIR = resolve(PUBLIC_DIR, 'icons')

const svgContent = readFileSync(resolve(ICONS_DIR, 'icon-192.svg'), 'utf-8')

const PAD = 0.12
const SCALE = 1 - 2 * PAD

const paddedSvg = svgContent.replace(
  '<g transform="translate(0,2674) scale(0.1,-0.1)" fill="#f8fafc">',
  `<g transform="translate(${Math.round(2673 * PAD)}, ${Math.round(2674 * PAD)}) scale(${SCALE})">
    <g transform="translate(0,2674) scale(0.1,-0.1)" fill="#f8fafc">`,
).replace(
  '</svg>',
  '  </g>\n</svg>',
)

writeFileSync('/tmp/padded-icon.svg', paddedSvg, 'utf-8')
console.log('Created padded SVG')

async function generate(filename, size) {
  const svgBuffer = readFileSync('/tmp/padded-icon.svg')
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(resolve(ICONS_DIR, filename))
  console.log(`Generated ${filename} (${size}x${size})`)
}

await generate('apple-touch-icon.png', 180)
await generate('icon-192.png', 192)
await generate('icon-512.png', 512)

writeFileSync(resolve(ICONS_DIR, 'icon-192.svg'), paddedSvg, 'utf-8')
writeFileSync(resolve(ICONS_DIR, 'icon-512.svg'), paddedSvg, 'utf-8')
writeFileSync(resolve(PUBLIC_DIR, 'favicon.svg'), paddedSvg, 'utf-8')

console.log('All icons generated successfully!')
