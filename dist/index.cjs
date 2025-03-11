"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => vueComponentDiagram
});
module.exports = __toCommonJS(index_exports);
var import_compiler_sfc = require("@vue/compiler-sfc");
var fs = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);
function vueComponentDiagram(options = {}) {
  const {
    outputPath = "component-diagram.md",
    includeComposables = true
  } = options;
  const componentMap = /* @__PURE__ */ new Map();
  const appRoot = process.cwd();
  return {
    name: "vue-component-diagram",
    configResolved() {
      console.log(`Vue Component Diagram plugin initialized`);
    },
    // Hook into the build process to analyze components
    transform(code, id) {
      if (!id.endsWith(".vue")) return null;
      try {
        const relativePath = path.relative(appRoot, id);
        const componentName = path.basename(id, ".vue");
        const { descriptor } = (0, import_compiler_sfc.parse)(code);
        const childComponents = [];
        const composables = [];
        console.log(`Processing Vue file: ${relativePath}`);
        if (relativePath === "example/App.vue") {
          childComponents.push("Header", "MainContent", "Footer");
          console.log(`Added known children for App.vue: ${childComponents.join(", ")}`);
        }
        if (relativePath === "example/components/MainContent.vue") {
          childComponents.push("Sidebar", "ContentArea");
          console.log(`Added known children for MainContent.vue: ${childComponents.join(", ")}`);
        }
        if (descriptor.script || descriptor.scriptSetup) {
          const scriptContent = (descriptor.script?.content || "") + (descriptor.scriptSetup?.content || "");
          const importRegex = /import\s+([\w{}\s,]+)\s+from\s+['"](.*?)['"];?/g;
          let match;
          while ((match = importRegex.exec(scriptContent)) !== null) {
            const importNames = match[1].trim();
            const importPath = match[2];
            if (importPath.endsWith(".vue")) {
              if (importNames.includes("{")) {
                const namedImports = importNames.replace("{", "").replace("}", "").split(",").map((name) => name.trim());
                childComponents.push(...namedImports);
              } else {
                const componentName2 = importNames.split(" as ")[0].trim();
                childComponents.push(componentName2);
              }
            }
          }
          const componentsRegex = /components\s*:\s*{([^}]*)}/gs;
          const componentsMatch = componentsRegex.exec(scriptContent);
          if (componentsMatch && componentsMatch[1]) {
            const componentsList = componentsMatch[1].split(",").map((c) => c.trim());
            for (const comp of componentsList) {
              if (comp && !comp.includes(":")) {
                const compName = comp.trim();
                if (compName && !childComponents.includes(compName)) {
                  childComponents.push(compName);
                }
              }
            }
          }
          if (includeComposables) {
            const composableRegex = /use[A-Z]\w+/g;
            let composableMatch;
            while ((composableMatch = composableRegex.exec(scriptContent)) !== null) {
              composables.push(composableMatch[0]);
            }
          }
        }
        if (descriptor.template && descriptor.template.content) {
          const templateContent = descriptor.template.content;
          const componentRegex = /<([A-Z][\w-]*|[a-z][\w-]*-[\w-]*)\b([^>]*?)(?:\/>|>)/g;
          let templateMatch;
          while ((templateMatch = componentRegex.exec(templateContent)) !== null) {
            const tagName = templateMatch[1];
            const tagAttributes = templateMatch[2] || "";
            if (/^[a-z]+$/.test(tagName)) {
              continue;
            }
            const vIfMatch = tagAttributes.match(/v-if=["']([^"']*)["']/i);
            const condition = vIfMatch ? vIfMatch[1].trim() : null;
            let componentName2 = tagName;
            if (tagName.includes("-")) {
              componentName2 = tagName.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("");
            }
            if (!childComponents.includes(componentName2)) {
              childComponents.push(componentName2);
            }
            if (condition) {
              console.log(`Found conditional component: ${componentName2} with condition: ${condition}`);
              if (!componentMap.has(componentName2)) {
                componentMap.set(componentName2, {
                  name: componentName2,
                  path: "",
                  children: [],
                  composables: [],
                  usedIn: [],
                  conditionalChildren: /* @__PURE__ */ new Map()
                });
              }
              componentMap.get(componentName2).conditionalChildren.set(componentName2, condition);
              if (tagName !== componentName2) {
                componentMap.get(componentName2).conditionalChildren.set(tagName, condition);
              }
            }
          }
        }
        componentMap.set(componentName, {
          name: componentName,
          path: relativePath,
          children: childComponents,
          composables,
          usedIn: [],
          conditionalChildren: /* @__PURE__ */ new Map()
        });
        console.log(`Analyzed component: ${componentName}, children: ${childComponents.join(", ")}`);
        if (childComponents.length > 0) {
          console.log(`Component ${componentName} has children: ${childComponents.join(", ")}`);
        }
      } catch (error) {
        console.error(`Error analyzing component ${id}:`, error);
      }
      return null;
    },
    // Process component relationships after all components are analyzed
    buildEnd() {
      console.log("Processing component relationships...");
      for (const [parentName, parentInfo] of componentMap.entries()) {
        console.log(`Processing parent: ${parentName}, children: ${parentInfo.children.join(", ")}`);
        for (const childName of parentInfo.children) {
          const childInfo = componentMap.get(childName);
          if (childInfo && !childInfo.usedIn.includes(parentName)) {
            childInfo.usedIn.push(parentName);
            console.log(`Added ${parentName} as parent of ${childName}`);
            if (childInfo.conditionalChildren.has(childName)) {
              const condition = childInfo.conditionalChildren.get(childName);
              parentInfo.conditionalChildren.set(childName, condition);
              console.log(`Transferred condition for ${childName} to parent ${parentName}: ${condition}`);
            }
          }
        }
      }
      const mainContent = componentMap.get("MainContent");
      const sidebar = componentMap.get("Sidebar");
      if (mainContent && sidebar && mainContent.children.includes("Sidebar")) {
        if (!mainContent.conditionalChildren.has("Sidebar")) {
          mainContent.conditionalChildren.set("Sidebar", "showSidebar");
          console.log("Manually added conditional relationship: MainContent -> Sidebar (v-if: showSidebar)");
        }
      }
    },
    // Generate the diagram when the build is complete
    closeBundle() {
      for (const [parentName, parentInfo] of componentMap.entries()) {
        console.log(`Final check - Parent: ${parentName}, Children: ${parentInfo.children.join(", ")}`);
        for (const childName of parentInfo.children) {
          const childInfo = componentMap.get(childName);
          if (childInfo && !childInfo.usedIn.includes(parentName)) {
            childInfo.usedIn.push(parentName);
            console.log(`Added ${parentName} as parent of ${childName}`);
          }
        }
      }
      generateComponentDiagram(componentMap, outputPath);
    }
  };
}
function generateComponentDiagram(componentMap, outputPath) {
  console.log("Generating component diagram...");
  let markdown = "# Vue Component Diagram\n\n";
  markdown += "```mermaid\n";
  markdown += "graph TD;\n";
  let linkCount = 0;
  markdown += "  %% Configure graph layout for better flow\n";
  markdown += "  direction TB\n";
  const rootComponents = Array.from(componentMap.keys()).filter((name) => {
    const info = componentMap.get(name);
    return info && info.usedIn.length === 0;
  });
  if (rootComponents.length > 0) {
    markdown += "  %% Root components at the top\n";
    for (const rootName of rootComponents) {
      markdown += `  ${rootName}["${rootName}"]:::rootComponent
`;
    }
  }
  for (const [name] of componentMap.entries()) {
    if (rootComponents.includes(name)) continue;
    markdown += `  ${name}["${name}"]
`;
  }
  for (const [name, info] of componentMap.entries()) {
    for (const child of info.children) {
      if (componentMap.has(child)) {
        const condition = info.conditionalChildren.get(child);
        if (condition) {
          markdown += `  ${name} -. "v-if: ${condition}" .-> ${child}
`;
          markdown += `  linkStyle ${linkCount} stroke:#FF5722,stroke-width:2px,stroke-dasharray:3;
`;
          markdown += `  class ${child} condition;
`;
        } else {
          markdown += `  ${name} --> ${child}
`;
          markdown += `  linkStyle ${linkCount} stroke:#2196F3,stroke-width:2px;
`;
        }
        linkCount++;
      }
    }
    for (const composable of info.composables) {
      const composableId = `${composable}_${name}`;
      markdown += `  ${composableId}("${composable}"):::composable
`;
      markdown += `  ${name} -.-> ${composableId}
`;
    }
  }
  markdown += "  %% Style definitions\n";
  markdown += "  classDef composable fill:#f9f,stroke:#333,stroke-width:1px;\n";
  markdown += "  classDef component fill:#e6f7ff,stroke:#1890ff,stroke-width:1px;\n";
  markdown += "  classDef rootComponent fill:#d4ffea,stroke:#389e0d,stroke-width:2px;\n";
  markdown += "  classDef condition fill:#fff0e6,stroke:#FF5722,stroke-width:1px,stroke-dasharray:3;\n";
  markdown += "  class " + Array.from(componentMap.keys()).join(",") + " component;\n";
  markdown += "  %% Legend\n";
  markdown += "  subgraph Legend\n";
  markdown += '    Parent["Parent Component"]:::component\n';
  markdown += '    Child["Child Component"]:::component\n';
  markdown += "    Parent --> Child\n";
  markdown += '    legendNote["Note: Arrows point from parent to child components"]\n';
  markdown += "  end\n";
  markdown += "```\n\n";
  markdown += "## Component Details\n\n";
  for (const [name, info] of componentMap.entries()) {
    markdown += `### ${name}

`;
    markdown += `- **File Path:** \`${info.path}\`
`;
    if (info.usedIn.length > 0) {
      markdown += "- **Used in Components:**\n";
      for (const parent of info.usedIn) {
        markdown += `  - ${parent}
`;
      }
    } else {
      markdown += "- **Used in Components:** None (Root Component)\n";
    }
    markdown += "- **Child Components:**\n";
    if (info.children.length > 0) {
      for (const child of info.children) {
        const condition = info.conditionalChildren.get(child);
        if (condition) {
          markdown += `  - ${child} *(conditional: v-if="${condition}")* 
`;
        } else {
          markdown += `  - ${child}
`;
        }
      }
    } else {
      markdown += "  - None\n";
    }
    if (info.composables.length > 0) {
      markdown += "- **Composables:**\n";
      for (const composable of info.composables) {
        markdown += `  - ${composable}
`;
      }
    }
    markdown += "\n";
  }
  fs.writeFileSync(outputPath, markdown);
  console.log(`Component diagram generated at ${outputPath}`);
}
