declare module 'react-gtm-module' {
  interface TagManagerArgs {
    gtmId: string;
    events?: Record<string, string>;
    dataLayer?: Record<string, unknown>[];
    dataLayerName?: string;
    auth?: string;
    preview?: string;
  }

  const TagManager: {
    initialize: (args: TagManagerArgs) => void;
    dataLayer: (args: { dataLayer: Record<string, unknown> }) => void;
  };

  export default TagManager;
}
