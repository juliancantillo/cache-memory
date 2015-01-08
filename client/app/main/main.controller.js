'use strict';

angular.module('cachemApp')
  .controller('MainCtrl', function ($scope, $http) {

    $scope.checkHex = function (n){return/^[0-9A-Fa-f]{1,64}$/.test(n)};
    $scope.checkBin = function (n){return/^[01]{1,64}$/.test(n)};
    $scope.Hex2Bin = function (n){if(!$scope.checkHex(n)){return 0;} return parseInt(n,16).toString(2)};
    $scope.Bin2Hex = function (n){if(!$scope.checkBin(n)){return 0;} return parseInt(n,2).toString(16)};

    $scope.word = '7EABC495FE';
    $scope.binary_word = $scope.Hex2Bin($scope.word);

    $scope.dataUnits = [
      { name: "b", factor: 0 },
      { name: "Kb", factor: 10 },
      { name: "Mb", factor: 20 },
      { name: "Gb", factor: 30 },
    ];
    $scope.currents = {
      mm_unit: $scope.dataUnits[0],
      cm_unit: $scope.dataUnits[0],
      mb_unit: $scope.dataUnits[0],
    };

    $scope.values = {
      mm: { size: 512, unit: $scope.dataUnits[3] },
      cm: { size: 64, unit: $scope.dataUnits[2] },
      mb: { size: 32, unit: $scope.dataUnits[0] },
    };
    $scope.results = {
      mm: { log: 13 },
      cm: { log: 13 },
      mb: { log: 13 },
      word: { log: 0 },
      line: { log: 0 },
      direct: {},
    };

    $scope.setMmUnit = function (unit) {
      $scope.values.mm.unit = unit;
    }
    $scope.setCmUnit = function (unit) {
      $scope.values.cm.unit = unit;
    }
    $scope.setMbUnit = function (unit) {
      $scope.values.mb.unit = unit;
    }

    $scope.$watchCollection('values.mm', function (newValue) {
      $scope.results['mm'] = {
          log: $scope.getLog( newValue.size, newValue.unit.factor )
        };
      $scope.results['M'] = $scope.getLog( newValue.size, newValue.unit.factor ) - $scope.results['word'];
    });

    $scope.$watchCollection('values.cm', function (newValue) {
      $scope.results['cm'] = {
          log: $scope.getLog( newValue.size, newValue.unit.factor )
        };
      $scope.results['line'] = $scope.getLog( newValue.size, newValue.unit.factor ) - $scope.results['word'];

      $scope.results.direct['line'] = $scope.getLog( newValue.size, newValue.unit.factor ) - $scope.results['word'];
      $scope.results.direct['tag'] = $scope.results.mm.log - $scope.getLog( newValue.size, newValue.unit.factor );

    });

    $scope.$watchCollection('values.mb', function (newValue) {
      $scope.results['mb'] = {
          log: $scope.getLog( newValue.size, newValue.unit.factor )
        };
      $scope.results['word'] = $scope.getLog( newValue.size, newValue.unit.factor );
    });

    $scope.submitForm = function (){
      var bnw = $scope.binary_word;

      $scope.direct_tag = bnw.substring( 0, $scope.results.direct.tag );
      $scope.direct_line = bnw.substring( $scope.results.direct.tag, $scope.results.direct.tag + $scope.results.line );
      $scope.direct_word = bnw.substring( $scope.results.direct.tag + $scope.results.line );
      $scope.direct_tag_hex = $scope.Bin2Hex( $scope.direct_tag );
      $scope.direct_line_hex = $scope.Bin2Hex( $scope.direct_line );
      $scope.direct_word_hex = $scope.Bin2Hex( $scope.direct_word );

      //Asociativa 2 Vias
      $scope.associative2_tag = bnw.substring( 0, $scope.results.direct.tag + 1 );
      $scope.associative2_line = bnw.substring( $scope.results.direct.tag + 1, ( $scope.results.direct.tag + 1) + ($scope.results.line - 1 ) );
      $scope.associative2_word = bnw.substring( ( $scope.results.direct.tag + 1) + ($scope.results.line - 1 ) );
      $scope.associative2_tag_hex = $scope.Bin2Hex( $scope.associative2_tag );
      $scope.associative2_line_hex = $scope.Bin2Hex( $scope.associative2_line );
      $scope.associative2_word_hex = $scope.Bin2Hex( $scope.associative2_word );

      //Asociativa 4 Vias
      $scope.associative4_tag = bnw.substring( 0, $scope.results.direct.tag + 2 );
      $scope.associative4_line = bnw.substring( $scope.results.direct.tag + 2, ( $scope.results.direct.tag + 2) + ($scope.results.line - 2 ) );
      $scope.associative4_word = bnw.substring( ( $scope.results.direct.tag + 2) + ($scope.results.line - 2 ) );
      $scope.associative4_tag_hex = $scope.Bin2Hex( $scope.associative4_tag );
      $scope.associative4_line_hex = $scope.Bin2Hex( $scope.associative4_line );
      $scope.associative4_word_hex = $scope.Bin2Hex( $scope.associative4_word );

      $scope.associative_tag = bnw.substring( 0, $scope.results.M );
      $scope.associative_word = bnw.substring( $scope.results.M, $scope.results.M + $scope.results.word );
      $scope.associative_tag_hex = $scope.Bin2Hex( $scope.associative_tag );
      $scope.associative_word_hex = $scope.Bin2Hex( $scope.associative_word );
    }

    $scope.getLog = function (value, factor) {
      return ( Math.log( value ) / Math.log(2) ) + factor;
    }

  });
