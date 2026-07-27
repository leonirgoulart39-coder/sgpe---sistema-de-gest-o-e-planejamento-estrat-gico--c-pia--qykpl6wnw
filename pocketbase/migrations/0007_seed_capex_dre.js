migrate(
  (app) => {
    var capexData = [
      ['obra', 'Reforma estrutura física', 1, 180000],
      ['obra', 'Pintura interna e externa', 1, 45000],
      ['obra', 'Instalação elétrica', 1, 35000],
      ['obra', 'Instalação hidráulica', 1, 25000],
      ['obra', 'Pisos e revestimentos', 1, 40000],
      ['obra', 'Forro e teto', 1, 20000],
      ['obra', 'Esquadrias e janelas', 1, 30000],
      ['obra', 'Climatização (ar condicionado)', 8, 3500],
      ['obra', 'Segurança e CFTV', 1, 15000],
      ['obra', 'Rede e infraestrutura TI', 1, 12000],
      ['equipamentos', 'Carteiras e cadeiras', 200, 180],
      ['equipamentos', 'Mesas professorais', 12, 350],
      ['equipamentos', 'Armários e estantes', 20, 400],
      ['equipamentos', 'Quadros brancos', 12, 280],
      ['equipamentos', 'Lab. ciências', 1, 25000],
      ['equipamentos', 'Projetores multimídia', 8, 2200],
      ['equipamentos', 'Computadores (TI)', 12, 2800],
      ['equipamentos', 'Biblioteca (acervo)', 1, 20000],
      ['equipamentos', 'Brinquedoteca', 1, 15000],
      ['equipamentos', 'Cozinha industrial', 1, 28000],
      ['franquia', 'Taxa de franquia Legacy', 1, 85000],
      ['franquia', 'Treinamento inicial', 1, 25000],
      ['franquia', 'Material didático inicial', 1, 18000],
      ['franquia', 'Sistema de gestão escolar', 1, 15000],
      ['franquia', 'Consultoria de implantação', 1, 20000],
      ['giro', 'Capital de giro (3 meses)', 1, 180000],
      ['giro', 'Marketing de lançamento', 1, 35000],
      ['giro', 'Uniformes equipe', 25, 120],
      ['giro', 'Material de escritório', 1, 8000],
      ['giro', 'Seguro e garantias', 1, 12000],
    ]
    var ccol = app.findCollectionByNameOrId('capex_itens')
    capexData.forEach(function (c) {
      try {
        app.findFirstRecordByData('capex_itens', 'descricao', c[1])
      } catch (_) {
        var r = new Record(ccol)
        r.set('block', c[0])
        r.set('descricao', c[1])
        r.set('qtd', c[2])
        r.set('custo_unitario', c[3])
        app.save(r)
      }
    })

    var pcol = app.findCollectionByNameOrId('capex_parametros')
    if (app.countRecords('capex_parametros') === 0) {
      var r = new Record(pcol)
      r.set('contingencia_pct', 10)
      app.save(r)
    }

    var dreData = [
      ['alunos', 200],
      ['ticket_medio', 1800],
      ['inadimplencia', 5],
      ['mat_por_aluno', 120],
      ['uni_por_aluno', 350],
      ['elet_por_aluno', 200],
      ['simples_pct', 6],
      ['royalties_pct', 5],
      ['mkt_legacy_pct', 3],
      ['mat_custo_pct', 8],
      ['aluguel', 25000],
      ['energia', 4500],
    ]
    var dcol = app.findCollectionByNameOrId('dre_parametros')
    dreData.forEach(function (d) {
      try {
        app.findFirstRecordByData('dre_parametros', 'field_name', d[0])
      } catch (_) {
        var r = new Record(dcol)
        r.set('field_name', d[0])
        r.set('value', d[1])
        app.save(r)
      }
    })
  },
  (app) => {},
)
