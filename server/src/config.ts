export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  user: process.env.DATABASE_USER,
});
