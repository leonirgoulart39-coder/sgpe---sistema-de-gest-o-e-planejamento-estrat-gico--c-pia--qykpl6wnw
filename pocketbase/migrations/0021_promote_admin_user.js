migrate(
  (app) => {
    var userRecord
    try {
      userRecord = app.findAuthRecordByEmail('users', 'leonirgoulart39@gmail.com')
    } catch (_) {
      return
    }

    var profile
    try {
      profile = app.findFirstRecordByData('user_profiles', 'user_id', userRecord.id)
    } catch (_) {
      return
    }

    if (profile.get('role') === 'admin') {
      return
    }

    profile.set('role', 'admin')
    app.save(profile)
  },
  (app) => {},
)
