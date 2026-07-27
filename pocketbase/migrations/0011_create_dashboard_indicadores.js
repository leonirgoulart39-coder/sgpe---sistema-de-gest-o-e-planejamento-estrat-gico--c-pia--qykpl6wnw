migrate(
  (app) => {
    app.save(
      new Collection({
        name: 'dashboard_indicadores',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'nome', type: 'text', required: true },
          { name: 'valor', type: 'number' },
          {
            name: 'formato',
            type: 'select',
            required: true,
            values: ['numero', 'moeda', 'percentual', 'meses'],
            maxSelect: 1,
          },
          {
            name: 'categoria',
            type: 'select',
            required: true,
            values: ['widget', 'tabela'],
            maxSelect: 1,
          },
          { name: 'ordem', type: 'number', required: true, onlyInt: true },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_dashboard_indicadores_ordem ON dashboard_indicadores (ordem)'],
      }),
    )
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('dashboard_indicadores'))
    } catch (_) {}
  },
)
