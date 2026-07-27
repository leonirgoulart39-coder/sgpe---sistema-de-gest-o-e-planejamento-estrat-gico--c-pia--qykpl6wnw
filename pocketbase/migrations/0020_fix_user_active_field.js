migrate(
  (app) => {
    var users = app.findRecordsByFilter('users', "email != ''", '', 0, 0)
    for (var i = 0; i < users.length; i++) {
      var u = users[i]
      var v = u.get('ativo')
      if (!v) {
        u.set('ativo', true)
        app.save(u)
      }
    }
  },
  (app) => {
    var users = app.findRecordsByFilter('users', "email != ''", '', 0, 0)
    for (var i = 0; i < users.length; i++) {
      var u = users[i]
      u.set('ativo', true)
      app.save(u)
    }
  },
)
