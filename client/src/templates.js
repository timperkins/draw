angular.module('templates-app', ['canvas/canvas.tpl.html', 'canvas/draw-outline.tpl.html', 'canvas/draw-rect.tpl.html', 'components/draw-input.tpl.html', 'header/header.tpl.html', 'panel/panel.tpl.html', 'toolbar/toolbar.tpl.html']);

angular.module("canvas/canvas.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("canvas/canvas.tpl.html",
    "<div class=\"canvas-wrap\" ng-controller=\"CanvasController\">\n" +
    "  <svg \n" +
    "    class=\"canvas\" \n" +
    "    ng-class=\"{\n" +
    "      draw: state.tool == 'rectangle', \n" +
    "      transform: state.tool == 'transform',\n" +
    "      text: state.tool == 'text'\n" +
    "    }\" \n" +
    "    ng-mousedown=\"mouseDown($event)\" \n" +
    "    ng-mousemove=\"mouseMove($event)\" \n" +
    "    ng-mouseup=\"mouseUp($event)\">\n" +
    "\n" +
    "    \n" +
    "\n" +
    "    <svg ng-repeat=\"layer in layers | reverse\">\n" +
    "      <draw-rect ng-if=\"layer.type == 'rectangle'\" layer=\"layer\"></draw-rect>\n" +
    "     <!--  <foreignObject ng-if=\"shape.type == 'text'\" ng-attr-x=\"{{ shape.x }}\" ng-attr-y=\"{{ shape.y }}\" ng-attr-width=\"{{ shape.getWidth() }}\" ng-attr-height=\"{{ shape.getHeight() }}\" ng-controller=\"ShapeCtrl\" ng-class=\"{active: shape.active}\">\n" +
    "        <textarea \n" +
    "          class=\"svg-text\" \n" +
    "          ng-controller=\"TextCtrl\" \n" +
    "          ng-style=\"{\n" +
    "            width: shape.getWidth() + 'px',\n" +
    "            height: shape.getHeight() + 'px',\n" +
    "            'font-size': shape.size + 'px',\n" +
    "            color: shape.color\n" +
    "          }\" \n" +
    "          ng-click=\"click($event)\" \n" +
    "          ng-mousedown=\"mouseDown($event)\" \n" +
    "          ng-mouseup=\"mouseUp($event)\" \n" +
    "          ng-focus=\"focus()\"></textarea>\n" +
    "      </foreignObject> -->\n" +
    "    </svg>\n" +
    "    <svg>\n" +
    "      <draw-outline ng-if=\"layerCurrent.layer\" layer=\"layerCurrent.layer\"></draw-outline>\n" +
    "    </svg> \n" +
    "  </svg>\n" +
    "</div>");
}]);

angular.module("canvas/draw-outline.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("canvas/draw-outline.tpl.html",
    "<svg class=\"layer-outline\">\n" +
    "  <text ng-attr-x=\"{{ layer.x + layer.width + 20 }}\" ng-attr-y=\"{{ layer.y + 10 }}\" class=\"dimension-text\" ng-show=\"layer.drawing\">[{{ layer.width }} x {{ layer.height}}]</text>\n" +
    "  <rect \n" +
    "    class=\"outline\" ng-class=\"{drawing: layer.drawing}\"\n" +
    "    ng-attr-x=\"{{ layer.x }}\" \n" +
    "    ng-attr-y=\"{{ layer.y }}\" \n" +
    "    ng-attr-width=\"{{ layer.width }}\" \n" +
    "    ng-attr-height=\"{{ layer.height }}\" />\n" +
    "  <line \n" +
    "    class=\"resize-line resize-line-n\"\n" +
    "    ng-attr-x1=\"{{ layer.x }}\" \n" +
    "    ng-attr-x2=\"{{ layer.x + layer.width }}\" \n" +
    "    ng-attr-y1=\"{{ layer.y - 2 }}\" \n" +
    "    ng-attr-y2=\"{{ layer.y }}\" \n" +
    "    ng-mouseDown=\"layer.mouseDown($event, 'resizeLineN')\" />\n" +
    "  <line \n" +
    "    class=\"resize-line resize-line-e\"\n" +
    "    ng-attr-x1=\"{{ layer.x + layer.width }}\" \n" +
    "    ng-attr-x2=\"{{ layer.x + layer.width }}\" \n" +
    "    ng-attr-y1=\"{{ layer.y }}\" \n" +
    "    ng-attr-y2=\"{{ layer.y + layer.height }}\" \n" +
    "    ng-mouseDown=\"layer.mouseDown($event, 'resizeLineE')\" />\n" +
    "  <line \n" +
    "    class=\"resize-line resize-line-s\"\n" +
    "    ng-attr-x1=\"{{ layer.x }}\" \n" +
    "    ng-attr-x2=\"{{ layer.x + layer.width }}\" \n" +
    "    ng-attr-y1=\"{{ layer.y + layer.height }}\" \n" +
    "    ng-attr-y2=\"{{ layer.y + layer.height }}\"\n" +
    "    ng-mouseDown=\"layer.mouseDown($event, 'resizeLineS')\" />\n" +
    "  <line \n" +
    "    class=\"resize-line resize-line-w\"\n" +
    "    ng-attr-x1=\"{{ layer.x }}\" \n" +
    "    ng-attr-x2=\"{{ layer.x }}\" \n" +
    "    ng-attr-y1=\"{{ layer.y }}\" \n" +
    "    ng-attr-y2=\"{{ layer.y + layer.height }}\"\n" +
    "    ng-mouseDown=\"layer.mouseDown($event, 'resizeLineW')\" />\n" +
    "</svg>");
}]);

