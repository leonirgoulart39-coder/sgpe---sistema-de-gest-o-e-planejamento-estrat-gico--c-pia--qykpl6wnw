migrate(
  (app) => {
    var users = app.findCollectionByNameOrId('users')
    var profiles = app.findCollectionByNameOrId('user_profiles')

    var userRecord
    try {
      userRecord = app.findAuthRecordByEmail('users', 'leonirgoulart39@gmail.com')
    } catch (_) {
      return
    }

    try {
      app.findFirstRecordByData('user_profiles', 'user_id', userRecord.id)
    } catch (_) {
      var profile = new Record(profiles)
      profile.set('user_id', userRecord.id)
      profile.set('role', 'admin')
      app.save(profile)
    }
  },
  (app) => {
    try {
      var userRecord = app.findAuthRecordByEmail('users', 'leonirgoulart39@gmail.com')
      var profile = app.findFirstRecordByData('user_profiles', 'user_id', userRecord.id)
      app.delete(profile)
    } catch (_) {}
  },
)
