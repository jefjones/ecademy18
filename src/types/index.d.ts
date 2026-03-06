/**
 * src/types/index.d.ts
 *
 * Global ambient module declarations for assets and legacy packages
 * that don't ship their own TypeScript types.
 *
 * As individual files are migrated to .ts / .tsx these declarations
 * ensure the TypeScript compiler doesn't error on common imports.
 */

// ── CSS Modules ────────────────────────────────────────────────────────
declare module '*.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// ── Static assets ──────────────────────────────────────────────────────
declare module '*.png' {
  const src: string;
  export default src;
}
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.jpeg' {
  const src: string;
  export default src;
}
declare module '*.gif' {
  const src: string;
  export default src;
}
declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*.mp3' {
  const src: string;
  export default src;
}

// ── Legacy / untyped packages ──────────────────────────────────────────
declare module 'react-hint' {
  const ReactHintFactory: (React: any) => any;
  export default ReactHintFactory;
}

declare module 'classnames' {
  function classes(...args: any[]): string;
  export default classes;
}

declare module 'react-datetime' {
  import { ComponentType } from 'react';
  const DateTime: ComponentType<any>;
  export default DateTime;
}

declare module 'react-big-calendar' {
  export const Calendar: any;
  export const momentLocalizer: any;
  export const dateFnsLocalizer: any;
  export const Views: any;
}

declare module 'react-sketch' {
  const SketchField: any;
  export { SketchField };
}

declare module 'react-idle' {
  const Idle: any;
  export default Idle;
}

declare module 'react-media-queryable' {
  const MediaQueryable: any;
  export default MediaQueryable;
}

declare module 'react-recaptcha' {
  import { ComponentType } from 'react';
  const Recaptcha: ComponentType<any>;
  export default Recaptcha;
}

declare module 'react-modal-dialog' {
  export const ModalContainer: any;
  export const ModalDialog: any;
}

declare module 'react-svg-gauge' {
  const Gauge: any;
  export default Gauge;
}

declare module 'react-tap-or-click' {
  const tapOrClick: (...args: any[]) => any;
  export default tapOrClick;
}

declare module 'react-tooltip-controller' {
  const TooltipController: any;
  export { TooltipController };
}

declare module 'react-dnd-scrollzone' {
  const withScrolling: any;
  export default withScrolling;
}

declare module 'redux-oidc' {
  export const OidcProvider: any;
  export const processSilentRenew: any;
  export const loadUser: any;
  export const createUserManager: any;
}

declare module 'react-data-export' {
  export const ExcelFile: any;
  export const ExcelSheet: any;
  export const ExcelColumn: any;
}

declare module 'tempa-xlsx' {
  const tempaXlsx: any;
  export default tempaXlsx;
}

declare module 'react-sortable-tree-tristandb' {
  const SortableTree: any;
  export default SortableTree;
}

declare module 'react-sortable-tree-theme-file-explorer' {
  const FileExplorerTheme: any;
  export default FileExplorerTheme;
}

declare module 'mic-recorder-to-mp3' {
  export default class MicRecorder {
    constructor(options?: any);
    start(): Promise<void>;
    stop(): { getMp3: () => Promise<[any, Blob]> };
  }
}

declare module 'string-hash' {
  function stringHash(str: string): number;
  export default stringHash;
}

declare module 'join-classnames' {
  function joinClassnames(...args: any[]): string;
  export default joinClassnames;
}

declare module 'buttercms' {
  function Butter(apiKey: string): any;
  export default Butter;
}

declare module 'google-maps-react' {
  export const Map: any;
  export const GoogleApiWrapper: any;
  export const Marker: any;
}

declare module 'fuzzy-match-utils' {
  export function score(query: string, target: string): number;
}

// ── Window augmentation ────────────────────────────────────────────────
interface Window {
  __INITIAL_STATE__?: Record<string, unknown>;
  devToolsExtension?: () => (enhancer: any) => any;
}
