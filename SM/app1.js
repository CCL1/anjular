/**
 * Created by Administrator on 2016/3/16.
 */
//创建应用模块，添加依赖ngStorage
var app = angular.module("myApp", ["ngStorage", "ngMessages"]);

//过滤器


app.directive("changeClass", function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on("click", function () {
                if (!element.attr("class")) {
                    element.attr("class", "desc");
                } else if (element.attr("class") == "desc") {
                    element.attr("class", "asc");
                } else {
                    element.attr("class", "desc");
                }
            })
        }
    }
})

//添加控制器，注入依赖$scope,$localStorage,($sessionStorage)

//users = [{},{}]

//user = {}

app.controller("myController", function ($scope, $localStorage) {
    //初始化storage
    $scope.$storage = $localStorage.$default({
        students: []
    });

    $scope.students = $scope.$storage.students;
    //增加一条记录
    $scope.showDialog = function () {
        //显示dialog
        $scope.dialogShow = true;
        $scope.addBtnShow = true;
        $scope.editBtnShow = false;
        var len = $scope.$storage.students.length;
        if (len == 0) {
            $scope.no = 201609100;
        } else {
            $scope.no = $scope.$storage.students[len - 1].id + 1;
        }
    };

    //保存新纪录

    $scope.addRecord = function () {
    	$scope.dialogShow = false;
    	
        var student = {
            id: $scope.no++,
            name: $scope.name,
            sexy: $scope.sexy,
            score: $scope.score
        };
        $scope.$storage.students.push(student);
        $scope.students = $scope.$storage.students;


    };

    //编辑记录
    $scope.editRecord = function (id) {
        //点击按钮，显示对话框 ，显示原始值
        $scope.editBtnShow = true;
        $scope.dialogShow = true;
 		$scope.addBtnShow = false;
        $scope.no = $scope.$storage.students[id].id;
        $scope.name = $scope.$storage.students[id].name;
        $scope.sexy = $scope.$storage.students[id].sexy;
        $scope.score = $scope.$storage.students[id].score;

        $scope.index = id;
    };
//保存编辑记录
    $scope.saveEditRecord = function (id) {
        //将相应位置的值修改
        //首先需要传一个值进来
        $scope.$storage.students[id] = {
            id: $scope.no,
            name: $scope.name,
            sexy: $scope.sexy,
            score: $scope.score
        }

    };

    //删除记录
    $scope.delRecord = function (id) {

        $scope.$storage.students.splice(id, 1);

    };

    //隐藏dialog
    $scope.hideDialog = function () {
        $scope.dialogShow = false;
        $scope.addBtnShow = false;
        $scope.editBtnShow = false;
    };

    //删除记录
    $scope.delAll = function () {
        //全选删除
        if ($scope.selectAll) {
            $scope.$storage.students = [];
            $scope.students = $scope.$storage.students;
            $scope.selectAll = false;
            $scope.selected.length = 0;
        } else {
            for (var i = 0; i < $scope.selected.length; i++) {
                var id = $scope.selected[i];
                angular.forEach($scope.$storage.students, function (data, index, array) {
                    if (array[index].id == id) {
                        $scope.$storage.students.splice(index, 1);
                    }
                });
            }
        }
    };

    //部分选择
    $scope.selected = [];
    $scope.selSomeRecord = function (id, ck) {
        if (ck) {
            $scope.selected.push(id);
        } else {
            for (var i = 0; i < $scope.selected.length; i++) {
                if (id == $scope.selected[i]) {
                    $scope.selected.splice(i, 1);
                }
            }
        }
        $scope.selectAll = $scope.selected.length == $scope.$storage.students.length;
    };
    //全选
    $scope.selAll = function () {
        var selectArr;
        if ($scope.selectAll) {
            $scope.selected = [];
            for (var i = 0; i < $scope.$storage.students.length; i++) {
                $scope.selected.push($scope.$storage.students[i].id);
            }
            selectArr = document.getElementsByClassName("sels");
            angular.forEach(selectArr, function(value , i){
            });

            for (var i = 0; i < selectArr.length; i++) {
                selectArr[i].checked = true;
            }
        } else {
            $scope.selected = [];
            selectArr = document.getElementsByClassName("sels");
            for (var i = 0; i < selectArr.length; i++) {
                selectArr[i].checked = false;
            }
            $scope.selSingle = false;
            //$scope.selectAll = false;
        }
    };

    //按照分数进行过滤
    //grade:excellent(90-100),good(80-89),bad(<80)

    $scope.gradeArr = ["全部", "优", "良", "差"];
    $scope.grade = "全部";

    //test


    $scope.selectGrade = function () {

        var excellent = [];
        var good = [];
        var bad = [];
        for (var i = 0; i < $scope.$storage.students.length; i++) {

            if ($scope.$storage.students[i].score >= 90) {
                excellent.push($scope.$storage.students[i]);

            } else if ($scope.$storage.students[i].score >= 80 && $scope.$storage.students[i].score < 90) {
                good.push($scope.$storage.students[i])

            } else {
                bad.push($scope.$storage.students[i])
            }
        }

        switch ($scope.grade) {
            case "优" :
                $scope.students = excellent;
                break;
            case "良" :
                $scope.students = good;
                break;
            case "差" :
                $scope.students = bad;
                break;
            case "全部":
                $scope.students = $scope.$storage.students;
        }
    };

    //search

    $scope.search = function () {
        $scope.students = [];
        for (var i = 0; i < $scope.$storage.students.length; i++) {
            if ($scope.$storage.students[i].id == $scope.searchValue || $scope.$storage.students[i].name.indexOf($scope.searchValue) != -1) {
                $scope.students.push($scope.$storage.students[i]);
            }
        }
    };

    //orderBy score

    $scope.desc = 0;//默认

    //form validation

    $scope.default = true;
});

