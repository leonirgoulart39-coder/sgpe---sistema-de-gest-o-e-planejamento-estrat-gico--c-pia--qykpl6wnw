migrate(
  (app) => {
    var cargos = [
      ['Diretor Geral', 'Diretoria', 1, 12000],
      ['Coord. Pedagógico', 'Pedagógico', 1, 6000],
      ['Prof. Ed. Infantil', 'Pedagógico', 4, 3500],
      ['Prof. Ens. Fundamental', 'Pedagógico', 6, 4000],
      ['Prof. de Inglês', 'Pedagógico', 2, 3500],
      ['Prof. de Ed. Física', 'Pedagógico', 1, 3000],
      ['Prof. de Artes', 'Pedagógico', 1, 3000],
      ['Prof. de Música', 'Pedagógico', 1, 3000],
      ['Auxiliar de Classe', 'Pedagógico', 4, 2200],
      ['Coord. Administrativo', 'Administrativo', 1, 4500],
      ['Aux. Administrativo', 'Administrativo', 2, 2500],
      ['Recepcionista', 'Administrativo', 2, 2000],
      ['Zelador', 'Operacional', 2, 1800],
      ['Aux. de Limpeza', 'Operacional', 4, 1600],
      ['Aux. de Cozinha', 'Operacional', 2, 1600],
      ['Segurança', 'Operacional', 1, 2000],
      ['Motorista', 'Operacional', 1, 2200],
      ['TI / Suporte', 'Administrativo', 1, 3000],
    ]
    var col = app.findCollectionByNameOrId('equipe_cargos')
    cargos.forEach(function (c) {
      try {
        app.findFirstRecordByData('equipe_cargos', 'cargo', c[0])
      } catch (_) {
        var r = new Record(col)
        r.set('cargo', c[0])
        r.set('area', c[1])
        r.set('qtd', c[2])
        r.set('salario', c[3])
        app.save(r)
      }
    })

    var encargos = [
      ['INSS Patronal', 20],
      ['FGTS', 8],
      ['SAT/RAT', 1],
      ['Salário Educação', 2.5],
      ['Sistema S', 1.5],
      ['Décimo Terceiro', 8.33],
      ['Férias + 1/3', 11.11],
    ]
    var ecol = app.findCollectionByNameOrId('encargos_parametros')
    encargos.forEach(function (e) {
      try {
        app.findFirstRecordByData('encargos_parametros', 'nome', e[0])
      } catch (_) {
        var r = new Record(ecol)
        r.set('nome', e[0])
        r.set('percentual', e[1])
        app.save(r)
      }
    })
  },
  (app) => {},
)
