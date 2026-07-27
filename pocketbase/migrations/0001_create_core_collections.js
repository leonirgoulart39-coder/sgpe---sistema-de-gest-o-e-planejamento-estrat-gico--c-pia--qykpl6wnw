migrate(
  (app) => {
    app.save(
      new Collection({
        name: 'user_profiles',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          {
            name: 'user_id',
            type: 'relation',
            required: true,
            collectionId: '_pb_users_auth_',
            cascadeDelete: true,
            maxSelect: 1,
          },
          {
            name: 'role',
            type: 'select',
            required: true,
            values: ['admin', 'financeiro', 'operacional', 'leitura'],
            maxSelect: 1,
          },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE UNIQUE INDEX idx_user_profiles_uid ON user_profiles (user_id)'],
      }),
    )

    app.save(
      new Collection({
        name: 'planejamento',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'section', type: 'text', required: true },
          { name: 'field_name', type: 'text', required: true },
          { name: 'content', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_planejamento_section ON planejamento (section)'],
      }),
    )

    app.save(
      new Collection({
        name: 'swot_items',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          {
            name: 'quadrant',
            type: 'select',
            required: true,
            values: ['forcas', 'fraquezas', 'oportunidades', 'ameacas'],
            maxSelect: 1,
          },
          { name: 'text', type: 'text', required: true },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'valores_fundamentais',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
      }),
    )

    app.save(
      new Collection({
        name: 'audit_log',
        type: 'base',
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: null,
        deleteRule: null,
        fields: [
          { name: 'user_id', type: 'text' },
          { name: 'user_name', type: 'text' },
          { name: 'module', type: 'text' },
          { name: 'field_name', type: 'text' },
          { name: 'old_value', type: 'text' },
          { name: 'new_value', type: 'text' },
          { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
          { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
        ],
        indexes: ['CREATE INDEX idx_audit_log_created ON audit_log (created DESC)'],
      }),
    )
  },
  (app) => {
    ;['user_profiles', 'planejamento', 'swot_items', 'valores_fundamentais', 'audit_log'].forEach(
      function (n) {
        try {
          app.delete(app.findCollectionByNameOrId(n))
        } catch (_) {}
      },
    )
  },
)
