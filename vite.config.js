const defineConfig = (config) => config;

const removeCrossorigin = () => ({
  name: 'remove-crossorigin-attrs',
  enforce: 'post',
  transformIndexHtml(html) {
    return html.replace(/\s+crossorigin(?:="[^"]*")?/g, '');
  },
});

export default defineConfig({
  plugins: [removeCrossorigin()],
  build: {
    modulePreload: false,
  },
});
