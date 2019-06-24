module.exports = function ShellCtrl($scope) {
  $scope.result = null
  $scope.pid = "-1"
  $scope.isrunning = false 
  $scope.run = function(command) {
    if (command === 'clear') {
      $scope.clear()
      return
    }

    $scope.command = ''
      if($scope.pid == "-1"){
        $scope.isrunning = true
        command = "start testing"
        return $scope.control.shell(command)
          .progressed(function(result) {
            $scope.result = result
            $scope.data = result.data.join('')
            $scope.$digest()
          })
          .then(function(result) {
            alert("result:"+result.data.join(''))
            $scope.pid = result.data.join('').split("running")[1]
            alert("the pid is"+$scope.pid)  
            $scope.result = result
            $scope.data = result.data.join('')
            $scope.$digest()
          })
      }
      else{
        $scope.isrunning = false
        command = "kill-" + $scope.pid
        $scope.pid = "-1"
        return $scope.control.shell(command)
          .progressed(function(result) {
            $scope.result = result
            $scope.data = result.data.join('')
            $scope.$digest()
          })
          .then(function(result) {
            alert("result:"+result.data.join(''))
            $scope.result = result
            $scope.data = result.data.join('')
            $scope.$digest()
          })
      }
  }

  $scope.clear = function() {
    $scope.command = ''
    $scope.data = ''
    $scope.result = null
  }
 
}
