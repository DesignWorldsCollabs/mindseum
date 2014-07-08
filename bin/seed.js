#!/usr/bin/env node

var async = require('async')
var derby = require('derby')
var config = require('../config').generate()
var store = require('../lib/server/createStore')(derby, config)

var model = store.createModel({fetchOnly: true, unloadDelay: 0})

async.parallel([seedMeta, seedBoard], seeded)

function seedMeta(cb) {
  var game = model.at('metadata.game')
  game.fetch(onFetch)
  function onFetch(err) {
    if (err) return cb(err)
    game.setNull('title', 'Mindseum')
    game.setNull('description', 'Neurofeedback for Virtual Museums of the Future')
    game.setNull('keywords', 'mindseum')
    wait()
  }
  function wait() {
    game.hasWritePending() ? setTimeout(wait, 100) : game.unfetch(onUnfetch)
  }
  function onUnfetch(err) {
    cb(err, game)
  }
}

function seedBoard(cb) {
  var board = model.at('boards.default')
  board.fetch(onFetch)
  function onFetch(err) {
    if (err) return cb(err)
    var boardSize = 5
    var center = Math.floor(Math.pow(boardSize, 2) / 2) // count from zero
    board.setNull('width', boardSize)
    board.setNull('height', boardSize)
    board.setNull('center', center)
    board.setNull('beadIds', [
      '6b8bcfa5-8186-4014-840b-293b577f8353',
      '4f7f7c3f-f204-43ba-b5b0-11e2552a3822',
      'bd6b38f2-3753-463b-a88b-ac77c0d4a8df',
      'c325b208-449d-494e-8c4e-3026ffdb329f',
      'f11c214b-0c20-48e8-b4ba-13d160e36e38',
      '94ed4df9-900a-4c24-95d3-b966bba36135',
      '16b52788-6fde-449b-b2b5-466335cbef12',
      '46e97356-b17f-4f57-956a-94025d4af997',
      '0ee0b35c-1076-4915-9692-076bece8bfdf',
      '3351af07-4fbe-4a70-8ce4-608cbfe6ee17',
      '903491f6-e996-4b49-90f4-30754a2f703d',
      '039a77a9-877e-4e97-8445-effa5200835d',
      '10a4b243-c451-4226-9dbf-abf63a1ab8dc',
      'b5698776-73f5-4699-833d-799b4c5f158e',
      '289332c3-398a-4a63-b125-f92d7c0bd8ee',
      '2ce7334c-674d-428c-a0b8-94814615b789',
      '98d384b0-bc9c-40c1-9a3b-0530fd5853fc',
      'af057217-390c-488f-a060-0f0612e1ba45',
      '7f869ddc-6eb6-433f-9760-a437cd929e9d',
      '2d053ba8-035c-424b-bc3c-9527192c001c',
      '3d0084ab-cde8-4c48-b50d-9279d4b17ad8',
      '69be0e87-0e22-4c38-b011-010f151d9405',
      'db85d9dc-2e65-4d9d-a19c-e608e87af535',
      '2488b848-166e-4332-8b98-2b162f363be4'
    ])
    wait()
  }
  function wait() {
    board.hasWritePending() ? setTimeout(wait, 100) : board.unfetch(onUnfetch)
  }
  function onUnfetch(err) {
    cb(err, board)
  }
}

function seeded(err, data) {
  if (err) throw err
  process.stdout.write('seeded')
  process.exit()
}

