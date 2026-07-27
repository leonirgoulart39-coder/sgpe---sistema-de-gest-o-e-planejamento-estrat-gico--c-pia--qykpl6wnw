migrate(
  (app) => {
    app.save(
      new Collection({
        name: 'equipe_cargos',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'cargo', type: 'text', required: true },
          { name: 'area', type: 'text' },
          { name: 'qtd', type: 'number', onlyInt: true, min: 0 },
          { name: 'salario', type: 'number', min: 0 },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'encargos_parametros',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'nome', type: 'text', required: true },
          { name: 'percentual', type: 'number', min: 0, max: 100 },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'capex_itens',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          {
            name: 'block',
            type: 'select',
            required: true,
            values: ['obra', 'equipamentos', 'franquia', 'giro'],
            maxSelect: 1,
          },
          { name: 'descricao', type: 'text', required: true },
          { name: 'qtd', type: 'number', onlyInt: true, min: 0 },
          { name: 'custo_unitario', type: 'number', min: 0 },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_capex_itens_block ON capex_itens (block)'],
      }),
    )

    app.save(
      new Collection({
        name: 'capex_parametros',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'contingencia_pct', type: 'number', min: 0, max: 100 },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )
  },
  (app) => {
    ;['equipe_cargos', 'encargos_parametros', 'capex_itens', 'capex_parametros'].forEach(
      function (n) {
        try {
          app.delete(app.findCollectionByNameOrId(n))
        } catch (_) {}
      },
    )
  },
)
