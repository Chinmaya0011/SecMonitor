const fs = require("fs");

// Recursive function to traverse routers
function getRoutes(router, prefix = "") {
  const routes = [];
  if (!router.stack) return routes;

  router.stack.forEach((middleware) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).map(m => m.toUpperCase());
      routes.push({ path: prefix + middleware.route.path, methods });
    } else if (middleware.name === "router" && middleware.handle.stack) {
      let nestedPrefix = "";
      if (middleware.regexp && middleware.regexp.source) {
        nestedPrefix = middleware.regexp.source
          .replace("^\\", "")
          .replace("\\/?(?=\\/|$)", "")
          .replace(/\\\//g, "/");
        if (nestedPrefix.endsWith("$")) nestedPrefix = nestedPrefix.slice(0, -1);
      }
      routes.push(...getRoutes(middleware.handle, prefix + "/" + nestedPrefix));
    }
  });

  return routes;
}

// Import app
const app = require("../app"); // <- make sure this path is correct

if (!app._router) {
  console.error("No router detected in app. Make sure routes are registered.");
  process.exit(1);
}

const allRoutes = getRoutes(app._router);

let mdContent = "# API Documentation\n\n";

allRoutes.forEach((ep) => {
  ep.methods.forEach((method) => {
    mdContent += `## ${method} ${ep.path}\n\n`;
    mdContent += `**Query Params:** \n- None detected\n`;
    mdContent += `**Body Params:** \n- None detected\n`;
    mdContent += `**Description:** \n- Add description here\n\n---\n\n`;
  });
});

fs.writeFileSync("API_DOCUMENTATION.md", mdContent);
console.log("API documentation generated: API_DOCUMENTATION.md");