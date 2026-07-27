migrate(
  (app) => {
    app.save(
      new Collection({
        name: 'modelo_fontes_receita',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'titulo', type: 'text', required: true },
          { name: 'descricao', type: 'text', required: true },
          { name: 'tag_label', type: 'text', required: true },
          { name: 'tag_color', type: 'text' },
          { name: 'bullet_color', type: 'text' },
          { name: 'ordem', type: 'number' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_modelo_fontes_ordem ON modelo_fontes_receita (ordem)'],
      }),
    )
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('modelo_fontes_receita'))
    } catch (_) {}
  },
)