angular.module("canvas/draw-rect.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("canvas/draw-rect.tpl.html",
    "<svg class=\"layer-wrap\">\n" +
    "  <rect \n" +
    "  	class=\"layer\" \n" +
    "  	ng-attr-x=\"{{ layer.x }}\" \n" +
    "  	ng-attr-y=\"{{ layer.y }}\" \n" +
    "  	ng-attr-width=\"{{ layer.width }}\" \n" +
    "  	ng-attr-height=\"{{ layer.height }}\" \n" +
    "  	ng-attr-stroke=\"{{ layer.stroke.color }}\" \n" +
    "  	ng-attr-stroke-width=\"{{ layer.stroke.width }}\" \n" +
    "    ng-attr-fill=\"{{ layer.color }}\"\n" +
    "    ng-attr-fill-opacity=\"{{ layer.drawing ? 0.3 : layer.fillOpacity * .01 }}\"\n" +
    "    ng-attr-rx=\"{{ layer.radius }}\"\n" +
    "    ng-attr-ry=\"{{ layer.radius }}\" />\n" +
    "</svg>");
}]);

angular.module("components/draw-input.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("components/draw-input.tpl.html",
    "<span>\n" +
    "<input type=\"text\" class=\"input-dark attr-edit\" ng-model=\"tempModel\" ng-blur=\"blur($event)\" ng-focus=\"focus($event)\" />\n" +
    "</span>");
}]);

angular.module("header/header.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("header/header.tpl.html",
    "<div class=\"header-wrap\" ng-controller=\"HeaderController\">\n" +
    "	<h1>Draw</h1>\n" +
    "	<button class=\"active-color\" ng-style=\"{background: colorPalette.color}\" ng-click=\"showColors($event, colorPalette)\"></button>\n" +
    "	<!-- <div class=\"font-size-wrap\" ng-if=\"state.tool == 'text'\">\n" +
    "	  <input type=\"text\" class=\"font-size-input\" ng-model=\"current.shape.font.size\" /><div class=\"btn-group font-size-dropdown\" dropdown>\n" +
    "	    <button type=\"button\" class=\"btn btn-primary dropdown-toggle\">\n" +
    "	      <span class=\"caret\"></span>\n" +
    "	    </button>\n" +
    "	    <ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\">\n" +
    "	      <li ng-repeat=\"SIZE in FONT_SIZES\"><button ng-click=\"fontSizeClick($event, SIZE)\">{{ SIZE }}</button></li>\n" +
    "	    </ul>\n" +
    "	  </div>\n" +
    "	</div> -->\n" +
    "</div>");
}]);

