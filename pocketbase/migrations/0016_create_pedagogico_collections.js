migrate(
  (app) => {
    app.save(
      new Collection({
        name: 'pedagogico_niveis',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'nivel', type: 'text', required: true },
          { name: 'ordem', type: 'number', required: true, onlyInt: true },
          { name: 'subniveis', type: 'json' },
          { name: 'tags', type: 'json' },
          { name: 'descricao', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_pedagogico_niveis_ordem ON pedagogico_niveis (ordem)'],
      }),
    )

    app.save(
      new Collection({
        name: 'pedagogico_parcerias',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'titulo', type: 'text', required: true },
          { name: 'descricao', type: 'text' },
          { name: 'ordem', type: 'number', required: true, onlyInt: true },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_pedagogico_parcerias_ordem ON pedagogico_parcerias (ordem)'],
      }),
    )
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('pedagogico_niveis'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('pedagogico_parcerias'))
    } catch (_) {}
  },
)
