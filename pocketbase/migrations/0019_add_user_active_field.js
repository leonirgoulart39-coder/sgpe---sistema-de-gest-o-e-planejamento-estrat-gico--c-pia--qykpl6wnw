migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('users')
    if (!col.fields.getByName('ativo')) {
      col.fields.add(new BoolField({ name: 'ativo' }))
      app.save(col)
    }
    const users = app.findRecordsByFilter('users', "email != ''", '', 0, 0)
    for (const u of users) {
      const v = u.get('ativo')
      if (v === null || v === undefined) {
        u.set('ativo', true)
        app.save(u)
      }
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('users')
    const field = col.fields.getByName('ativo')
    if (field) {
      col.fields.remove(field.getId())
      app.save(col)
    }
  },
)