angular.module("panel/panel.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("panel/panel.tpl.html",
    "<div class=\"panel-wrap\" ng-controller=\"PanelController\">\n" +
    "  <div class=\"panel\" ng-class=\"{\n" +
    "        secondary: state.panel == 'secondary',\n" +
    "        colors: state.panel == 'colors'\n" +
    "      }\">\n" +
    "    <div class=\"panel-main\">\n" +
    "      <div class=\"btn-group-vertical layer-layers\" ui-sortable ng-model=\"layers\">\n" +
    "        <label class=\"btn\" ng-repeat=\"layer in layers\" ng-model=\"layerCurrent.layer\" btn-radio=\"layer\" ng-click=\"layerClick(layer)\">\n" +
    "          <div class=\"clearfix\">\n" +
    "            <i ng-if=\"layer.type == 'rectangle'\" class=\"thumbnail thumbnail-box\" ng-style=\"{background: layer.color}\"></i>\n" +
    "            <i ng-if=\"layer.type == 'text'\" class=\"thumbnail thumbnail-text fa fa-font\" ng-style=\"{color: '{{ colorPalette.color }}'}\"></i>\n" +
    "            <p class=\"text\">{{ layer.title }}</p>\n" +
    "            <i class=\"edit-layer fa fa-pencil\" ng-click=\"showSecondary($event, layer)\"></i> \n" +
    "          </div>\n" +
    "        </label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"panel-secondary\">\n" +
    "      <div class=\"top-wrap\">\n" +
    "        <i class=\"back fa fa-arrow-left\" ng-click=\"hideSecondary($event)\"></i>\n" +
    "      </div>\n" +
    "      <div class=\"title-edit-wrap\">\n" +
    "        <input type=\"text\" class=\"input-dark title-edit\" ng-model=\"layerCurrent.layer.title\" />\n" +
    "        <br><br>\n" +
    "      </div>\n" +
    "      <div class=\"attr-detail\">\n" +
    "        <div class=\"half-width-outer\">\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">Opacity:</label><draw-input draw-model=\"layerCurrent.layer.fillOpacity\" unit=\"%\"></draw-input>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "            <label class=\"attr-label\">Color:</label><button class=\"layer-color\" ng-style=\"{background: layerCurrent.layer.color}\" ng-click=\"showColors($event, layerCurrent.layer)\"></button>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">X:</label><draw-input draw-model=\"layerCurrent.layer.x\" unit=\"px\"></draw-input>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">Y:</label><draw-input draw-model=\"layerCurrent.layer.y\" unit=\"px\"></draw-input>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">Width:</label><draw-input draw-model=\"layerCurrent.layer.width\" unit=\"px\"></draw-input>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">Height:</label><draw-input draw-model=\"layerCurrent.layer.height\" unit=\"px\"></draw-input>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">Stroke:</label><draw-input draw-model=\"layerCurrent.layer.stroke.width\" unit=\"px\"></draw-input>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">Str Col:</label><button class=\"layer-color\" ng-style=\"{background: layerCurrent.layer.stroke.color}\" ng-click=\"showColors($event, layerCurrent.layer.stroke)\"></button>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "          <div class=\"half-width-wrap\">\n" +
    "            <div class=\"half-width\">\n" +
    "              <label class=\"attr-label\">Radius:</label><draw-input draw-model=\"layerCurrent.layer.radius\" unit=\"px\"></draw-input>\n" +
    "            </div>\n" +
    "          </div>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "    <div class=\"panel-colors\">\n" +
    "      <div class=\"top-wrap\">\n" +
    "        <i class=\"back fa fa-arrow-left\" ng-click=\"hideColors($event)\"></i>\n" +
    "      </div>\n" +
    "      <div class=\"btn-group color-palette\">\n" +
    "      	<!-- {{ colorPalette.current.model }} -->\n" +
    "        <label ng-repeat=\"color in colorPalette.palette\" class=\"btn\" ng-style=\"{background: '{{ color }}'}\" ng-model=\"colorPalette.current.model.color\" btn-radio=\"'{{ color }}'\"></label>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>");
}]);

angular.module("toolbar/toolbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("toolbar/toolbar.tpl.html",
    "<div class=\"toolbar-wrap\" ng-controller=\"ToolbarController\">\n" +
    "	<div class=\"btn-group-vertical\">\n" +
    "	  <label class=\"btn\" ng-model=\"state.tool\" btn-radio=\"'transform'\"><i class=\"fa fa-arrows\"></i></label>\n" +
    "	  <label class=\"btn\" ng-model=\"state.tool\" btn-radio=\"'rectangle'\"><i class=\"fa fa-square\"></i></label>\n" +
    "	  <label class=\"btn\" ng-model=\"state.tool\" btn-radio=\"'text'\"><i class=\"fa fa-font\"></i></label>\n" +
    "	</div>\n" +
    "</div>");
}]);
