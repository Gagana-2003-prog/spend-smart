import('./app.js').catch(err => {
  console.error('Failed to start app:', err);
  process.exit(1);
});
