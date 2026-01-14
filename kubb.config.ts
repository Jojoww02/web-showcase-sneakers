import { defineConfig } from '@kubb/core';
import { pluginOas } from '@kubb/plugin-oas';
import { pluginTs } from '@kubb/plugin-ts';
import { pluginReactQuery } from '@kubb/plugin-react-query';
import { loadEnv } from 'vite';

export default defineConfig(() => {
  const env = loadEnv('kubb', process.cwd(), '');
  const SwaggerUrls = {
    sneakverse: env.AUTH_SWAGGER_URL,
  };

  const results = Object.entries(SwaggerUrls)
    .filter(([_, value]) => !!value)
    .map(([key, value]) => {
      const url = value;

      const extraConfig: Record<string, any> = {
        sneakverse: {
          client: {
            importPath: '@/config/sneakverseInstance',
          },
        },
      };

      return {
        root: '.',
        input: {
          path: url,
        },
        output: {
          path: `./src/gen/${key}`,
          clean: true,
        },
        plugins: [
          pluginOas(),
          pluginTs({
            output: {
              path: 'models',
            },
          }),
          pluginReactQuery({
            output: {
              path: 'hooks',
            },
            client: {
              importPath: '@/lib/axios',
              dataReturnType: 'data',
            },
            ...extraConfig[key],
          }),
        ],
      };
    });

  return results;
});