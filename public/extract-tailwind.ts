import { writeFileSync } from 'fs';

export default function extractTailwind() {
  return {
    name: 'extract-tailwind',
    apply: 'build',
    generateBundle(_, bundle) {
      for (const file in bundle) {
        if (file.endsWith('.css')) {
          const css = bundle[file].source as string;
          writeFileSync('public/tailwind.css', css);
        }
      }
    },
  };
}