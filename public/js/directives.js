Sheets.directive('paneset', function() {
	return {
		link : function(scope, elem, attrs) {
			// collect all the relevant elements and save them
			var panes = attrs.panes = elem.find(">*[pane]");
			attrs.fixedPanes = panes.filter("[type=fixed]");
			attrs.dynamicPanes = panes.filter("[type=dynamic]");
			attrs.parent = elem.parent();

			// Sum of all the weights of the dynamic panes
			attrs.weightSum = scope.sumAttribute(attrs.dynamicPanes, "weight");
			attrs.widthSum = scope.sumAttribute(attrs.fixedPanes, "size");

			if (attrs.orientation === "horizontal") {
				attrs.flowDimension = "width";
				attrs.fillDimension = "height";
			} else if (attrs.orientation === "vertical") {
				attrs.flowDimension = "height";
				attrs.fillDimension = "width";
			}

			var fillDimension = attrs.fillDimension;
			panes.css({
				"float" : "left",
				"-webkit-transform" : "translate(0, 0, 0)"
			});
			panes.css(fillDimension, "100%");
		},
		controller : function($scope, $element, $attrs, $location) {
			var regexNum = /\d+/;
			var regexUnit = /[a-zA-z]+/;

			$scope.resize = function(e) {

				var w, h;

				w = $attrs.parent.width();
				h = $attrs.parent.height();

				$element.css({
					width : w,
					height: h
				});

				$attrs.fixedPanes.each(function(i, e) {

					var pw = $(this).attr("size");
					var size = $scope.parseSize( pw );

					$(e).css($attrs.flowDimension, pw);
				});

				var spaceToFill = $attrs.parent[ $attrs.flowDimension ]() - $attrs.widthSum;

				$attrs.dynamicPanes.each(function(i, e) {
					var t = $(this);
					var weight = t.attr("weight");

					var size = (spaceToFill / $attrs.weightSum) * weight;

					t.css($attrs.flowDimension, size);

				});

			};

			$scope.parseSize = function(size) {

				var num = regexNum.exec(size)[0];
				var unit = regexUnit.exec(size)[0];
				return {
					number : num,
					unit : unit
				};
			}

			$scope.sumAttribute = function(collection, attribute) {
				var sum = 0;

				collection.each(function(i, e) {
					sum += parseInt( $(e).attr(attribute), 10);
				});

				return sum;
			}

			// Set up the resize event and then trigger it
			// once just to set everything up
			$(window).resize($scope.resize);
		}
	};
});