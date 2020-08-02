export const Config = {
    'api_url': process.env.NODE_ENV === 'production' 
        ? '.'
        : 'http://localhost:5000',
}
