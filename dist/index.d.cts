import { Plugin } from 'vite';

interface PluginOptions {
    outputPath?: string;
    includeComposables?: boolean;
}
/**
 * Vue Component Diagram Plugin
 * Analyzes Vue components and generates a component diagram in markdown format
 */
declare function vueComponentDiagram(options?: PluginOptions): Plugin;

export { vueComponentDiagram as default };
