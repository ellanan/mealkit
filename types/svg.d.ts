declare module "*.svg" {
  import React = require("react");
  const src: React.PropsWithChildren<React.SVGProps<SVGSVGElement>>;
  export default src;
}
