'use strict'

var fs = require('fs')
var Path = require('path')
var Rand = require('crypto-rand')
var Crypto = require('crypto-js')

var Log = require(Path.join(__base, 'src/log.js'))

function Auth () {
  this.passwords = require(Path.join(__base, 'configs/passwords.json'))
  this.invites = []
}

Auth.prototype.login = function (user, pass) {
  if (this.passwords[user] && this.passwords[user].pass === pass) {
    Log.print(user + ' login.')
    if (typeof this.passwords[user].token === 'undefined') {
      this.passwords[user].token = []
    }
    var token = this.genToken(user, pass)
    this.passwords[user].token.push(token)
    return token
  } else {
    return false
  }
}

Auth.prototype.logout = function (user, token) {
  Log.print(user + ' logout.')
  if (this.passwords[user] && this.passwords[user].token && this.passwords[user].token.indexOf(token) !== -1) {
    delete this.passwords[user].token.splice(this.passwords[user].token.indexOf(token), 1)
    return true
  } else {
    return false
  }
}

Auth.prototype.register = function (user, pass, invite) {
  if (this.invites.indexOf(invite) !== -1 && typeof this.passwords[user] === 'undefined') {
    Log.print(user + ' register with invitation: ' + invite + '.')
    this.deleteInvite(invite)
    var token = this.genToken(user, pass)
    this.passwords[user] = {
      pass: pass,
      token: [token]
    }
    this.savePasswords()

    return token
  } else {
    return false
  }
}

Auth.prototype.checkLogged = function (user, token) {
  if (this.passwords[user] && this.passwords[user].token && this.passwords[user].token.indexOf(token) !== -1) {
    return true
  } else {
    return false
  }
}

Auth.prototype.genToken = function (user, pass) {
  var seed = user + pass + Rand.rand().toString()
  return Crypto.SHA256(seed).toString()
}

/**
 * Save Directory.fileInfo into configs/fileInfo.json.
*/
Auth.prototype.savePasswords = function () {
  var self = this
  var passwords = JSON.parse(JSON.stringify(self.passwords))
  for (var user in passwords) {
    if (passwords[user].token) {
      delete passwords[user].token
    }
  }
  fs.writeFile('configs/passwords.json', JSON.stringify(passwords), function (err) {
    if (err) console.log(err)
  })
}

Auth.prototype.createInvite = function (inviteKey) {
  if (inviteKey === __config.server.invitationKey) {
    var invite = this.genToken(Rand.rand(), Rand.rand())
    Log.print('Invite generated: ' + invite + '.')
    this.invites.push(invite)
    return invite
  } else {
    return false
  }
}

Auth.prototype.deleteInvite = function (invite) {
  var index = this.invites.indexOf(invite)
  if (index !== -1) {
    this.invites.splice(index, 1)
  }
  return true
}

module.exports = new Auth()
