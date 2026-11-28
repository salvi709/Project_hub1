import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Code2,
  Compass,
  Cpu,
  Layers,
  Palette,
  Sparkles,
  Workflow,
} from 'lucide-react';

export type PastelTone = 'lavender' | 'sky' | 'peach' | 'mint';

export interface ProjectVisualTheme {
  tone: PastelTone;
  softBg: string;
  inkColor: string;
  barColor: string;
  surfaceTint: string;
  Icon: LucideIcon;
}

const TONE_MAP: Record<PastelTone, Omit<ProjectVisualTheme, 'tone' | 'Icon'>> = {
  lavender: {
    softBg: '#EEE8FF',
    inkColor: '#6545C4',
    barColor: '#9272E8',
    surfaceTint: '#FAF8FF',
  },
  sky: {
    softBg: '#E2F0FF',
    inkColor: '#2A67A8',
    barColor: '#4D8CE8',
    surfaceTint: '#F5FAFF',
  },
  peach: {
    softBg: '#FFE8DC',
    inkColor: '#B35A30',
    barColor: '#E58A5E',
    surfaceTint: '#FFF9F5',
  },
  mint: {
    softBg: '#DDF5E9',
    inkColor: '#277554',
    barColor: '#46A77C',
    surfaceTint: '#F4FCF8',
  },
};

const TONES: PastelTone[] = ['lavender', 'sky', 'peach', 'mint'];

export function getProjectVisual(
  category: string,
  id: string
): ProjectVisualTheme {
  const lower = category.toLowerCase();
  let tone: PastelTone | null = null;
  let Icon: LucideIcon = Layers;

  if (lower.includes('design') || lower.includes('ui') || lower.includes('brand')) {
    tone = 'peach';
    Icon = Palette;
  } else if (lower.includes('backend') || lower.includes('api') || lower.includes('infra')) {
    tone = 'sky';
    Icon = Cpu;
  } else if (lower.includes('web') || lower.includes('app') || lower.includes('mobile')) {
    tone = 'lavender';
    Icon = Code2;
  } else if (lower.includes('auto') || lower.includes('data') || lower.includes('sync')) {
    tone = 'mint';
    Icon = Workflow;
  } else if (lower.includes('doc') || lower.includes('note') || lower.includes('research')) {
    tone = 'sky';
    Icon = BookOpen;
  } else if (lower.includes('product') || lower.includes('launch')) {
    tone = 'peach';
    Icon = Compass;
  }

  if (!tone) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash * 31 + id.charCodeAt(i)) | 0;
    }
    tone = TONES[Math.abs(hash) % TONES.length];
    Icon = Sparkles;
  }

  return {
    tone,
    Icon,
    ...TONE_MAP[tone],
  };
}
