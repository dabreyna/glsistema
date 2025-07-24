/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: '',
    trailingSlash: true,
    redirects: async () => [
        {
            source: '/',
            destination: '/web',
            permanent: true,
        },
        {
            source: '/sistema',
            destination: '/private/login/',
            permanent: true,
        },
        // {
        //     source: '/api',
        //     destination: '/api/apis/buscarCliente/',
        //     permanent: true,
        // }
    ],
    // Ruta a la carpeta api
    // assetPrefix: '/api',
     transpilePackages: ['@react-pdf/renderer'], 
};

export default nextConfig;
