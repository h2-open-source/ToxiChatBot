db.createUser({
  user: 'root',
  pwd: 'toxipass',
  roles: [
    {
      role: 'readWrite',
      db: 'toxichatdb',
    },
  ],
});
