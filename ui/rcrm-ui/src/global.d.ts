// global.d.ts
interface Window {
  PressureObserver: any;
}
declare var heap: {
  identify: (userId: string) => void;
  // Add other Heap methods here if needed
};

declare module "*.svg" {
  import { ReactComponent as ReactSVGComponent } from "react";
  const ReactComponent: ReactSVGComponent;
  export { ReactComponent };
}
