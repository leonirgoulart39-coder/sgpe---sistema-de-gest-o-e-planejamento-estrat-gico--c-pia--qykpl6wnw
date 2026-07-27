migrate(
  (app) => {
    var col = app.findCollectionByNameOrId('equipe_cargos')

    if (!col.fields.getByName('regime')) {
      col.fields.add(new TextField({ name: 'regime' }))
    }
    if (!col.fields.getByName('horario')) {
      col.fields.add(new TextField({ name: 'horario' }))
    }
    app.save(col)

    var encargosData = [
      ['INSS Patronal', 20],
      ['FGTS', 8],
      ['SAT/RAT', 3],
      ['Salário Educação', 2.5],
      ['Sistema S', 3.17],
      ['Décimo Terceiro', 8.33],
      ['Férias + 1/3', 11.11],
      ['Provisão Rescisão & Outros', 15.89],
    ]
    var ecol = app.findCollectionByNameOrId('encargos_parametros')
    encargosData.forEach(function (e) {
      try {
        var existing = app.findFirstRecordByData('encargos_parametros', 'nome', e[0])
        existing.set('percentual', e[1])
        app.save(existing)
      } catch (_) {
        var r = new Record(ecol)
        r.set('nome', e[0])
        r.set('percentual', e[1])
        app.save(r)
      }
    })

    var seedCargos = [
      // LIDERANÇA
      {
        cargo: 'Diretora Escolar',
        area: 'LIDERANÇA',
        qtd: 1,
        regime: 'CLT 44h',
        horario: 'Seg–Sex 7h–16h',
        salario: 9000,
      },
      {
        cargo: 'Coordenadora Pedagógica',
        area: 'LIDERANÇA',
        qtd: 1,
        regime: 'CLT 44h',
        horario: 'Seg–Sex 7h–16h',
        salario: 6500,
      },
      {
        cargo: 'Coordenadora Administrativa',
        area: 'LIDERANÇA',
        qtd: 1,
        regime: 'CLT 44h',
        horario: 'Seg–Sex 7h–16h',
        salario: 5500,
      },

      // DOCENTES
      {
        cargo: 'Professoras Regentes Ed. Infantil (Pré-1 e Pré-2)',
        area: 'DOCENTES',
        qtd: 2,
        regime: 'CLT 40h',
        horario: 'Seg–Sex 7h–12h / 13h–18h',
        salario: 3200,
      },
      {
        cargo: 'Professoras Regentes Anos Iniciais (1º ao 5º ano)',
        area: 'DOCENTES',
        qtd: 7,
        regime: 'CLT 40h',
        horario: 'Seg–Sex 7h–12h / 13h–18h',
        salario: 3200,
      },
      {
        cargo: 'Professoras Regentes Anos Finais (6º ao 9º ano)',
        area: 'DOCENTES',
        qtd: 4,
        regime: 'CLT 40h',
        horario: 'Seg–Sex 7h–12h / 13h–18h',
        salario: 3200,
      },
      {
        cargo: 'Professoras Ensino Médio (disciplinas específicas)',
        area: 'DOCENTES',
        qtd: 3,
        regime: 'CLT 40h',
        horario: 'Seg–Sex 7h–12h',
        salario: 3500,
      },
      {
        cargo: 'Professor/a de Inglês (bilíngue)',
        area: 'DOCENTES',
        qtd: 4,
        regime: 'CLT 40h',
        horario: 'Seg–Sex 7h–12h / 13h–18h',
        salario: 4200,
      },
      {
        cargo: 'Professor/a de Bíblia / Capelão',
        area: 'DOCENTES',
        qtd: 1,
        regime: 'CLT 40h',
        horario: 'Seg–Sex 7h–12h',
        salario: 2800,
      },
      {
        cargo: 'Prof. Hora/Aula — Ed. Física',
        area: 'DOCENTES',
        qtd: 2,
        regime: 'CLT 20h',
        horario: 'Seg–Sex (turnos)',
        salario: 1800,
      },
      {
        cargo: 'Prof. Hora/Aula — Arte e Música',
        area: 'DOCENTES',
        qtd: 2,
        regime: 'CLT 20h',
        horario: 'Seg–Sex (turnos)',
        salario: 1800,
      },
      {
        cargo: 'Prof. Hora/Aula — Tecnologia',
        area: 'DOCENTES',
        qtd: 2,
        regime: 'CLT 20h',
        horario: 'Seg–Sex (turnos)',
        salario: 1800,
      },

      // ADMINISTRATIVO E APOIO
      {
        cargo: 'Secretária Escolar',
        area: 'ADMINISTRATIVO E APOIO',
        qtd: 2,
        regime: 'CLT 44h',
        horario: 'Seg–Sex 7h–16h / 12h–21h',
        salario: 2400,
      },
      {
        cargo: 'Auxiliar Financeiro',
        area: 'ADMINISTRATIVO E APOIO',
        qtd: 1,
        regime: 'CLT 44h',
        horario: 'Seg–Sex 7h–16h',
        salario: 2800,
      },
      {
        cargo: 'Auxiliar de Sala Ed. Infantil',
        area: 'ADMINISTRATIVO E APOIO',
        qtd: 4,
        regime: 'CLT 40h',
        horario: 'Seg–Sex 7h–12h / 13h–18h',
        salario: 2000,
      },
      {
        cargo: 'Porteiro / Recepção / Segurança',
        area: 'ADMINISTRATIVO E APOIO',
        qtd: 2,
        regime: 'CLT 44h',
        horario: 'Seg–Sex 6h–22h (revezamento)',
        salario: 2100,
      },
      {
        cargo: 'Nutricionista (part-time)',
        area: 'ADMINISTRATIVO E APOIO',
        qtd: 1,
        regime: 'CLT 20h',
        horario: 'Seg–Sex 8h–12h',
        salario: 2200,
      },
      {
        cargo: 'Técnico de TI / Suporte',
        area: 'ADMINISTRATIVO E APOIO',
        qtd: 1,
        regime: 'CLT 44h',
        horario: 'Seg–Sex 7h–16h',
        salario: 3200,
      },
      {
        cargo: 'Auxiliar Administrativo',
        area: 'ADMINISTRATIVO E APOIO',
        qtd: 2,
        regime: 'CLT 44h',
        horario: 'Seg–Sex 7h–16h',
        salario: 2200,
      },

      // OPERACIONAL / SERVIÇOS
      {
        cargo: 'Serviços Gerais / Limpeza',
        area: 'OPERACIONAL / SERVIÇOS',
        qtd: 3,
        regime: 'CLT 44h',
        horario: 'Seg–Sex 6h–21h (revezamento)',
        salario: 1800,
      },
      {
        cargo: 'Cozinheiro/a',
        area: 'OPERACIONAL / SERVIÇOS',
        qtd: 2,
        regime: 'CLT 44h',
        horario: 'Seg–Sex 6h–15h / 12h–21h',
        salario: 2200,
      },
      {
        cargo: 'Auxiliar de Cozinha',
        area: 'OPERACIONAL / SERVIÇOS',
        qtd: 1,
        regime: 'CLT 44h',
        horario: 'Seg–Sex 6h–15h',
        salario: 1700,
      },
    ]

    var validNames = seedCargos.map(function (s) {
      return s.cargo
    })

    try {
      var records = app.findRecordsByFilter('equipe_cargos', 'id != ""', 'created', 200, 0)
      records.forEach(function (r) {
        if (validNames.indexOf(r.getString('cargo')) === -1) {
          app.delete(r)
        }
      })
    } catch (_) {}

    seedCargos.forEach(function (item) {
      var rec
      try {
        rec = app.findFirstRecordByData('equipe_cargos', 'cargo', item.cargo)
      } catch (_) {
        rec = new Record(col)
      }
      rec.set('cargo', item.cargo)
      rec.set('area', item.area)
      rec.set('qtd', item.qtd)
      rec.set('regime', item.regime)
      rec.set('horario', item.horario)
      rec.set('salario', item.salario)
      app.save(rec)
    })
  },
  (app) => {},
)
