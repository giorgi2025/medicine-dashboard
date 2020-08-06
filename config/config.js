module.exports = {
    email: "YOUR_EMAIL",
    password: "YOUR_PASSWORD",
    salt: "SALT_VALUE(16byte)",
    secretKey: "secretKey",
    fileUploadedSubPath: process.env.NODE_ENV === 'production' ? "build" : "public",
}