export const Config = {
    'api_url': process.env.NODE_ENV === 'production' 
        ? 'http://brand124.herokuapp.com'
        : 'http://localhost:5000',
}
