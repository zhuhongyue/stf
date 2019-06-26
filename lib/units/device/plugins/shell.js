var Promise = require('bluebird')
var syrup = require('stf-syrup')
var kill = require("tree-kill")
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
      log.info("################################try to find execut path in linux ENV",process.env.testpath)
      log.info("the config path in env is",process.env.testpath_default_config)     
      log.info('Running shell command "%s"', message.command)
      if(message.command == ""){
          log.info("##############################empty command!")
          return false}
      if(message.command.indexOf("kill")== 0 ){
         log.info("###############get kill command!!###############") 
         log.info("the message is "+message.command)
         var recent_pid = message.command.split("-")[1] 
         log.info("the pid will be killed is "+recent_pid+":"+typeof(recent_pid))
         spawn_kill = spawn('kill',["-"+recent_pid])
         spawn_kill.stdout.on('data',function(chunk){
             log.info("spawn_kill stdout: " + chunk.toString())
         })
         spawn_kill.stderr.on('data',(data)=>{
             log.info("spawn_kill stderr: "+data)
         })
         spawn_kill.on('close',(data)=>{
             log.info("spawn_kill close: "+data)
         })
         kill(parseInt(recent_pid))
         push.send([channel,reply.okay("stop running!!!"+recent_pid)]) 
         return true 
      }
      var spawn_cmd = spawn('python',[process.env.testpath,process.env.testpath_default_config],{cwd: root})
      push.send([channel,reply.okay("start running"+spawn_cmd.pid)])
      spawn_cmd.stdout.on('data',function(chunk){
          log.info("spawn_cmd stdout: "+/*":[pid,"+spawn_cmd.pid+"]:"+*/chunk.toString())
      })
      spawn_cmd.stderr.on('data',(data)=>{
          log.info("spawn_cmd stderr: " +data)
          push.send([channel,reply.okay("fail")])
      })
      spawn_cmd.on('close',(data)=>{
          log.info("sapwn_cmd: " + data)
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
