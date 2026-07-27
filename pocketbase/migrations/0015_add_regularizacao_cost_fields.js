migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('regularizacao_etapas')

    if (!col.fields.getByName('custo_previsto')) {
      col.fields.add(new NumberField({ name: 'custo_previsto' }))
    }

    if (!col.fields.getByName('mes_execucao')) {
      col.fields.add(new TextField({ name: 'mes_execucao' }))
    }

    app.save(col)
  },
  (app) => {
    var col = app.findCollectionByNameOrId('regularizacao_etapas')
    if (col.fields.getByName('custo_previsto')) {
      col.fields.removeByName('custo_previsto')
    }
    if (col.fields.getByName('mes_execucao')) {
      col.fields.removeByName('mes_execucao')
    }
    app.save(col)
  },
)
