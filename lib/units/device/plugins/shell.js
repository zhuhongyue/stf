var Promise = require('bluebird')
var syrup = require('stf-syrup')

var logger = require('../../../util/logger')
var wire = require('../../../wire')
var wireutil = require('../../../wire/util')
var spawn = require('child_process').spawn
module.exports = syrup.serial()
  .dependency(require('../support/adb'))
  .dependency(require('../support/router'))
  .dependency(require('../support/push'))
  .dependency(require('../support/sub'))
  .define(function(options, adb, router, push, sub) {
    var log = logger.createLogger('device:plugins:shell')
    router.on(wire.ShellCommandMessage, function(channel, message) {
      var reply = wireutil.reply(options.serial)
      log.info('Running shell command "%s"', message.command)
      if(message.command == ""){
          log.info("##############################empty command!")
          return false}
      var spawn_cmd = spawn('python',['execute.py','excution.config'],cwd: root)
      spawn_cmd.stdout.on('data',function(chunk){
          log.info(chunk.toString())
      })
      spawn_cmd.stderr.on('data',(data)=>{
          log.indo(data)
      })
      spawn_cmd.on('close',(data)=>{
          log.info(data)
      })
      
      

      /*
      spawn(cmdStr, function(err,stdout,stderr){
      if(err) {
        log.info('###############get error:'+stderr)
        push.send([channel,reply.okay("fail")])
      } else {
        log.info("#########run successfully!!##############")
        push.send(
           [ channel,
             reply.progress("Running ")
           ])
     }
	})*/

    })
  })
