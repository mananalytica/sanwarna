declare const imageLoader: {
  (args: { src: string; width: number; quality?: number }): string;
  srcSet(src: string): string | undefined;
};
export default imageLoader;
